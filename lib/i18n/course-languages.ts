/**
 * Curated list of languages available for course generation.
 *
 * To add a new language, append an entry here — no other file changes needed.
 * - code:       BCP-47 tag stored in settings / passed to APIs
 * - label:      Native name shown in the UI (autoglossonym, no i18n needed)
 * - promptName: English name injected into LLM prompts
 */
export const courseLanguages = [
  { code: 'zh-CN', label: '简体中文', promptName: 'Chinese (Simplified)' },
  { code: 'zh-TW', label: '繁體中文', promptName: 'Chinese (Traditional)' },
  { code: 'en-US', label: 'English', promptName: 'English' },
  { code: 'ja', label: '日本語', promptName: 'Japanese' },
  { code: 'ko', label: '한국어', promptName: 'Korean' },
  { code: 'fr', label: 'Français', promptName: 'French' },
  { code: 'de', label: 'Deutsch', promptName: 'German' },
  { code: 'es', label: 'Español', promptName: 'Spanish' },
  { code: 'pt', label: 'Português', promptName: 'Portuguese' },
  { code: 'ru', label: 'Русский', promptName: 'Russian' },
  { code: 'ar', label: 'العربية', promptName: 'Arabic' },
] as const;

export type CourseLanguageCode = (typeof courseLanguages)[number]['code'];

const defaultCode: CourseLanguageCode = 'zh-CN';

/** Get the native display label for a course language code. */
export function getCourseLanguageLabel(code: string): string {
  return courseLanguages.find((l) => l.code === code)?.label ?? code;
}

/** Get the English prompt name for a course language code. */
export function getCourseLanguagePromptName(code: string): string {
  return courseLanguages.find((l) => l.code === code)?.promptName ?? code;
}

/**
 * Find the closest supported course language for a given locale string.
 * Matching order: exact code → base language prefix → default (zh-CN).
 *
 * Examples:
 *   'en-US' → 'en-US'   (exact)
 *   'en-GB' → 'en-US'   (prefix 'en' matches 'en-US')
 *   'zh-TW' → 'zh-TW'   (exact)
 *   'zh'    → 'zh-CN'   (prefix 'zh' matches 'zh-CN', first in list)
 *   'sv'    → 'zh-CN'   (no match, fallback)
 */
export function findClosestCourseLanguage(locale: string): CourseLanguageCode {
  // Exact match
  const exact = courseLanguages.find((l) => l.code === locale);
  if (exact) return exact.code;

  // Base language prefix match (e.g. 'en' from 'en-GB')
  const base = locale.split('-')[0];
  const prefixMatch = courseLanguages.find((l) => l.code.split('-')[0] === base);
  if (prefixMatch) return prefixMatch.code;

  return defaultCode;
}
