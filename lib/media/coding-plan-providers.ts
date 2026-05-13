/**
 * Coding Plan Service -- routes to provider adapters
 * MiniMax Coding Plan: provides coding plan generation with VLM and search capabilities
 */

import type {
  CodingPlanProviderId,
  CodingPlanGenerationConfig,
  CodingPlanGenerationOptions,
  CodingPlanGenerationResult,
  CodingPlanProviderConfig,
} from './types';
import {
  generateWithMiniMaxCodingPlan,
  testMiniMaxCodingPlanConnectivity,
} from './adapters/minimax-coding-plan-adapter';

export const CODING_PLAN_PROVIDERS: Record<CodingPlanProviderId, CodingPlanProviderConfig> = {
  'minimax-coding-plan': {
    id: 'minimax-coding-plan',
    name: 'MiniMax Coding Plan',
    requiresApiKey: true,
    defaultBaseUrl: 'https://api.minimaxi.com',
    models: [
      { id: 'coding-plan-vlm', name: 'Coding Plan VLM' },
      { id: 'coding-plan-search', name: 'Coding Plan Search' },
    ],
  },
};

export async function testCodingPlanConnectivity(
  config: CodingPlanGenerationConfig,
): Promise<{ success: boolean; message: string }> {
  switch (config.providerId) {
    case 'minimax-coding-plan':
      return testMiniMaxCodingPlanConnectivity(config);
    default:
      return {
        success: false,
        message: `Unsupported coding plan provider: ${config.providerId}`,
      };
  }
}

export async function generateCodingPlan(
  config: CodingPlanGenerationConfig,
  options: CodingPlanGenerationOptions,
): Promise<CodingPlanGenerationResult> {
  switch (config.providerId) {
    case 'minimax-coding-plan':
      return generateWithMiniMaxCodingPlan(config, options);
    default:
      throw new Error(`Unsupported coding plan provider: ${config.providerId}`);
  }
}
