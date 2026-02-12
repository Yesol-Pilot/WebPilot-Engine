# DB Asset URL 전수조사 결과

## 📊 검사 요약

| 항목 | 개수 | 비율 |
|------|------|------|
| **총 에셋** | 1,392 | 100% |
| ✅ 유효 (200 OK) | 100 | 7.2% |
| ⚠️ 401 Unauthorized | 1,292 | 92.8% |
| ❌ 404 Not Found | 0 | 0% |

---

## 🔍 문제 분석

### 1단계: 템플릿 변수 문제 (해결됨)

- **문제**: DB에 `${POLY_PIZZA_CDN}/xxx` 형태로 저장되어 있었음
- **해결**: `https://api.poly.pizza/v1/download/xxx`로 일괄 변환 완료

### 2단계: API 인증 문제 (미해결)

- **현상**: 변환된 URL이 **401 Unauthorized** 반환
- **원인**: Poly.Pizza Download API는 **API Key 인증 필수**
- **현재 상태**: `.env.local`에 Poly.Pizza API Key 없음

---

## ✅ 유효한 100개 에셋

이미 검증되어 정상 작동하는 에셋들:

- `remote_` prefix가 붙은 에셋들로, 이전에 직접 검증된 URL

---

## 🛠️ 해결 방안

### Option A: Poly.Pizza API Key 발급 (권장)

1. <https://poly.pizza> 에서 계정 생성
2. API Key 발급
3. `.env.local`에 추가: `POLY_PIZZA_API_KEY=xxx`
4. DB에 저장된 URL을 API Key 포함 형식으로 업데이트
   - 형식: `https://api.poly.pizza/v1/download/xxx?key=API_KEY`

### Option B: 무효 에셋 정리

1. 401 반환하는 1,292개 에셋 삭제
2. 유효한 100개 에셋만으로 운영
3. 시스템은 로컬 에셋 폴백 사용

### Option C: 대체 CDN 사용

1. Sketchfab, Turbosquid 등 다른 소스로 에셋 재수집
2. 무료/오픈소스 에셋으로 교체

---

## 📁 관련 파일

- `audit_result.json`: 상세 검사 결과
- `tools/full_url_audit.js`: 전수조사 스크립트
- `tools/fix_template_urls.js`: URL 변환 스크립트

---

*검사 일시: 2026-01-26 10:45 KST*
