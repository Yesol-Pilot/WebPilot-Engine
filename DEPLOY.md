# Vercel 직접 배포 가이드 (GitHub 우회)

GitHub 용량 제한이나 네트워크 문제로 자동 배포가 안 될 때, **내 컴퓨터에서 바로 배포**하는 가장 확실한 방법입니다.

## 1. Vercel CLI 설치 (최초 1회)

터미널에 아래 명령어를 입력하여 Vercel 도구를 설치합니다.

```bash
npm install -g vercel
```

## 2. 배포 실행

프로젝트 폴더에서 아래 명령어를 실행합니다.

```bash
vercel --prod
```

## 3. 질문 답변하기 (엔터만 누르세요)

명령어를 치면 몇 가지 질문이 나옵니다. 대부분 **Enter(기본값)**를 누르면 됩니다.

1. **Log in to Vercel**: `Continue with GitHub` 선택 (브라우저 열리면 승인)
2. **Set up and deploy?**: `Y` (엔터)
3. **Which scope?**: (엔터 - 본인 계정)
4. **Link to existing project?**: `N` (엔터 - 새 프로젝트 생성)
    - *이미 만든 프로젝트가 있다면 Y 누르고 찾으셔도 됩니다.*
5. **Project Name**: `webpilot-engine` (엔터)
6. **In which directory?**: `./` (엔터)
7. **Auto-detect settings?**: `Y` (Modify settings? -> N) (엔터)

## 4. 환경 변수 설정 (중요!)

배포가 시작되기 전에 `.env.local`의 내용을 넣어줘야 API가 작동합니다.
CLI 질문이 끝나면 배포가 진행됩니다. **배포가 완료된 후** Vercel 대시보드(웹사이트)로 가서 환경 변수를 넣어주세요.

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 방금 배포한 프로젝트 클릭 (`webpilot-engine`)
3. **Settings** -> **Environment Variables** 메뉴 클릭
4. `.env.local` 파일 내용을 복사해서 넣어줍니다. (`TRIPO_API_KEY` 등)
5. **Redeploy**: 변수를 넣고 나서 **Deployments** 탭 -> 점 3개 버튼 -> **Redeploy**를 눌러야 적용됩니다.

---

### 왜 이 방법을 쓰나요?

- **GitHub 파일 크기 제한(100MB) 무시**: Git을 통하지 않고 Vercel 서버로 직접 파일을 보냅니다.
- **빠름**: 복잡한 Git 설정 없이 바로 결과물을 확인할 수 있습니다.
