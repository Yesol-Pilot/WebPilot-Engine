# 스카이박스 리소스 가이드

이 폴더에는 HDR/EXR 스카이박스 파일을 저장합니다.

## 사용 방법

1. HDR/EXR 파일을 이 폴더에 저장
2. `SceneContent.tsx`에서 `<Environment files="/skybox/your_skybox.hdr" />` 사용

## 지원 프리셋 (drei)

@react-three/drei의 Environment 컴포넌트는 다음 프리셋을 지원합니다:

- `apartment`, `city`, `dawn`, `forest`, `lobby`, `night`
- `park`, `studio`, `sunset`, `warehouse`

## AI 스카이박스 생성

Blockade Labs API를 사용하려면 `.env.local`에 다음 설정 필요:

```
BLOCKADE_LABS_API_KEY=your_api_key
```
