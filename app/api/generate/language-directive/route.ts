/**
 * Language Directive Inference API
 *
 * Lightweight LLM call to infer the language behavior for a course.
 * Called before agent profile and outline generation so all downstream
 * steps can use the same language directive.
 */

import { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/server/api-response';
import { resolveModelFromHeaders } from '@/lib/server/resolve-model';
import { inferLanguageDirective } from '@/lib/generation/language-inference';
import { createLogger } from '@/lib/logger';

const log = createLogger('Language Directive API');

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requirement, pdfTextSample, userBio, appLocale } = body as {
      requirement?: string;
      pdfTextSample?: string;
      userBio?: string;
      appLocale?: string;
    };

    if (!requirement) {
      return apiError('MISSING_REQUIRED_FIELD', 400, 'requirement is required');
    }

    const { model } = resolveModelFromHeaders(req);

    const directive = await inferLanguageDirective(
      { requirement, pdfTextSample, userBio, appLocale },
      model,
    );

    log.info(`Language directive inferred: "${directive}"`);

    return apiSuccess({ directive });
  } catch (error) {
    log.error('Language directive inference failed:', error);
    return apiError('INTERNAL_ERROR', 500, error instanceof Error ? error.message : String(error));
  }
}
