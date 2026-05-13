/**
 * Music Generation Service -- routes to provider adapters
 */

import type {
  MusicProviderId,
  MusicGenerationConfig,
  MusicGenerationOptions,
  MusicGenerationResult,
  MusicProviderConfig,
} from './types';
import {
  generateWithMiniMaxMusic,
  testMiniMaxMusicConnectivity,
} from './adapters/minimax-music-adapter';

export const MUSIC_PROVIDERS: Record<MusicProviderId, MusicProviderConfig> = {
  'minimax-music': {
    id: 'minimax-music',
    name: 'MiniMax Music',
    requiresApiKey: true,
    defaultBaseUrl: 'https://api.minimaxi.com',
    models: [
      { id: 'music-2.6', name: 'Music 2.6' },
      { id: 'music-2.5', name: 'Music 2.5' },
      { id: 'music-2.0', name: 'Music 2.0' },
      { id: 'music-1.5', name: 'Music 1.5' },
      { id: 'music-cover', name: 'Music Cover (翻唱)' },
    ],
  },
};

export async function testMusicConnectivity(
  config: MusicGenerationConfig,
): Promise<{ success: boolean; message: string }> {
  switch (config.providerId) {
    case 'minimax-music':
      return testMiniMaxMusicConnectivity(config);
    default:
      return {
        success: false,
        message: `Unsupported music provider: ${config.providerId}`,
      };
  }
}

export async function generateMusic(
  config: MusicGenerationConfig,
  options: MusicGenerationOptions,
): Promise<MusicGenerationResult> {
  switch (config.providerId) {
    case 'minimax-music':
      return generateWithMiniMaxMusic(config, options);
    default:
      throw new Error(`Unsupported music provider: ${config.providerId}`);
  }
}
