---
description: WebPilot-Engine 배포 마스터 룰 — Dev/Live 구분 배포 (Vercel CLI Direct Deploy)
---

# 배포 마스터 룰 (Deployment Master Rule)

**원칙**: GitHub 용량 제한(100MB) 및 네트워크 불안정성을 우회하기 위해 **Git을 거치지 않고 Vercel CLI를 통해 로컬에서 직접 배포**한다.

---

## 🚨 최우선 규칙: Dev / Live 분리

| 환경 | 명령어 | URL | 에이전트 자동 실행 |
|------|--------|-----|-------------------|
| **Dev (Preview)** | `vercel` | `*.vercel.app` (Preview URL) | ✅ 허용 |
| **Live (Production)** | `vercel --prod` | `web-pilot-engine.vercel.app` | ❌ **절대 금지** |

> [!CAUTION]
> **에이전트는 `vercel --prod` (라이브 배포)를 절대 자동 실행하지 않는다.**
> 라이브 배포는 반드시 사용자가 "라이브 배포해", "프로덕션 배포해" 등 **명시적으로 요청**했을 때만 실행한다.
> 그 외 모든 상황에서는 **Dev(Preview) 배포만** 수행한다.

---

## 1. 사전 점검

- 프로젝트 루트 경로(`d:\test\WebPilot-Engine`)에 위치해야 한다.
- `.vercelignore` 파일이 존재하고, 다음 항목이 포함되어 있는지 확인한다:
  - `.git`
  - `public/models/` (50MB 이상 대용량 파일)

## 2. Dev 배포 (기본)

에이전트가 배포할 때는 **항상 Dev(Preview) 배포**를 기본으로 한다.

```powershell
# Dev(Preview) 배포 — 에이전트 기본 동작
vercel
```

- 배포 완료 후 생성되는 **Preview URL**을 사용자에게 전달한다.
- Preview URL 형식: `webpilot-engine-<hash>.vercel.app`

## 3. Live 배포 (사용자 명시 요청 시에만)

사용자가 아래와 같은 **명시적 키워드**를 사용한 경우에만 실행한다:

- "라이브 배포", "프로덕션 배포", "prod 배포", "--prod 배포"
- "라이브에 올려", "프로덕션에 올려"
- "실서버 배포"

```powershell
# Live(Production) 배포 — 사용자 명시 요청 시에만
vercel --prod
```

- Live URL: `web-pilot-engine.vercel.app`

## 4. 설정 확인 (최초 실행 시)

- **Log in**: GitHub 계정으로 로그인 (브라우저 인증)
- **Scope**: 개인 계정 또는 팀 선택
- **Link**: No ('N') -> 새 프로젝트 생성
- **Project Name**: `webpilot-engine`
- **Settings**: 기본값 유지 ('Y')

## 5. 환경 변수 동기화 (필수)

배포 후 Vercel 대시보드(Settings > Environment Variables)에서 `.env.local`의 다음 키가 등록되어 있는지 반드시 확인한다.

- `NEXT_PUBLIC_TRIPO_API_KEY`
- `NEXT_PUBLIC_BLOCKADE_LABS_API_KEY`
- `GEMINI_API_KEY` (서버용)

## 6. 배포 검증

- Vercel CLI 출력에서 배포 완료 여부를 확인한다.
- 생성된 URL(Preview 또는 Production)을 기록한다.
- **⚠️ 브라우저 직접 테스트 금지** — 사용자가 직접 확인

---

## 요약 의사결정 트리

```
사용자가 "배포해" 요청
  ├─ "라이브/프로덕션/prod" 키워드 포함?
  │   ├─ Yes → vercel --prod (Live 배포)
  │   └─ No  → vercel (Dev 배포)
  └─ 에이전트 자체 판단으로 배포?
      └─ 항상 vercel (Dev 배포만 허용)
```
