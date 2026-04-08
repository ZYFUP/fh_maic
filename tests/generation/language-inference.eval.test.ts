/**
 * Language Inference — Real LLM Evaluation Tests
 *
 * Tests language inference via the actual outline generation pipeline.
 * Uses LLM-as-judge to evaluate if the directive matches the ground truth.
 * Calls real LLM APIs — meant to be run locally, NOT in CI/CD.
 *
 * Usage:
 *   pnpm vitest run tests/generation/language-inference.eval.test.ts
 *
 * Results are written to tests/generation/language-inference.eval.result.md
 *
 * Requires server-providers.yml or env vars with valid LLM API keys.
 */

import { describe, it, expect, afterAll } from 'vitest';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { generateText } from 'ai';
import { inferLanguageDirective } from '@/lib/generation/language-inference';
import { resolveModel } from '@/lib/server/resolve-model';

// ---------------------------------------------------------------------------
// Test case definition
// ---------------------------------------------------------------------------

interface LanguageTestCase {
  name: string;
  requirement: string;
  pdfText?: string;
  userBio?: string;
  browserLocale?: string;
  /** Ground truth: what the directive SHOULD convey */
  groundTruth: string;
}

// ---------------------------------------------------------------------------
// Test cases
// ---------------------------------------------------------------------------

const TEST_CASES: LanguageTestCase[] = [
  {
    name: 'Pure Chinese requirement',
    requirement: '从零学 Python，适合初中生',
    groundTruth:
      'Teaching language: Chinese. Programming terms like Python, variable, function should be kept in English.',
  },
  {
    name: 'Pure English requirement',
    requirement: 'Explain quantum computing for high school students',
    groundTruth:
      'Teaching language: English. Scientific terms like qubit, superposition can be kept as-is or explained in accessible language for the target audience.',
  },
  {
    name: 'Japanese requirement',
    requirement: 'Pythonの基礎を学びたいです。初心者向けにお願いします',
    groundTruth:
      'Teaching language: Japanese. Programming terms like Python should be kept in English.',
  },
  {
    name: 'Korean requirement',
    requirement: '파이썬 기초를 배우고 싶습니다. 초보자용으로 부탁드립니다',
    groundTruth:
      'Teaching language: Korean. Programming terms like Python should be kept in English.',
  },
  {
    name: 'Chinese user wants English course',
    requirement: '帮我准备一堂英语课，初中水平',
    groundTruth:
      'Teaching language: Chinese. This is a Chinese student learning English at middle school level. The course should be taught primarily in Chinese, with English vocabulary, phrases and example sentences introduced progressively. Bilingual approach.',
  },
  {
    name: 'Chinese user learning Japanese',
    requirement: '帮我做一个日语入门课程，从五十音图开始',
    groundTruth:
      'Teaching language: Chinese. This is a complete beginner learning Japanese (starting from the fifty-sound chart). The course must be taught in Chinese with Japanese content introduced and explained in Chinese. Bilingual approach.',
  },
  {
    name: 'Japanese user wants English teaching',
    requirement: '英語でPythonを教えてください',
    groundTruth:
      'Teaching language: English (explicitly requested by the user). The user is a native Japanese speaker. Programming terms should be kept in English. May provide Japanese explanations for difficult concepts.',
  },
  {
    name: 'Chinese user with English PDF',
    requirement: '用中文讲解这篇论文',
    pdfText:
      'Abstract: This paper presents a novel approach to transformer-based language models, demonstrating significant improvements in few-shot learning performance.',
    groundTruth:
      'Teaching language: Chinese. The source document is in English, so English technical terms should be shown alongside Chinese translations when first introduced.',
  },
  {
    name: 'English user with Chinese PDF',
    requirement: 'Explain this paper in English',
    pdfText:
      '摘要：本文提出了一种基于Transformer的语言模型新方法，在少样本学习性能方面展示了显著改进。',
    groundTruth:
      'Teaching language: English. The source document is in Chinese but technical terms are already in English, so just teach in English naturally.',
  },
  {
    name: 'Chinese technical course (React hooks)',
    requirement: '讲一下 React hooks 的原理，包括 useState 和 useEffect',
    groundTruth:
      'Teaching language: Chinese. Programming terms like React, hooks, useState, useEffect should be kept in English.',
  },
  {
    name: 'Chinese course on machine learning',
    requirement: '机器学习入门：监督学习和非监督学习',
    groundTruth:
      'Teaching language: Chinese. Technical terms like Machine Learning, supervised/unsupervised learning should be kept in English or shown bilingually.',
  },
  {
    name: 'Mixed Chinese-English requirement',
    requirement: '做一个 Next.js 14 的 tutorial，用中文讲',
    groundTruth:
      'Teaching language: Chinese. Technical terms like Next.js should be kept in English.',
  },
  {
    name: 'Extremely short requirement (Chinese)',
    requirement: '讲讲光合作用',
    groundTruth:
      'Teaching language: Chinese. Biology terms should use standard Chinese translations (e.g., 光合作用, 叶绿体).',
  },
  {
    name: 'Extremely short requirement (English) + English locale',
    requirement: 'Photosynthesis',
    browserLocale: 'en-US',
    groundTruth:
      'Teaching language: English. Biology terms should use standard English terminology.',
  },
  {
    name: 'Ambiguous requirement + Chinese user bio',
    requirement: 'Photosynthesis',
    userBio: '计算机专业大三学生',
    groundTruth:
      'Teaching language: Chinese (inferred from user bio being in Chinese). Biology terms should use Chinese translations.',
  },
  {
    name: 'Ambiguous requirement + Japanese browser locale',
    requirement: 'Machine Learning',
    browserLocale: 'ja-JP',
    groundTruth:
      'Teaching language: Japanese (inferred from browser locale). Technical terms like Machine Learning should be kept in English.',
  },
  {
    name: 'Chinese user with Japanese PDF',
    requirement: '帮我分析这篇日文文献',
    pdfText:
      'この研究では、深層学習モデルを用いた自然言語処理の新しいアプローチを提案する。実験結果は従来手法を上回る性能を示した。',
    groundTruth:
      'Teaching language: Chinese (requirement is written in Chinese). The source document is in Japanese, so Japanese terms should be shown alongside Chinese translations.',
  },
];

// ---------------------------------------------------------------------------
// LLM Judge
// ---------------------------------------------------------------------------

const JUDGE_SYSTEM_PROMPT = `You are evaluating whether a language directive for an AI course generation system is reasonable given the expected behavior.

You will be given:
1. The original user requirement
2. The generated language directive
3. The ground truth description of expected behavior

Evaluation criteria — the directive should:
- Use the correct primary teaching language
- Handle terminology in a reasonable way for the subject and audience
- For cross-language scenarios (foreign language learning, cross-language PDF), acknowledge both languages in some way

Be LENIENT in your evaluation:
- The directive does NOT need to match the ground truth word-for-word
- Different but equally valid approaches should PASS (e.g., "keep terms in English" vs "explain terms in simple language" are both valid)
- If the teaching language is correct and the overall approach is reasonable, it should PASS
- Only FAIL if the directive is clearly WRONG or MISSING a critical aspect (e.g., wrong teaching language, completely ignoring a cross-language situation)

Respond with ONLY a JSON object:
{
  "pass": true/false,
  "reason": "brief explanation (1-2 sentences)"
}`;

interface JudgeResult {
  pass: boolean;
  reason: string;
}

async function judgeDirective(
  requirement: string,
  directive: string,
  groundTruth: string,
): Promise<JudgeResult> {
  const { model } = resolveModel({});
  const result = await generateText({
    model,
    system: JUDGE_SYSTEM_PROMPT,
    prompt: `Requirement: "${requirement}"\n\nGenerated directive: "${directive}"\n\nGround truth: "${groundTruth}"`,
    temperature: 0,
  });

  try {
    const text = result.text.replace(/```json\s*|\s*```/g, '').trim();
    return JSON.parse(text) as JudgeResult;
  } catch {
    return { pass: false, reason: `Failed to parse judge response: ${result.text}` };
  }
}

// ---------------------------------------------------------------------------
// Result collector
// ---------------------------------------------------------------------------

interface EvalResult {
  name: string;
  input: string;
  pdfText?: string;
  userBio?: string;
  appLocale?: string;
  groundTruth: string;
  directive: string;
  judgePassed: boolean;
  judgeReason: string;
}

const results: EvalResult[] = [];

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

describe('Language Inference Evaluation', () => {
  for (const tc of TEST_CASES) {
    it(tc.name, { timeout: 30_000 }, async () => {
      // Step 1: Infer language directive
      const directive = await inferLanguageDirective({
        requirement: tc.requirement,
        pdfTextSample: tc.pdfText?.slice(0, 200),
        userBio: tc.userBio,
        appLocale: tc.browserLocale,
      });

      expect(directive, 'directive should not be empty').toBeTruthy();

      // Step 2: LLM-as-judge
      const judge = await judgeDirective(tc.requirement, directive, tc.groundTruth);

      results.push({
        name: tc.name,
        input: tc.requirement,
        pdfText: tc.pdfText,
        userBio: tc.userBio,
        appLocale: tc.browserLocale,
        groundTruth: tc.groundTruth,
        directive,
        judgePassed: judge.pass,
        judgeReason: judge.reason,
      });

      expect(judge.pass, `Judge failed: ${judge.reason}`).toBe(true);
    });
  }

  // Write results file after all tests
  afterAll(() => {
    if (results.length === 0) return;

    const passed = results.filter((r) => r.judgePassed).length;
    const total = results.length;

    const lines: string[] = [
      `# Language Inference Eval Results`,
      ``,
      `- **Date**: ${new Date().toISOString()}`,
      `- **Passed**: ${passed}/${total} (${((passed / total) * 100).toFixed(0)}%)`,
      `- **Model**: ${process.env.DEFAULT_MODEL || '(default)'}`,
      `- **Method**: standalone language inference + LLM-as-judge`,
      ``,
      `## Detail`,
      ``,
    ];

    for (const r of results) {
      const icon = r.judgePassed ? 'PASS' : '**FAIL**';

      const extras: string[] = [];
      if (r.pdfText) extras.push(`PDF: "${r.pdfText.slice(0, 40)}..."`);
      if (r.userBio) extras.push(`Bio: "${r.userBio}"`);
      if (r.appLocale) extras.push(`Locale: ${r.appLocale}`);
      const extraStr = extras.length > 0 ? ` (${extras.join(', ')})` : '';

      lines.push(`### ${icon} ${r.name}`);
      lines.push(``);
      lines.push(`- **Input**: \`${r.input}\`${extraStr}`);
      lines.push(`- **Ground truth**: ${r.groundTruth}`);
      lines.push(`- **Directive**: ${r.directive}`);
      lines.push(`- **Judge**: ${r.judgePassed ? 'PASS' : 'FAIL'} — ${r.judgeReason}`);
      lines.push(``);
    }

    lines.push(`## Summary`);
    lines.push(``);
    lines.push(`| # | Case | Result | Directive | Judge reason |`);
    lines.push(`|---|------|--------|-----------|--------------|`);
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const icon = r.judgePassed ? 'PASS' : 'FAIL';
      lines.push(`| ${i + 1} | ${r.name} | ${icon} | ${r.directive} | ${r.judgeReason} |`);
    }
    lines.push(``);

    const outPath = resolve(__dirname, 'language-inference.eval.result.md');
    writeFileSync(outPath, lines.join('\n'), 'utf-8');
    console.log(`\nResults written to: ${outPath}`);
  });
});
