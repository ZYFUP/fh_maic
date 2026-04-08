/**
 * Language Directive Type
 *
 * A natural-language instruction inferred by the LLM that describes
 * the language behavior for a course. Injected into downstream prompts
 * for content generation, TTS, quiz grading, etc.
 */

/** Natural-language directive inferred from user input and context. */
export type LanguageDirective = string;
