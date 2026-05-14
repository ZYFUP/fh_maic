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
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/LangGraph-1.1-purple?style=flat-square" alt="LangGraph"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <br/>
  <a href="./README.md">English</a> · <a href="./README-zh.md">简体中文</a>
</p>

<!-- <p align="center">
  <a href="https://star-history.com/#ZYFUP/fh_maic&type=Source">
    <img src="https://api.star-history.com/svg?repos=ZYFUP/fh_maic&type=Source" alt="Star History" width="500"/>
  </a>
</p> -->

---

## ⚠️ AGPL-3.0 Compliance Requirement — MUST READ

This project is a derivative work of [OpenMAIC (AGPL-3.0)](https://github.com/THU-MAIC/OpenMAIC), licensed under the **GNU Affero General Public License v3.0**.

> **If you fork, modify, and redistribute this software (whether open-source or not), you are legally required to fully disclose ALL technical details of your modifications. Failure to do so is a violation of AGPL-3.0.**

### Required Documentation for All Modifications

| Category | What Must Be Disclosed |
|----------|----------------------|
| **Code Changes** | All added/modified/deleted source files with change descriptions |
| **Config Changes** | All new or modified env vars, config files (with defaults & descriptions) |
| **Dependency Changes** | All new or upgraded packages (name, version, purpose) |
| **API Changes** | All new/modified/deleted API endpoints and their parameters |
| **Frontend Changes** | All new or modified pages, components, routes with functionality descriptions |
| **Database Changes** | All new or modified data models, fields, storage structures |
| **Auth/ACL Changes** | All new authentication, authorization, or access control mechanisms |
| **Third-Party Integrations** | All new third-party services, SDKs, API key configurations |
| **Deployment Changes** | All new deployment methods, environment requirements, infrastructure config |
| **Brand Customization** | All visual customizations (Logo, colors, UI, text) and how to replicate them |

### Compliance Example

```markdown
## Fork Technical Documentation

### Base Version
- Original: OpenMAIC v0.2.1 (https://github.com/THU-MAIC/OpenMAIC)
- This fork: XXX-MAIC v1.0.0

### Code Change Summary
- Added: `lib/media/adapters/minimax-video-adapter.ts` (MiniMax video adapter)
- Modified: `components/stage/scene-sidebar.tsx` (scene sidebar customization)
- Removed: `components/xxx/xxx.tsx` (removed XXX feature)

### Config Changes
- Added `MINIMAX_API_KEY`: MiniMax video/music API key
- Added `VIDEO_MINIMAX_BASE_URL`: MiniMax video service URL

### Dependency Changes
- Added `minimax` SDK v1.x.x (for video generation)
- Upgraded `tailwindcss` from 3.x to 4.x

### API Changes
- Added `POST /api/media/video` (generate video, params: prompt, model, duration)
- Modified `GET /api/generate` (added `provider` parameter)

... and so on (see CHANGELOG.md for full details)
```

### Non-Compliance Consequences

- **AGPL-3.0 Violation**: Redistributing without disclosing modification details violates the license
- **Legal Risk**: AGPL-3.0 is a legally binding license; violations may result in legal action
- **Community Trust**: Closed-source forks without technical disclosure are widely condemned by the community

For closed-source commercial use, contact **thu_maic@tsinghua.edu.cn** to obtain a commercial license from the original team.

---

## 📖 Project Overview

**方湖 MAIC** is a customized fork of [OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) with local brand customization and feature extensions while retaining all core functionality.

### Core Features

| Feature | Description |
|---------|-------------|
| One-click Classroom Generation | Input a topic or upload materials; AI generates a complete course |
| Multi-Agent Collaboration | AI teacher + AI classmates: lecturing, discussion, real-time interaction |
| Deep Interactive Mode | 3D visualization, simulations, games, mind maps, online coding |
| Slide Presentation | Canvas rendering with animations, laser pointer, whiteboard drawing |
| Real-time Voice | Multi-provider TTS + ASR for voice narration and voice input |
| Knowledge Q&A | Free-form questions; AI teacher responds with slides/whiteboard |
| Roundtable Debate | Multi-agent debate with whiteboard illustrations |
| Media Generation | AI-generated images, videos, music, coding plans |
| i18n | Interface in Chinese / English / Japanese / Russian |
| Multi AI Provider | OpenAI / Anthropic / MiniMax / DeepSeek / GLM / Ollama / and more |
| Export | PowerPoint / interactive HTML / classroom ZIP |
| OpenClaw Integration | Generate classrooms from Feishu / Slack / Discord / Telegram |

---

## 🗞️ Changelog

- **2026-05-13** — Fork release: Added MiniMax video/music/coding-plan adapters, added dark brand logos, refined i18n customization

For full changelog, see [CHANGELOG.md](./CHANGELOG.md) or the original [OpenMAIC repo](https://github.com/THU-MAIC/OpenMAIC).

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10

### 1. Install

```bash
git clone https://github.com/YOUR_USERNAME/fh_maic.git
cd fh_maic
pnpm install
```

### 2. Configure

```bash
cp .env.example .env.local
```

Fill in at least one LLM provider:

```env
# MiniMax (recommended for China users)
ANTHROPIC_API_KEY=sk-xxx
ANTHROPIC_BASE_URL=https://api.minimaxi.com/anthropic/v1/messages
ANTHROPIC_MODELS=MiniMax-M2.7-highspeed

OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.minimaxi.com/v1/chat/completions
OPENAI_MODELS=MiniMax-M2.7-highspeed

# Or OpenAI
# OPENAI_API_KEY=sk-xxx

# Or Anthropic
# ANTHROPIC_API_KEY=sk-ant-xxx

# Local Ollama
# OLLAMA_BASE_URL=http://localhost:11434
```

Supported providers: **OpenAI / Anthropic / Google Gemini / DeepSeek / Qwen / Kimi / MiniMax / Grok (xAI) / OpenRouter / Doubao / Tencent Hunyuan / Xiaomi MiMo / GLM (Zhipu) / Ollama (local) / Lemonade (local LLM/image/TTS/ASR)**, and any OpenAI-compatible API.

### 3. Run

```bash
pnpm dev
```

Open **http://localhost:3000**

### 4. Production Build

```bash
pnpm build && pnpm start
```

---

## 📁 Project Structure

```
fh_maic/
├── app/                        # Next.js App Router
│   ├── api/                    #   Server API routes
│   │   ├── generate/           #     Classroom generation pipeline (outline → content → media → TTS)
│   │   ├── generate-classroom/ #     Async job submission + polling
│   │   ├── chat/              #     Multi-agent discussion (SSE streaming)
│   │   ├── pbl/               #     Project-Based Learning endpoints
│   │   └── ...                #     quiz-grade, parse-pdf, web-search, transcription etc.
│   ├── classroom/[id]/         #   Classroom playback page
│   └── page.tsx               #   Home page
│
├── lib/                       # Core business logic
│   ├── generation/            #   Two-stage lesson generation pipeline
│   ├── orchestration/         #   LangGraph multi-agent orchestration (director graph)
│   ├── playback/              #   Playback state machine (idle → playing → live)
│   ├── action/                #   Action execution engine (28+ action types)
│   ├── ai/                    #   LLM provider abstraction layer
│   ├── api/                   #   Scene API facade (slide/canvas/scene)
│   ├── store/                 #   Zustand state stores
│   ├── types/                 #   Centralized TypeScript types
│   ├── audio/                 #   TTS & ASR providers
│   ├── media/                 #   Image & video generation (incl. MiniMax adapters)
│   ├── export/                #   PPTX & HTML export
│   ├── hooks/                 #   55+ React custom hooks
│   ├── i18n/                  #   i18n (zh-CN / en-US / ru-RU)
│   └── ...                    #   prosemirror, storage, pdf, web-search, utils
│
├── components/                # React UI components
│   ├── slide-renderer/        #   Canvas slide editor & renderer
│   │   ├── Editor/Canvas/    #     Interactive editing canvas
│   │   └── components/element/ #    Element renderers (text/image/shape/table/chart…)
│   ├── scene-renderers/       #   Quiz/Interactive/PBL scene renderers
│   ├── generation/            #   Generation toolbar & progress
│   ├── chat/                  #   Chat area & session management
│   ├── settings/              #   Settings panel
│   ├── whiteboard/            #   SVG whiteboard
│   ├── agent/                 #   Agent avatar/config/info bar
│   ├── ui/                    #   Base UI (shadcn/ui + Radix)
│   └── ...                    #   audio, roundtable, stage, ai-elements
│
├── packages/                  # Monorepo packages
│   ├── pptxgenjs/             #   PowerPoint generation
│   └── mathml2omml/          #   MathML → Office Math conversion
│
├── public/                   # Static assets (logos, avatars, brand assets)
└── skills/                   # OpenClaw / ClawHub Skills
    └── openmaic/             #   Guided setup & generation SOP
```

---

## 🔑 Core Technical Architecture

| Module | Technology |
|--------|------------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript 5 |
| Multi-Agent | LangGraph 1.1 state machine |
| State Management | Zustand |
| Styling | Tailwind CSS 4 + shadcn/ui + Radix UI |
| Slide Rendering | Canvas 2D custom engine |
| Whiteboard | SVG + ProseMirror |
| PPT Export | pptxgenjs custom extension |
| Math | MathML → OOML conversion (custom package) |
| TTS | MiniMax / VoxCPM2 / OpenAI / Gemini / Ollama / Lemonade |
| ASR | MiniMax / OpenAI / Ollama / Lemonade |
| Image Generation | MiniMax / OpenAI / Gemini / Ollama / Lemonade |
| Video Generation | MiniMax |
| Music Generation | MiniMax |
| Coding Plan Generation | MiniMax |
| PDF Parsing | MinerU (optional) |
| Local LLM | Ollama / Lemonade |
| i18n | i18next |

---

## 💡 Use Cases

| Input | Output |
|-------|--------|
| "Teach me Python from scratch" | Complete course: slides + quiz + online coding |
| "Explain blockchain principles" | AI teacher + whiteboard diagrams + Q&A |
| "Simulate light refraction experiment" | Interactive physics simulation |
| "Analyze current economic situation" | Multi-agent roundtable + data visualization |
| "Generate an electronic song about spring" | AI-generated music |

---

## 🤝 Contributing

**Important for forks**: Every modification to this codebase should be documented in your project's documentation to maintain technical transparency.

For the original contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 📝 Citation

If you use this project in research, please also cite the original paper:

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

This project is licensed under [AGPL-3.0](./LICENSE).

For closed-source commercial licensing, contact: **thu_maic@tsinghua.edu.cn**
