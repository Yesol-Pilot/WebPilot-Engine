# 🔐 WebPilot-Engine 크리덴셜 레지스트리 (SSOT)

> **이 파일은 프로젝트의 모든 API 키/토큰 메타정보를 기록하는 단일 진실 소스(SSOT)입니다.**
> **에이전트는 `.env*` 파일 수정 전에 반드시 이 레지스트리를 참조해야 합니다.**

---

## .env (Git 추적됨 ⚠️)

| 환경변수명 | 용도 | 발급처 |
|------------|------|--------|
| `DATABASE_URL` | SQLite 로컬 DB | 내부 설정 |
| `NEXT_PUBLIC_BLOCKADE_LABS_API_KEY` | Blockade Labs 스카이박스 AI | [Blockade Labs](https://skybox.blockadelabs.com/) |
| `NEXT_PUBLIC_TRIPO_API_KEY` | Tripo3D 3D 모델 생성 | [Tripo3D](https://www.tripo3d.ai/) |
| `GEMINI_API_KEY` | Google Gemini AI (서버) | [Google AI Studio](https://aistudio.google.com/apikey) |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini AI (클라이언트) | 위와 동일 |
| `SUNO_API_KEY` | Suno AI BGM 생성 | [Suno AI](https://suno.ai/) |
| `ELEVENLABS_API_KEY` | ElevenLabs SFX 생성 | [ElevenLabs](https://elevenlabs.io/) |
| `NEXT_PUBLIC_SLYTHERIN_*` | 테마 설정 (5개) | 내부 설정 |
| `HYPER3D_API_KEY` | Hyper3D Rodin 3D 생성 | [Hyper3D](https://hyper3d.ai/) |
| `R2_BUCKET_URL` | Cloudflare R2 스토리지 | [Cloudflare](https://dash.cloudflare.com/) |
| `R2_ACCOUNT_ID` | R2 계정 ID | 위와 동일 |
| `R2_BUCKET_NAME` | R2 버킷 이름 | 위와 동일 |
| `R2_ACCESS_KEY_ID` | R2 API 키 | 위와 동일 |
| `R2_SECRET_ACCESS_KEY` | R2 시크릿 | 위와 동일 |
| `SKETCHFAB_API_KEY` | Sketchfab 3D 검색 | [Sketchfab](https://sketchfab.com/) |

## .env.local (Git 추적 안 됨 🔒)

| 환경변수명 | 용도 | 발급처 |
|------------|------|--------|
| `SLACK_WEBHOOK_URL` | Slack 알림 웹훅 | Slack App 설정 |
| `OPENAI_API_KEY` | OpenAI (Vector Search Embedding) | [OpenAI](https://platform.openai.com/api-keys) |
| `NEXT_PUBLIC_OPENAI_API_KEY` | OpenAI (클라이언트) | 위와 동일 |
| `REPLICATE_API_TOKEN` | Replicate TripoSR | [Replicate](https://replicate.com/account/api-tokens) |
| `POLY_PIZZA_API_KEY` | Poly Pizza 3D 검색 | [Poly Pizza](https://polypizza.xyz/) |
| `FREESOUND_CLIENT_ID` | Freesound 클라이언트 ID | [Freesound API](https://freesound.org/apiv2/apply/) |
| `FREESOUND_API_KEY` | Freesound CC0 효과음 수집 | 위와 동일 |
| `NEO4J_URI` | Neo4j Aura 접속 주소 | [Neo4j Aura](https://console.neo4j.io/) |
| `NEO4J_USER` | Neo4j 계정 사용자 (`753384a9`) | 위와 동일 |
| `NEO4J_PASSWORD` | Neo4j 계정 비밀번호 | 위와 동일 |

---

## 주요 프로젝트 경로

| 항목 | 경로/URL |
|------|----------|
| 로컬 프로젝트 | `D:\test\WebPilot-Engine` |
| Git 원격 | GitHub `yesol/webpilot-engine` (main) |
| Vercel 배포 | webpilot-engine.vercel.app |
| **개발 서버** | **`localhost:8090`** (`next dev -p 8090`) |
| 빌드 명령 | `cross-env NEXT_TURBOPACK=0 next build` |
| Dev 배포 | `vercel` (기본 — 에이전트 자동 허용) |
| Live 배포 | `vercel --prod` (**사용자 명시 요청 시에만**) |
| GLB 모델 | `public/models/` (1,680개) |
| HDRI | `public/skybox/` (30개) |
| PBR 텍스처 | `public/textures/` (70개) |
| 파티클 | `public/textures/particles/kenney/` (193개) |
| 효과음 | `public/sounds/` |
| 메타데이터 | `public/models/_metadata_physical.json`, `_metadata_semantic.json` |
| .env 파일 | `.env` (Git 추적), `.env.local` (Git 미추적) |

---
*마지막 업데이트: 2026-02-13*
