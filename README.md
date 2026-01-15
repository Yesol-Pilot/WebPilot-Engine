# WebPilot Engine (AI Native World Generator)

**WebPilot Engine**은 생성형 AI(Generative AI)와 React Three Fiber(R3F)를 결합하여, 텍스트 프롬프트만으로 자율적인 3D 세계를 생성하고 NPC와 상호작용할 수 있는 차세대 웹 엔진입니다.

**WebPilot Engine** is a next-generation web engine that combines Generative AI and React Three Fiber (R3F) to generate autonomous 3D worlds and interact with NPCs using only text prompts.

## 🚀 Key Features

### 1. AI-Driven World Generation

* **Prompt-to-World**: 사용자의 입력(예: "사이버펑크 뒷골목")을 분석하여 3D 에셋, 조명, 포스트 프로세싱을 실시간으로 배치합니다.
    *(Analyzes user input (e.g., "Cyberpunk Alley") to place 3D assets, lighting, and post-processing in real-time.)*
* **Dynamic Atmosphere**: AI가 시맨틱 분석을 통해 장면의 분위기(Fog, Glare, Color Grading)를 자동 조정합니다.
    *(AI automatically adjusts the scene's atmosphere (Fog, Glare, Color Grading) through semantic analysis.)*

### 2. Intelligent NPC Brain

* **LLM Integration**: 정해진 스크립트가 아닌, LLM(거대언어모델) 기반의 NPC가 상황을 인지하고 대화합니다.
    *(LLM-based NPCs understand the context and converse, rather than following fixed scripts.)*
* **Behavior Tree Integration**: AI 판단에 따라 NPC가 자율적으로 행동(이동, 상호작용 등)합니다.
    *(NPCs act autonomously (move, interact, etc.) based on AI judgment.)*

## 🛠 Tech Stack

* **Framework**: Next.js 14 (App Router)
* **3D Engine**: Three.js / React Three Fiber
* **AI Model**: Google Gemini Pro / Flash
* **State Management**: Zustand
* **Styling**: TailwindCSS

## 📦 Getting Started

```bash
# 1. 패키지 설치 (Install Packages)
npm install

# 2. 환경 변수 설정 (Setup .env)
# NEXT_PUBLIC_GEMINI_API_KEY=your_api_key

# 3. 개발 서버 실행 (Run Dev Server)
npm run dev
```

---

## 🤖 Credits

**본 엔진의 모든 아키텍처, 코어 로직, 및 AI 파이프라인은 Google Antigravity Development Agent에 의해 작성되었습니다.**
*(All architecture, core logic, and AI pipelines of this engine were executed by Google Antigravity Development Agent.)*

---
© 2026 Yesol Heo. All Rights Reserved.
