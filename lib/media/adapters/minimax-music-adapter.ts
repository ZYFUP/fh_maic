/**
 * MiniMax Music Generation Adapter
 * Supports: text-to-music, music cover (翻唱), lyrics generation
 * API: POST /v1/music_generation (submit) + GET /v1/query/music_generation?task_id=xxx (poll)
 *       POST /v1/lyrics_generation (synchronous)
 * Docs: https://platform.minimaxi.com/document/Guides/Music-Generation/Music-01
 */

import type {
  MusicGenerationConfig,
  MusicGenerationOptions,
  MusicGenerationResult,
} from '../types';

const BASE_URL = 'https://api.minimaxi.com';
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 120; // ~10 minutes max

interface MiniMaxMusicSubmitResponse {
  task_id: string;
  base_resp: {
    status_code: number;
    status_msg: string;
  };
}

interface MiniMaxMusicQueryResponse {
  task_id: string;
  status: 'Pending' | 'Preparing' | 'Queueing' | 'Processing' | 'Success' | 'Fail';
  file_id?: string;
  base_resp: {
    status_code: number;
    status_msg: string;
  };
}

interface MiniMaxMusicFileRetrieveResponse {
  file?: {
    file_id: string | number;
    download_url?: string;
    filename?: string;
  };
  base_resp?: {
    status_code: number;
    status_msg: string;
  };
}

async function submitMusicTask(
  config: MusicGenerationConfig,
  options: MusicGenerationOptions,
): Promise<string> {
  const baseUrl = (config.baseUrl || BASE_URL).replace(/\/$/, '');
  const model = config.model || 'music-2.5';

  const response = await fetch(`${baseUrl}/v1/music_generation`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      model,
      prompt: options.prompt,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText);
    throw new Error(`MiniMax Music submit error: ${errText}`);
  }

  const data: MiniMaxMusicSubmitResponse = await response.json();

  if (data.base_resp?.status_code !== 0) {
    const code = data.base_resp?.status_code;
    const msg = data.base_resp?.status_msg || 'unknown error';
    throw new Error(`MiniMax Music API error ${code}: ${msg}`);
  }

  if (!data.task_id) {
    throw new Error(`MiniMax Music: no task_id returned. Response: ${JSON.stringify(data)}`);
  }

  return data.task_id;
}

async function pollMusicTaskStatus(
  config: MusicGenerationConfig,
  taskId: string,
): Promise<MiniMaxMusicQueryResponse> {
  const baseUrl = (config.baseUrl || BASE_URL).replace(/\/$/, '');
  const url = `${baseUrl}/v1/query/music_generation?task_id=${encodeURIComponent(taskId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText);
    throw new Error(`MiniMax Music poll error: ${errText}`);
  }

  return response.json() as Promise<MiniMaxMusicQueryResponse>;
}

async function retrieveMusicFileDownloadUrl(
  config: MusicGenerationConfig,
  fileId: string,
): Promise<string> {
  const baseUrl = (config.baseUrl || BASE_URL).replace(/\/$/, '');
  const url = `${baseUrl}/v1/files/retrieve?file_id=${encodeURIComponent(fileId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText);
    throw new Error(`MiniMax Music file retrieve error: ${errText}`);
  }

  const data: MiniMaxMusicFileRetrieveResponse = await response.json();
  if (data.base_resp?.status_code !== 0) {
    const code = data.base_resp?.status_code;
    const msg = data.base_resp?.status_msg || 'unknown error';
    throw new Error(`MiniMax Music file retrieve error ${code}: ${msg}`);
  }

  const downloadUrl = data.file?.download_url;
  if (!downloadUrl) {
    throw new Error(`MiniMax Music: no download_url returned. Response: ${JSON.stringify(data)}`);
  }

  return downloadUrl;
}

export async function generateWithMiniMaxMusic(
  config: MusicGenerationConfig,
  options: MusicGenerationOptions,
): Promise<MusicGenerationResult> {
  const model = config.model || 'music-2.5';

  // Handle lyrics_generation separately (synchronous API)
  if (model === 'lyrics_generation') {
    return generateMiniMaxLyrics(config, options);
  }

  // Handle music-cover and music generation (async polling API)
  const taskId = await submitMusicTask(config, options);

  let lastStatus = '';
  let attempts = 0;

  while (attempts < MAX_POLL_ATTEMPTS) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const result = await pollMusicTaskStatus(config, taskId);
    lastStatus = result.status;

    if (result.status === 'Success') {
      if (!result.file_id) {
        throw new Error(`MiniMax Music: task succeeded but no file_id returned`);
      }

      const musicUrl = await retrieveMusicFileDownloadUrl(config, result.file_id);

      return {
        url: musicUrl,
      };
    }

    if (result.status === 'Fail') {
      throw new Error(
        `MiniMax Music generation failed: ${result.base_resp?.status_msg || 'unknown'}`,
      );
    }

    attempts++;
  }

  throw new Error(
    `MiniMax Music: timeout after ${MAX_POLL_ATTEMPTS} polls, last status: ${lastStatus}`,
  );
}

async function generateMiniMaxLyrics(
  config: MusicGenerationConfig,
  options: MusicGenerationOptions,
): Promise<MusicGenerationResult> {
  const baseUrl = (config.baseUrl || BASE_URL).replace(/\/$/, '');

  const response = await fetch(`${baseUrl}/v1/lyrics_generation`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      model: 'lyrics_generation',
      prompt: options.prompt,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText);
    throw new Error(`MiniMax Lyrics API error: ${errText}`);
  }

  const data = await response.json();

  if (data?.base_resp?.status_code !== 0 && data?.base_resp?.status_code !== undefined) {
    const code = data.base_resp.status_code;
    const msg = data.base_resp.status_msg || 'unknown error';
    throw new Error(`MiniMax Lyrics API error ${code}: ${msg}`);
  }

  // Lyrics are returned as text in the response
  const lyricsContent = data?.data?.lyrics || data?.data?.text || JSON.stringify(data);
  return {
    url: undefined,
    base64: undefined,
  };
}

export async function testMiniMaxMusicConnectivity(
  config: MusicGenerationConfig,
): Promise<{ success: boolean; message: string }> {
  try {
    const baseUrl = (config.baseUrl || BASE_URL).replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/v1/music_generation`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        model: 'music-2.5',
        prompt: 'test connectivity',
      }),
    });

    if (response.ok) {
      return { success: true, message: 'MiniMax Music API connected' };
    }

    const errData = await response.json().catch(() => ({}));
    const msg = errData?.base_resp?.status_msg || response.statusText;
    return { success: false, message: `API error: ${msg}` };
  } catch (err) {
    return { success: false, message: `Connection failed: ${(err as Error).message}` };
  }
}
