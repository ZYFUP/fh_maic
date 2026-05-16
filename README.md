<!--
  方湖 MAIC — AI Classroom Platform based on OpenMAIC

  ⚠️ AGPL-3.0 Compliance Notice:
  This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).
  If you modify and redistribute this software, you MUST:
    1. Clearly document ALL modifications (新增/修改/删除的代码、配置、依赖等)
    2. Provide the complete modified source code
    3. Prominently display this notice and original copyright in all modified versions
    4. Keep the same open source license (AGPL-3.0)

  Any "closed-source fork" that does not disclose modification details violates AGPL-3.0.
  For commercial licensing, contact: thu_maic@tsinghua.edu.cn
-->

<p align="center">
  <img src="public/logo-horizontal.png" alt="方湖 MAIC" width="420"/>
</p>

<p align="center">
  AI Classroom Platform based on OpenMAIC — One-click immersive multi-agent interactive classroom
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg?style=flat-square" alt="License: AGPL-3.0"/></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js"/></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/></a>
  <a href="https://langchain.dev/langgraph/"><img src="https://img.shields.io/badge/LangGraph-1.1-purple?style=flat-square" alt="LangGraph"/></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/></a>
  <br/>
  <a href="./README.md">English</a> · <a href="./README-zh.md">简体中文</a>
</p>

<!--
<p align="center">
  <a href="https://star-history.com/#ZYFUP/fh_maic&type=Source">
    <img src="https://api.star-history.com/svg?repos=ZYFUP/fh_maic&type=Source" alt="Star History" width="500"/>
  </a>
</p>
-->

---

## ⚠️ AGPL-3.0 Compliance Requirement — MUST READ

This project is a derivative work of [OpenMAIC (AGPL-3.0)](https://github.com/THU-MAIC/OpenMAIC), licensed under the **GNU Affero General Public License v3.0**.

> **If you fork, modify, and redistribute this software (whether open-source or not), you are legally required to fully disclose ALL technical details of your modifications. Failure to do so is a violation of AGPL-3.0.**

See [README-zh.md](./README-zh.md) for the full compliance checklist (in Chinese), or refer to the table below:

| Category | What Must Be Disclosed |
|----------|----------------------|
| Code Changes | All added/modified/deleted source files with change descriptions |
| Config Changes | All new or modified env vars, config files (with defaults & descriptions) |
| Dependency Changes | All new or upgraded packages (name, version, purpose) |
| API Changes | All new/modified/deleted API endpoints and their parameters |
| Frontend Changes | All new or modified pages, components, routes with functionality descriptions |
| Third-Party Integrations | All new third-party services, SDKs, API key configurations |
| Brand Customization | All visual customizations (Logo, colors, UI, text) and how to replicate them |

For closed-source commercial use, contact **thu_maic@tsinghua.edu.cn**.

---

## ✨ Features

| | |
|---|---|
| **One-click Classroom** | Input a topic or upload materials → AI generates a complete course |
| **Multi-Agent Collaboration** | AI teacher + AI classmates with lecturing, discussion & real-time interaction |
| **Deep Interactive Mode** | 3D visualization, simulations, games, mind maps, online coding |
| **Canvas Slides** | Custom 2D canvas rendering with animations, laser pointer, whiteboard drawing |
| **Real-time Voice** | Multi-provider TTS + ASR (MiniMax, OpenAI, Ollama, and more) |
| **Media Generation** | AI-generated images, videos, music, coding plans (MiniMax adapter included) |
| **Knowledge Q&A** | Free-form questions; AI teacher responds with slides/whiteboard |
| **Roundtable Debate** | Multi-agent debate with whiteboard illustrations |
| **Export** | PowerPoint / interactive HTML / classroom ZIP |
| **i18n** | Interface in Chinese · English · Japanese · Russian |
| **Multi AI Provider** | OpenAI · Anthropic · Google Gemini · DeepSeek · MiniMax · GLM · Ollama · and more |
| **OpenClaw** | Generate classrooms from Feishu, Slack, Discord, Telegram |

---

## 🚀 Quick Start

**Prerequisites**: Node.js >= 20 · pnpm >= 10

```bash
# 1. Clone & install
git clone https://github.com/YOUR_USERNAME/fh_maic.git
cd fh_maic
pnpm install

# 2. Configure (at least one LLM provider required)
cp .env.example .env.local
# Edit .env.local — see #Configuration below

# 3. Run
pnpm dev
# Open http://localhost:3000

# 4. Production
pnpm build && pnpm start
```

---

## 🔧 Configuration

Configure at least one LLM provider in `.env.local`:

```env
# MiniMax proxy (recommended for China users)
ANTHROPIC_API_KEY=sk-xxx
ANTHROPIC_BASE_URL=https://api.minimaxi.com/anthropic/v1/messages
ANTHROPIC_MODELS=MiniMax-M2.7-highspeed

# OpenAI-compatible proxy (e.g. MiniMax)
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.minimaxi.com/v1/chat/completions
OPENAI_MODELS=MiniMax-M2.7-highspeed

# Or direct OpenAI / Anthropic
# OPENAI_API_KEY=sk-xxx
# ANTHROPIC_API_KEY=sk-ant-xxx

# Local Ollama
# OLLAMA_BASE_URL=http://localhost:11434
```

**Supported providers**: OpenAI · Anthropic · Google Gemini · DeepSeek · Qwen · Kimi · **MiniMax** · Grok (xAI) · OpenRouter · Doubao · Tencent Hunyuan · Xiaomi MiMo · GLM (Zhipu) · Ollama · Lemonade — and any OpenAI-compatible API.

---

## 🏗️ Architecture

```
User Input
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Generation Pipeline  (lib/generation/)             │
│  Stage 1: Outline → Stage 2: Full Scenes           │
└────────────────────┬────────────────────────────────┘
                     │ StageStore + StageAPI
                     ▼
┌─────────────────────────────────────────────────────┐
│  Classroom Page  (SSE via /api/chat)                │
│  Director Graph  (LangGraph, lib/orchestration/)    │
│  Multi-agent: director → agent_generate → director  │
└────────────────────┬────────────────────────────────┘
                     │ action events
                     ▼
┌─────────────────────────────────────────────────────┐
│  ActionEngine  (lib/action/engine.ts)               │
│  28+ action types: speech, whiteboard, spotlight…   │
└────────────────────┬────────────────────────────────┘
                     │ state updates
                     ▼
┌─────────────────────────────────────────────────────┐
│  Zustand Stores  (lib/store/)                      │
│  canvas · media-generation · settings · whiteboard  │
└─────────────────────────────────────────────────────┘
```

### Key Modules

| Module | Location | Responsibility |
|--------|----------|---------------|
| **Generation Pipeline** | `lib/generation/` | Two-stage: outline → scene → media |
| **Director Graph** | `lib/orchestration/director-graph.ts` | LangGraph state machine for multi-agent |
| **Action Engine** | `lib/action/engine.ts` | Execute speech, whiteboard, spotlight, laser… |
| **Stage API** | `lib/api/stage-api.ts` | Facade for scene/canvas/whiteboard ops |
| **LLM Layer** | `lib/ai/llm.ts` | Unified callLLM/streamLLM via Vercel AI SDK |
| **Slide Renderer** | `components/slide-renderer/` | Canvas 2D custom engine |
| **Whiteboard** | `components/whiteboard/` | SVG + ProseMirror |

---

## 🛠️ Development

```bash
pnpm dev              # Dev server
pnpm build           # Production build
pnpm start           # Production server

# Code quality
pnpm lint            # ESLint
pnpm format          # Prettier format
pnpm check           # Prettier check
npx tsc --noEmit     # TypeScript

# Testing
pnpm test            # Unit tests (vitest)
pnpm test:e2e        # Playwright e2e tests
pnpm test:e2e:ui     # Playwright with UI

# i18n
pnpm check:i18n-keys # Check missing i18n keys

# Evaluation
pnpm eval:whiteboard        # Whiteboard layout eval
pnpm eval:outline-language  # Outline language eval
```

---

## 📁 Project Structure

```
fh_maic/
├── app/                    # Next.js App Router
│   ├── api/               #   Server routes (generate, chat, pbl, transcription…)
│   ├── classroom/[id]/    #   Classroom playback page
│   └── page.tsx          #   Home page
├── lib/                   # Core business logic
│   ├── generation/        #   Two-stage lesson generation pipeline
│   ├── orchestration/     #   LangGraph multi-agent orchestration
│   ├── action/            #   Action execution engine (28+ action types)
│   ├── ai/               #   LLM provider abstraction
│   ├── api/              #   Stage API facade
│   ├── store/            #   Zustand stores
│   ├── audio/            #   TTS & ASR providers
│   ├── media/            #   Image & video generation
│   ├── export/           #   PPTX & HTML export
│   └── i18n/             #   zh-CN / en-US / ja-JP / ru-RU
├── components/            # React UI
│   ├── slide-renderer/    #   Canvas 2D slide editor & renderer
│   ├── scene-renderers/  #   Quiz / Interactive / PBL renderers
│   ├── whiteboard/       #   SVG whiteboard
│   ├── chat/             #   Chat area & session
│   └── ui/               #   shadcn/ui + Radix base components
└── packages/             # Monorepo sub-packages
    ├── pptxgenjs/        #   PowerPoint generation
    └── mathml2omml/      #   MathML → Office Math conversion
```

---

## 💡 Example Inputs

| Input | Generated |
|-------|-----------|
| "Teach me Python from scratch" | Slides + quiz + online coding |
| "Explain blockchain with diagrams" | AI teacher + whiteboard diagrams |
| "Simulate light refraction" | Interactive physics simulation |
| "Debate: AI in education" | Multi-agent roundtable + data viz |
| "Write an electronic song about spring" | AI-generated music |

---

## 🤝 Contributing

For contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

**Forks**: Document all modifications per the AGPL-3.0 compliance table above. Every change (code, config, dependency, API, UI, brand) must be disclosed in your fork's documentation.

---

## 📝 Citation

If you use this project in research, please cite the original paper:

```bibtex
@Article{JCST-2509-16000,
  title = {From MOOC to MAIC: Reimagine Online Teaching and Learning through LLM-driven Agents},
  journal = {Journal of Computer Science and Technology},
  year = {2026},
  doi = {10.1007/s11390-025-6000-0},
  url = {https://jcst.ict.ac.cn/en/article/doi/10.1007/s11390-025-6000-0},
  author = {Ji-Fan Yu et al.}
}
```

---

## 📄 License

Licensed under [AGPL-3.0](./LICENSE). Closed-source commercial licensing: **thu_maic@tsinghua.edu.cn**
