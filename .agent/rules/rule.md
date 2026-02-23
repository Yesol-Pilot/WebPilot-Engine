---
trigger: always_on
---

# 🎯 프로젝트 최우선 목적 (Mission Priority #1)

> **"텍스트 한 줄로 완전한 3D 세계를 창조한다"**

모든 개발은 **AI-Native Scene Generation Pipeline** 완성을 향해야 한다:

- ❌ 하드코딩된 규칙 금지 → ✅ AI가 규칙을 동적 생성
- ❌ 키워드 매칭 금지 → ✅ Vector DB 시맨틱 검색
- ❌ 일괄 스케일 금지 → ✅ 개별 오브젝트 AI 추론
- ❌ 직접 좌표 생성 금지 → ✅ MCTS 기반 최적 배치

## 아키텍처: Director-Architect-Renderer Triad

- 🎬 **Director**: 시나리오 → 장면 명세서 (전역 최적화)
- 📐 **Architect**: MCTS 기반 충돌 없는 배치 (지역 최적화)
- 🎨 **Renderer**: WebGPU + NPR + ControlNet 스타일 변환

---

# ⚠️ 에이전트 금지 규칙 (NEVER DO)

## 브라우저 테스트 금지 (CRITICAL)

**다음 조건에서 브라우저 자동화 테스트(browser_subagent)를 절대 실행하지 않는다:**

1. **로컬 서버 실행 중일 때** - `localhost`, `127.0.0.1` 등 로컬 주소 테스트 금지
2. **사용자가 명시적으로 허용하지 않은 경우** - 기본값은 "금지"
3. **브라우저 연결 오류 발생 시** - 재시도 금지 (토큰 낭비)

**대안:**

- 사용자가 직접 테스트하고 콘솔 로그/스크린샷 제공
- 터미널 명령으로 빌드/타입체크만 수행

## 하드코딩 금지 (중요!)

**특정 키워드에 대한 하드코딩된 매핑을 추가하지 않는다:**

```typescript
// ❌ 절대 하지 말 것
if (concept.includes('hogwarts')) return '/models/Harry/hogwarts.glb';
if (concept.includes('candle')) return '/models/candle.glb';

// ✅ 대신 시맨틱 검색 사용
const result = await VectorSearchService.search(concept);
```

**이유:** 하드코딩은 확장성이 없고, 새 에셋 추가 시마다 코드 수정 필요

---

# 기술 표준 (Technical Standards)

3D 좌표계 표준화: "모든 Three.js 객체 배치는 Y-up 좌표계를 따르며, 바닥면은 y=0으로 고정한다. 객체 간의 겹침(Overlapping)을 방지하기 위해 Bounding Box 계산을 필수적으로 수행하라."

상태 관리 원칙: "모든 인터랙션 로직은 XState 머신으로 정의되어야 하며, 불확실한 if-else 분기 대신 명시적인 상태 전이(State Transition)를 사용하라."

리소스 관리: "생성된 3D 자산(GLB/Texture)은 반드시 비동기적으로 로드되어야 하며, Suspense와 Fallback 컴포넌트를 사용하여 사용자 경험을 저해하지 않도록 한다."

---

# 에이전트 자동화 규칙 (Agent Automation Rules)

## Git Push 자동 로깅

**Git Push를 실행할 때마다 자동으로 다음을 수행한다:**

1. **개발 로그 업데이트**: `.agent/data/git_changelog.json`에 Push 이력 추가
   - 커밋 해시, 메시지, 변경 파일 수, insertions/deletions 기록
   - 자동 summary 생성 (feat/fix 분류)

2. **기록할 정보**:

   ```json
   {
     "timestamp": "ISO 8601 형식",
     "commits": [{ "hash", "message", "filesChanged", "insertions", "deletions" }],
     "totalCommits": 숫자,
     "summary": "자동 생성된 요약"
   }
   ```

3. **실행 시점**: `git push` 직후 즉시 실행 (사용자에게 묻지 않음)

> ⚠️ 이 규칙은 WebPilot-Engine 프로젝트에서 항상 적용된다.

---

# 🔐 크리덴셜 보안 관리 (Credential Security — MANDATORY)

## 절대 금지 사항

1. **API 키/토큰을 코드, 주석, 로그, 아티팩트, 문서에 직접 기재하지 않는다**
2. **`.env*` 파일 내용을 그대로 출력하거나 인용하지 않는다**
3. **커밋 메시지, PR 설명, walkthrough에 키 값을 포함하지 않는다**
4. **사용자가 제공한 키를 채팅 응답에 그대로 반복하지 않는다**

## 레지스트리 참조 의무

- `.env*` 파일 수정 전 **반드시** `.agent/data/credentials_registry.md` 참조
- 새 API 키 추가 시 **즉시** 레지스트리에 메타정보(변수명, 용도, 발급처) 등록
- 키가 "없다"고 판단하기 전에 `.env`, `.env.local` **양쪽 모두** 확인
- 에이전트는 키를 "유실"했다고 판단하면 사용자에게 즉시 보고

## .env 파일 안전 규칙

- `.env`와 `.env.local` 수정 시 기존 내용을 **정확히 보존**
- NULL 바이트, 인코딩 깨짐 발견 시 즉시 수정 (UTF-8 강제)
- `.gitignore`에 `.env*` 패턴이 반드시 있는지 확인 후 작업

---

# 📍 프로젝트 주요 경로 (SSOT)

| 항목 | 값 |
|------|-----|
| 로컬 경로 | `D:\test\WebPilot-Engine` |
| Git 원격 | GitHub `yesol/webpilot-engine` (main) |
| Vercel | webpilot-engine.vercel.app |
| **개발 서버** | **`localhost:8090`** (`next dev -p 8090`) |
| 빌드 명령 | `cross-env NEXT_TURBOPACK=0 next build` |
| 배포 명령 | `vercel` (Dev), `vercel --prod` (Live — 사용자 명시 시만) |
| GLB 모델 | `public/models/` (1,680개) |
| HDRI | `public/skybox/` |
| PBR 텍스처 | `public/textures/` |
| 사운드 | `public/sounds/` |
| 크리덴셜 레지스트리 | `.agent/data/credentials_registry.md` |
| Git 변경 로그 | `.agent/data/git_changelog.json` |
| .env | `.env` (추적), `.env.local` (미추적) |
