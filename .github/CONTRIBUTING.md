# 기여 가이드 (Contributing Guide)

WebPilot Engine에 기여해 주셔서 감사합니다! 🎉

## 🚀 빠른 시작

```bash
# 1. 레포지토리 포크 후 클론
git clone https://github.com/YOUR_USERNAME/WebPilot-Engine.git
cd WebPilot-Engine

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.local
# GEMINI_API_KEY 설정

# 4. 개발 서버 실행
npm run dev
```

## 📋 기여 프로세스

1. **Issue 확인** — 기존 이슈를 먼저 확인하거나, 새 이슈를 생성합니다.
2. **브랜치 생성** — `feature/기능명` 또는 `fix/버그명` 형식으로 생성합니다.
3. **코드 작성** — 아래 코드 스타일을 따릅니다.
4. **테스트** — `npm run test`로 테스트를 실행합니다.
5. **PR 생성** — 템플릿에 맞게 PR을 작성합니다.

## 🏗️ 코드 스타일

### TypeScript

- Strict 모드 사용
- 함수/클래스에 JSDoc 주석 필수
- `any` 타입 사용 금지 (불가피한 경우 `// eslint-disable-next-line` 명시)

### 파일 구조

```
src/cells/         → 셀 아키텍처 (신규 셀은 해당 계층 디렉토리에)
src/services/      → 비즈니스 로직 서비스
src/components/    → React/R3F 컴포넌트
src/store/         → Zustand 상태 관리
```

### 커밋 메시지

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다:

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 업데이트
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드/설정 변경
```

## 🧪 테스트

```bash
# 전체 테스트 실행
npm run test

# Watch 모드
npm run test:watch
```

## 📐 아키텍처 원칙

WebPilot Engine은 **Bio-Inspired Cell Architecture**를 따릅니다:

- 각 셀(Cell)은 **단일 책임**을 가집니다.
- 셀 간 통신은 **Blackboard 패턴**을 사용합니다.
- 상태 관리는 **Zustand UnifiedStore** (SSOT)를 통합합니다.
- 새로운 AI 기능은 **시맨틱 검색**(벡터 DB)을 활용해야 합니다.

## ⚠️ 주의사항

- `scripts/`, `tools/` 디렉토리의 파일은 로컬 개발용이며 빌드에 포함되지 않습니다.
- GLB 파일은 Git LFS로 관리됩니다 — `git lfs install`이 필요합니다.
- `.env.local`에 `GEMINI_API_KEY`가 없으면 AI 기능이 작동하지 않습니다.

## 📜 라이선스

기여하신 코드는 프로젝트의 [MIT License](./LICENSE)에 따라 배포됩니다.
