---
description: WebPilot-Engine 배포 마스터 룰 (Vercel CLI Direct Deploy)
---

# 배포 마스터 룰 (Deployment Master Rule)

**원칙**: GitHub 용량 제한(100MB) 및 네트워크 불안정성을 우회하기 위해 **Git을 거치지 않고 Vercel CLI를 통해 로컬에서 직접 배포**한다.

## 1. 사전 점검

- 프로젝트 루트 경로(`d:\test\WebPilot-Engine`)에 위치해야 한다.
- `.vercelignore` 파일이 존재하고, 다음 항목이 포함되어 있는지 확인한다:
  - `.git`
  - `public/models/` (50MB 이상 대용량 파일)

## 2. 배포 명령어 실행

터미널(PowerShell)에서 다음 명령어를 실행한다.

```powershell
vercel --prod
```

## 3. 설정 확인 (최초 실행 시)

- **Log in**: GitHub 계정으로 로그인 (브라우저 인증)
- **Scope**: 개인 계정 또는 팀 선택
- **Link**: No ('N') -> 새 프로젝트 생성
- **Project Name**: `webpilot-engine`
- **Settings**: 기본값 유지 ('Y')

## 4. 환경 변수 동기화 (필수)

배포 후 Vercel 대시보드(Settings > Environment Variables)에서 `.env.local`의 다음 키가 등록되어 있는지 반드시 확인한다.

- `NEXT_PUBLIC_TRIPO_API_KEY`
- `NEXT_PUBLIC_BLOCKADE_LABS_API_KEY`
- `GEMINI_API_KEY` (서버용)

## 5. 배포 검증

- 생성된 URL에 접속하여 페이지 로딩 및 API 기능(챗봇, 3D 생성) 작동 여부를 확인한다.
