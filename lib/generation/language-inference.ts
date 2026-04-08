/**
 * Language Inference
 *
 * Infers a natural-language directive describing the course language behavior
 * from user requirements and contextual signals. Standalone LLM call,
 * decoupled from outline/agent generation.
 */

import { generateText } from 'ai';
import type { LanguageModel } from 'ai';
import { resolveModel } from '@/lib/server/resolve-model';
import { parseJsonResponse } from '@/lib/generation/json-repair';
import type { LanguageDirective } from '@/lib/types/language-directive';

export interface InferLanguageInput {
  /** User's course requirement text (primary signal) */
  requirement: string;
  /** First ~200 chars of uploaded PDF text (LLM detects language from raw content) */
  pdfTextSample?: string;
  /** User's self-description / bio from profile */
  userBio?: string;
  /** App locale from i18n (e.g., "zh-CN", "en-US", "ja-JP") */
  appLocale?: string;
}

const SYSTEM_PROMPT = `You are a language analyst for an AI course generation platform. Infer the language configuration for a course from available signals.

## Available signals (in priority order)

1. **Course requirement text** (ALWAYS present) — the user's own words describing what they want. This is the strongest signal for both native language and teaching intent.
2. **Uploaded document text sample** (optional) — a snippet from an uploaded PDF/document. Use to detect source material language, which affects terminology handling.
3. **User bio** (optional) — the user's self-description. May reveal native language if the requirement text is ambiguous.
4. **App locale** (optional) — the user's app language setting. Weakest signal — only use as a tiebreaker when requirement text is too short to determine native language.

## Output

A JSON object with a single field:

{ "directive": "2-5 sentence natural language instruction" }

The directive must address:
- **Teaching language**: What language to generate course content in. If the user writes in language X without requesting another → use X. If they write in language X but request a foreign language course for beginners (e.g., "帮我准备一堂英语课，初中水平"), the teaching language should be X (the user's native language), with the target language introduced progressively. If the user explicitly requests teaching in another language they seem proficient in (e.g., "英語でPythonを教えてください"), use the requested language.
- **Terminology handling**: How to handle domain terms — keep in original language, translate, or show bilingually.
- **Cross-language situations**: If documents are in a different language than teaching, explain how to bridge the two.

## Examples

| Input | directive |
|---|---|
| "从零学 Python，适合初中生" | "用中文授课。编程术语如 Python、variable、function 等保留英文原文，首次出现时附简短中文解释。" |
| "帮我准备一堂英语课，初中水平" | "用中文授课，教授英语基础知识。英语词汇和例句逐步引入，用中文解释语法和用法。" |
| "帮我做一个日语入门课程，从五十音图开始" | "用中文授课，教授日语入门内容。五十音图及日语词汇用中文讲解，逐步引入日语表达。" |
| "英語でPythonを教えてください" | "Teach Python in English. The student is a native Japanese speaker, so provide Japanese translations for difficult concepts. Keep programming terms in English." |
| "讲讲光合作用" | "用中文授课。生物学术语使用中文标准译名，如"光合作用""叶绿体""气孔"等。" |
| "用中文讲解这篇论文" + English PDF | "用中文讲解。论文原文为英文，专业术语首次出现时保留英文原文并附中文翻译，方便学生对照原文理解。" |
| "帮我分析这篇日文文献" + Japanese PDF | "用中文讲解。文献原文为日文，关键术语首次出现时标注日文原文及中文翻译，便于学生理解原文。" |
| "Photosynthesis" + App locale: zh-CN | "用中文授课，讲解光合作用的基本概念和过程。生物学术语使用中文标准译名。" |
| "Machine Learning" + App locale: ja-JP | "日本語で授業を行います。Machine Learningなどの技術用語は英語のまま使用し、初出時に日本語の説明を付けます。" |

Output ONLY a valid JSON object, no markdown fences, no extra text.`;

function buildUserPrompt(input: InferLanguageInput): string {
  const parts: string[] = [`Course requirement: "${input.requirement}"`];

  if (input.pdfTextSample) {
    parts.push(`\nUploaded document text sample:\n"""\n${input.pdfTextSample}\n"""`);
  }

  if (input.userBio) {
    parts.push(`\nUser bio: "${input.userBio}"`);
  }

  if (input.appLocale) {
    parts.push(`\nApp locale: ${input.appLocale}`);
  }

  return parts.join('');
}

/**
 * Infer language directive from user input and contextual signals.
 * Can accept an optional pre-resolved model to avoid double resolution.
 */
export async function inferLanguageDirective(
  input: InferLanguageInput,
  model?: LanguageModel,
): Promise<LanguageDirective> {
  const resolvedModel = model ?? resolveModel({}).model;

  const result = await generateText({
    model: resolvedModel,
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(input),
    temperature: 0,
  });

  const parsed = parseJsonResponse<{ directive: string }>(result.text);

  if (!parsed?.directive) {
    throw new Error(`Failed to parse language directive from LLM response: ${result.text}`);
  }

  return parsed.directive;
}
