/**
 * MiniMax Coding Plan Adapter
 * Supports: coding-plan-vlm, coding-plan-search
 * API: POST /v1/coding_plan/vlm (image understanding + coding plan)
 *       POST /v1/coding_plan/search (web search + coding plan)
 * Docs: https://platform.minimaxi.com/document/Guides
 */

import type {
  CodingPlanGenerationConfig,
  CodingPlanGenerationOptions,
  CodingPlanGenerationResult,
} from '../types';

const BASE_URL = 'https://api.minimaxi.com';

interface MiniMaxCodingPlanResponse {
  base_resp?: {
    status_code: number;
    status_msg: string;
  };
  data?: {
    content?: string;
    text?: string;
    result?: string;
  };
}

function getEndpoint(model?: string): string {
  switch (model) {
    case 'coding-plan-search':
      return '/v1/coding_plan/search';
    case 'coding-plan-vlm':
    default:
      return '/v1/coding_plan/vlm';
  }
}

export async function generateWithMiniMaxCodingPlan(
  config: CodingPlanGenerationConfig,
  options: CodingPlanGenerationOptions,
): Promise<CodingPlanGenerationResult> {
  const baseUrl = (config.baseUrl || BASE_URL).replace(/\/$/, '');
  const model = config.model || 'coding-plan-vlm';
  const endpoint = getEndpoint(model);

  const body: Record<string, unknown> = {
    model,
  };

  if (options.prompt) {
    body.prompt = options.prompt;
  }

  if (options.query) {
    body.query = options.query;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText);
    throw new Error(`MiniMax Coding Plan error: ${errText}`);
  }

  const data: MiniMaxCodingPlanResponse = await response.json();

  if (data.base_resp?.status_code !== 0 && data.base_resp?.status_code !== undefined) {
    const code = data.base_resp.status_code;
    const msg = data.base_resp.status_msg || 'unknown error';
    throw new Error(`MiniMax Coding Plan API error ${code}: ${msg}`);
  }

  const content =
    data?.data?.content || data?.data?.text || data?.data?.result || JSON.stringify(data);

  return { content };
}

export async function testMiniMaxCodingPlanConnectivity(
  config: CodingPlanGenerationConfig,
): Promise<{ success: boolean; message: string }> {
  try {
    const baseUrl = (config.baseUrl || BASE_URL).replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/v1/coding_plan/vlm`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        model: 'coding-plan-vlm',
        prompt: 'test connectivity',
      }),
    });

    if (response.ok) {
      return { success: true, message: 'MiniMax Coding Plan API connected' };
    }

    const errData = await response.json().catch(() => ({}));
    const msg = errData?.base_resp?.status_msg || response.statusText;
    return { success: false, message: `API error: ${msg}` };
  } catch (err) {
    return { success: false, message: `Connection failed: ${(err as Error).message}` };
  }
}
