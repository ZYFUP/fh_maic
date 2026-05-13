<!--
  方湖 MAIC — 基于 OpenMAIC 的 AI 课堂教学平台

  ⚠️ AGPL-3.0 合规声明：
  本项目采用 GNU Affero General Public License v3.0（以下简称 AGPL-3.0）开源许可证。
  根据 AGPL-3.0 协议条款，如果您对本软件进行修改并再分发，
  您必须：
    1. 明确标注所有修改内容（包括新增、删除、修改的代码、配置、依赖等）
    2. 提供完整的修改后源代码
    3. 在所有修改版本的显著位置保留本声明及原始版权信息
    4. 保持相同的开源协议（AGPL-3.0）

  任何不对外公开修改细节的"闭源二开"行为，均违反 AGPL-3.0 协议。
  如需商业闭源使用，请联系：thu_maic@tsinghua.edu.cn
-->

<p align="center">
  <img src="public/logo-horizontal.png" alt="方湖 MAIC" width="420"/>
</p>

<p align="center">
  基于 OpenMAIC 定制的 AI 课堂教学平台 — 一键生成沉浸式多智能体互动课堂
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

---

## ⚠️ AGPL-3.0 合规要求 — 必读

本项目基于 [OpenMAIC (AGPL-3.0)](https://github.com/THU-MAIC/OpenMAIC) 开发，采用 **GNU Affero General Public License v3.0** 开源协议。

> **重要提示：二开后如果您选择对外发布（无论是否开源），您必须完整披露以下所有技术细节，否则构成对 AGPL-3.0 协议的违反：**

### 必须记录的内容清单

| 类别 | 必须披露的内容 |
|------|---------------|
| **代码修改** | 所有新增、修改、删除的源代码文件及变更说明 |
| **配置变更** | 所有新增或修改的环境变量、配置文件（含默认值和说明） |
| **依赖变更** | 所有新增或升级的第三方依赖（包名、版本、用途） |
| **API 变更** | 所有新增、修改、删除的 API 接口及其参数说明 |
| **前端变更** | 所有新增或修改的页面、组件、路由及其功能描述 |
| **数据库变更** | 所有新增或修改的数据模型、字段、存储结构 |
| **认证/权限变更** | 所有新增的身份验证、授权、访问控制机制 |
| **第三方集成** | 所有新增的第三方服务、SDK、API 密钥配置方式 |
| **部署变更** | 所有新增的部署方式、环境要求、基础设施配置 |
| **品牌定制** | 所有视觉定制（Logo、颜色、UI、文字）及其替换方式 |

### 合规示例

```markdown
## 二开技术文档

### 基于版本
- 原始项目：OpenMAIC v0.2.1（https://github.com/THU-MAIC/OpenMAIC）
- 二开版本：XXX-MAIC v1.0.0

### 代码修改摘要
- 新增文件：`lib/media/adapters/minimax-video-adapter.ts`（MiniMax 视频适配器）
- 修改文件：`components/stage/scene-sidebar.tsx`（场景侧边栏定制）
- 删除文件：`components/xxx/xxx.tsx`（移除 XXX 功能）

### 配置变更
- 新增 `MINIMAX_API_KEY`：MiniMax 视频/音乐 API 密钥
- 新增 `VIDEO_MINIMAX_BASE_URL`：MiniMax 视频服务地址

### 依赖变更
- 新增 `minimax` SDK v1.x.x（用于视频生成）
- 升级 `tailwindcss` 从 3.x 到 4.x

### API 变更
- 新增 `POST /api/media/video`（生成视频，参数：prompt, model, duration）
- 修改 `GET /api/generate`（新增 `provider` 参数）

... 以此类推（详见 CHANGELOG.md）
```

### 不合规的后果

- **违反 AGPL-3.0**：未披露修改细节的再分发行为违反开源协议
- **法律风险**：AGPL-3.0 是具有法律约束力的许可证，违规可能面临法律诉讼
- **社区信任损失**：闭源二开且不披露技术细节会被社区唾弃

如需闭源商业使用，请通过 **thu_maic@tsinghua.edu.cn** 联系原始团队获取商业授权。

---

## 📖 项目概述

**方湖 MAIC** 是 [OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) 的定制分支，保留了其全部核心功能并进行本地化品牌定制与功能扩展。

### 核心功能

| 功能 | 说明 |
|------|------|
| 一键课堂生成 | 输入主题或上传资料，AI 自动生成完整课程 |
| 多智能体协作 | AI 教师 + AI 同学，实时授课、讨论、互动 |
| 深度交互模式 | 3D 可视化、模拟实验、游戏、思维导图、在线编程 |
| 幻灯片演示 | Canvas 渲染，支持动画、激光笔、白板作图 |
| 实时语音讲解 | 多 TTS provider，语音合成 + 语音识别 |
| 知识问答 | 自由提问，AI 教师实时生成幻灯片/白板讲解 |
| 课堂辩论 | 多智能体圆桌辩论，配白板图解 |
| 媒体生成 | 图片、视频、音乐、编程方案 AI 生成 |
| 多语言支持 | 界面支持中/英/日/俄 |
| 多 AI Provider | OpenAI / Anthropic / MiniMax / DeepSeek / GLM / Ollama 等 |
| 导出能力 | PowerPoint / 互动 HTML / 课堂 ZIP |
| OpenClaw 集成 | 飞书/Slack/Discord/Telegram 等聊天应用直接发起课堂 |

---

## 🗞️ 更新日志

- **2026-05-13** — 定制版本发布，新增 MiniMax 视频/音乐/编程方案适配器，添加品牌 Logo 暗色版本，完善多语言界面定制

原始更新日志请参阅 [CHANGELOG.md](./CHANGELOG.md)，或查阅原始项目 [OpenMAIC](https://github.com/THU-MAIC/OpenMAIC)。

---

## 🚀 快速开始

### 前置依赖

- **Node.js** >= 20
- **pnpm** >= 10

### 1. 安装

```bash
git clone https://github.com/YOUR_USERNAME/fh_maic.git
cd fh_maic
pnpm install
```

### 2. 配置

```bash
cp .env.example .env.local
```

至少填写一个 LLM Provider：

```env
# MiniMax（推荐国内用户）
ANTHROPIC_API_KEY=sk-xxx
ANTHROPIC_BASE_URL=https://api.minimaxi.com/anthropic/v1/messages
ANTHROPIC_MODELS=MiniMax-M2.7-highspeed

OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.minimaxi.com/v1/chat/completions
OPENAI_MODELS=MiniMax-M2.7-highspeed

# 或 OpenAI
# OPENAI_API_KEY=sk-xxx

# 或 Anthropic
# ANTHROPIC_API_KEY=sk-ant-xxx

# 本地 Ollama
# OLLAMA_BASE_URL=http://localhost:11434
```

支持的 Provider：**OpenAI / Anthropic / Google Gemini / DeepSeek / Qwen / Kimi / MiniMax / Grok (xAI) / OpenRouter / Doubao / Tencent Hunyuan / 小米 MiMo / GLM (Zhipu) / Ollama（本地）/ Lemonade（本地 LLM/图像/TTS/ASR）**，以及任何 OpenAI 兼容 API。

### 3. 运行

```bash
pnpm dev
```

访问 **http://localhost:3000**

### 4. 生产构建

```bash
pnpm build && pnpm start
```

---

## 📁 项目结构

```
fh_maic/
├── app/                        # Next.js App Router
│   ├── api/                    #   服务端 API 路由
│   │   ├── generate/           #     课堂生成管线（大纲 → 内容 → 媒体 → TTS）
│   │   ├── generate-classroom/ #     异步课堂任务提交 + 轮询
│   │   ├── chat/              #     多智能体讨论（SSE 流式）
│   │   ├── pbl/               #     项目制学习（PBL）接口
│   │   └── ...                #     quiz-grade, parse-pdf, web-search, transcription 等
│   ├── classroom/[id]/         #   课堂回放页面
│   └── page.tsx               #   首页（生成输入）
│
├── lib/                       # 核心业务逻辑
│   ├── generation/            #   两阶段课程生成管线
│   ├── orchestration/         #   LangGraph 多智能体编排（导演图）
│   ├── playback/              #   回放状态机（idle → playing → live）
│   ├── action/                #   执行引擎（28+ 种动作：语音、白板、聚光灯、激光笔等）
│   ├── ai/                    #   LLM Provider 抽象层
│   ├── api/                   #   场景 API 门面（slide/canvas/scene 操作）
│   ├── store/                 #   Zustand 状态管理
│   ├── types/                 #   集中式 TypeScript 类型定义
│   ├── audio/                 #   TTS & ASR provider
│   ├── media/                 #   图片 & 视频生成 provider（含 MiniMax 适配器）
│   ├── export/                #   PPTX & HTML 导出
│   ├── hooks/                 #   React 自定义 Hooks（55+ 个）
│   ├── i18n/                  #   国际化（zh-CN / en-US / ru-RU）
│   └── ...                    #   prosemirror, storage, pdf, web-search, utils
│
├── components/                # React UI 组件
│   ├── slide-renderer/        #   Canvas 幻灯片编辑器 & 渲染器
│   │   ├── Editor/Canvas/    #     交互式编辑画布
│   │   └── components/element/ #    元素渲染器（文本/图片/形状/表格/图表…）
│   ├── scene-renderers/       #   测验/互动/PBL 场景渲染器
│   ├── generation/            #   课堂生成工具栏 & 进度
│   ├── chat/                  #   聊天区域 & 会话管理
│   ├── settings/              #   设置面板（Provider/TTS/ASR/媒体…）
│   ├── whiteboard/            #   SVG 白板绘图
│   ├── agent/                 #   智能体头像/配置/信息栏
│   ├── ui/                    #   基础 UI 组件（shadcn/ui + Radix）
│   └── ...                    #   audio, roundtable, stage, ai-elements
│
├── packages/                  # Monorepo 子包
│   ├── pptxgenjs/             #   PowerPoint 生成定制
│   └── mathml2omml/          #   MathML → Office Math 转换
│
├── public/                   # 静态资源（Logo、头像、品牌素材）
└── skills/                   # OpenClaw / ClawHub Skills
    └── openmaic/             #   引导式安装 & 生成 SOP
```

---

## 🔑 核心技术架构

| 模块 | 技术方案 |
|------|---------|
| 框架 | Next.js 16 (App Router) + React 19 + TypeScript 5 |
| 多智能体编排 | LangGraph 1.1 状态机 |
| 状态管理 | Zustand |
| 样式 | Tailwind CSS 4 + shadcn/ui + Radix UI |
| 幻灯片渲染 | Canvas 2D 自研引擎 |
| 白板 | SVG + ProseMirror |
| PPT 导出 | pptxgenjs 自定义扩展 |
| 数学公式 | MathML → OOML 转换（自研包） |
| TTS | MiniMax / VoxCPM2 / OpenAI / Gemini / Ollama / Lemonade |
| ASR | MiniMax / OpenAI / Ollama / Lemonade |
| 图像生成 | MiniMax / OpenAI / Gemini / Ollama / Lemonade |
| 视频生成 | MiniMax |
| 音乐生成 | MiniMax |
| 编程方案生成 | MiniMax |
| PDF 解析 | MinerU（可选） |
| 本地 LLM | Ollama / Lemonade |
| i18n | i18next |

---

## 💡 使用场景

| 输入 | 生成内容 |
|------|---------|
| "教我 Python 从零基础到实战" | 完整课程：幻灯片 + 测验 + 在线编程 |
| "解释一下区块链原理" | AI 教师讲解 + 白板图解 + 问答互动 |
| "用模拟实验帮我理解光的折射" | 交互式物理模拟实验 |
| "分析一下当前的经济形势" | 多智能体圆桌辩论 + 数据可视化 |
| "给我一首关于春天的电子音乐" | AI 生成音乐 |

---

## 🤝 参与贡献

原始贡献指南请参阅 [CONTRIBUTING.md](./CONTRIBUTING.md)。

**二开项目请注意**：您的每一次修改都应记录在项目文档中，保持技术透明。

---

## 📝 引用

如果您在研究中使用了本项目，请同时引用原始论文：

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

## 📄 许可证

本项目基于 [AGPL-3.0](./LICENSE) 开源。

如需商业闭源授权，请联系：**thu_maic@tsinghua.edu.cn**
