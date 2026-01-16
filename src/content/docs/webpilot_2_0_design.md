# **웹 파일럿 2.0: 안티그라비티(Antigravity) 기반 자율형 공간 서사 엔진 상세 기술 사양서 및 개발 설계 보고서**

## **1\. 서론: 생성형 엔지니어링과 공간 컴퓨팅의 융합**

### **1.1 배경 및 기술적 패러다임의 전환**

현대 소프트웨어 공학은 인간이 직접 코드를 작성하는 '명시적 프로그래밍(Explicit Programming)'의 시대를 지나, 인공지능 에이전트가 의도를 해석하고 구현을 담당하는 **'에이전트 기반 개발(Agentic Development)'** 단계로 진입하고 있습니다. 특히 웹 환경에서의 3D 경험(Spatial Web)은 기존의 2D 인터페이스와는 차원이 다른 복잡성을 요구합니다. 3차원 좌표계, 물리 엔진, 실시간 렌더링, 그리고 비선형적인 서사 구조가 결합되어야 하기 때문입니다.

본 보고서에서 상세히 설계하는 \*\*웹 파일럿 2.0(Web Pilot 2.0)\*\*은 이러한 복잡성을 해결하기 위해 구글의 차세대 개발 플랫폼인 \*\*안티그라비티(Antigravity)\*\*와 **제미나이 3 프로(Gemini 3 Pro)** 모델을 활용합니다. 이 시스템은 단순히 개발자의 코딩을 돕는 보조 도구(Copilot)가 아니라, 프로젝트의 아키텍처 설계부터 구현, 테스트, 배포까지 전 과정을 자율적으로 수행하는 '오토파일럿(Autopilot)' 시스템을 지향합니다.1

### **1.2 프로젝트 정의 및 핵심 목표**

웹 파일럿 2.0은 \*\*"자율형 공간 서사 엔진(Autonomous Spatial Narrative Engine)"\*\*으로 정의됩니다. 사용자가 제공하는 정적인 2D 이미지나 텍스트 프롬프트를 입력받아, 그 이면에 숨겨진 맥락(Context)과 서사(Narrative)를 시각적, 논리적으로 추론하고, 이를 실시간으로 상호작용 가능한 3D 웹 환경으로 변환하는 것이 핵심 목표입니다.

이 시스템의 기술적 특이점은 다음과 같습니다:

1. **심층 인지(Deep Cognition):** 이미지의 픽셀 정보를 넘어선 '기호학적 분석(Semiotic Analysis)'을 통해 객체의 행동 유도성(Affordance)과 잠재적 스토리를 추출합니다.3  
2. **자율 조율(Autonomous Orchestration):** 안티그라비티의 미션 컨트롤(Mission Control) 아키텍처를 통해 다수의 전문화된 AI 에이전트들이 협업하여 코드를 생산하고 검증합니다.4  
3. **결정론적 상호작용(Deterministic Interaction):** 생성형 AI의 확률적 특성을 제어하기 위해 XState 기반의 상태 머신을 자동 생성하여 게임 로직의 무결성을 보장합니다.5

## ---

**2\. 개발 환경 아키텍처: 구글 안티그라비티(Antigravity) 생태계**

웹 파일럿 2.0의 개발 환경은 단순한 IDE가 아닌, AI 에이전트 군단을 지휘하는 \*\*통제 센터(Control Plane)\*\*로서 작동합니다. 안티그라비티는 기존 VS Code 기반의 에디터 뷰와 에이전트 관리를 위한 매니저 뷰(Manager View)를 결합하여, 인간 개발자가 '코더'가 아닌 '아키텍트'로서 기능하도록 지원합니다.6

### **2.1 미션 컨트롤(Mission Control) 기반 워크플로우**

안티그라비티의 핵심은 단일 에이전트가 아닌, 역할이 분담된 \*\*멀티 에이전트 시스템(Multi-Agent System, MAS)\*\*의 운용입니다. 웹 파일럿 2.0 개발을 위해 우리는 다음과 같은 4가지의 특화된 에이전트 페르소나(Persona)를 정의하고 운용합니다.

#### **표 1\. 웹 파일럿 2.0 전담 에이전트 구성 및 역할 정의**

| 에이전트 ID | 역할 (Role) | 주요 임무 및 책임 (Responsibilities) | 활용 모델 및 설정 | 생성 아티팩트 (Artifacts) |
| :---- | :---- | :---- | :---- | :---- |
| **Architect-01** | 시스템 설계자 | 프로젝트 전체 구조 설계, Next.js 라우팅, Zod 기반 API 스키마 정의, 에이전트 간 통신 규약 설정 | **Gemini 3 Pro** (High Thinking) | 구현 계획서(Implementation Plan), 태스크 리스트, 아키텍처 다이어그램 |
| **Visual-Core** | 3D 그래픽스 엔지니어 | Three.js/R3F 컴포넌트 구현, 쉐이더(GLSL) 작성, GLB 로더 최적화, 조명 및 포스트 프로세싱 설정 | **Gemini 3 Pro** / Claude 3.5 Sonnet | R3F 컴포넌트 코드, 쉐이더 파일, UI 스크린샷, 비주얼 회귀 테스트 결과 |
| **Logic-Weaver** | 게임 로직 설계자 | 시나리오 기반 XState 상태 머신 설계, 인터랙션 로직 구현, 아이템 및 인벤토리 시스템 코딩 | **Gemini 3 Pro** (Deep Think) | 상태 머신 차트(Mermaid.js), 유닛 테스트 코드, 게임 로직 모듈 |
| **QA-Pilot** | 자율 테스트 및 검증 | 브라우저 내 자율 주행 테스트, 충돌 처리(Collision) 검증, WebGL 성능(FPS) 모니터링, 오류 디버깅 | **Gemini 3 Flash** (Low Latency) | 브라우저 녹화 영상(Browser Recordings), 성능 로그, 버그 리포트 |

이러한 분업화는 안티그라비티의 **비동기 에이전트 실행(Asynchronous Agent Execution)** 기능을 통해 극대화됩니다. 예를 들어, Architect-01이 전체적인 데이터 흐름을 설계하는 동안, Visual-Core는 백그라운드에서 3D 에셋 로딩 최적화 코드를 작성하고, Logic-Weaver는 동시에 상태 머신을 생성할 수 있습니다. 이는 개발 속도를 기하급수적으로 단축시킵니다.1

### **2.2 신뢰성 확보를 위한 아티팩트(Artifacts) 중심 개발**

생성형 AI를 이용한 개발의 최대 리스크인 '환각(Hallucination)'과 '코드漂류(Code Drift)'를 방지하기 위해, 웹 파일럿 2.0은 안티그라비티의 **아티팩트 시스템**을 철저히 활용합니다.

1. **구현 계획(Implementation Plan):** 에이전트는 코드를 작성하기 전, 반드시 자연어로 된 상세 계획을 마크다운 문서로 생성해야 합니다. 인간 아키텍트는 이를 검토하고, "시나리오의 분기점을 더 늘려라" 또는 "모바일 최적화를 위해 텍스처 해상도를 낮춰라"와 같은 피드백을 댓글(Comment) 형태로 남깁니다. 에이전트는 이 피드백이 반영되지 않으면 다음 단계로 진행할 수 없습니다.7  
2. **브라우저 레코딩(Browser Recordings):** 3D 웹 환경은 정적 코드 분석만으로는 검증이 불가능합니다. QA-Pilot 에이전트는 실제 헤드리스 브라우저(Headless Browser)를 띄워 생성된 3D 공간을 직접 탐색합니다. 벽을 뚫고 지나가지는 않는지, 클릭 이벤트가 정상적으로 트리거되는지 확인하고, 그 과정을 영상으로 기록하여 제출합니다. 이는 "코드가 컴파일된다"는 수준을 넘어 "의도대로 동작한다"는 것을 보증합니다.4

### **2.3 워크스페이스 규칙(.antigravity/rules.md) 설정**

성공적인 에이전트 협업을 위해 프로젝트 루트에 .antigravity/rules.md 파일을 생성하여 명시적인 기술적 제약 사항을 설정합니다. 이는 에이전트들이 일관된 코딩 스타일과 아키텍처 원칙을 준수하도록 강제합니다.

* **3D 좌표계 표준화:** "모든 Three.js 객체 배치는 Y-up 좌표계를 따르며, 바닥면은 $y=0$으로 고정한다. 객체 간의 겹침(Overlapping)을 방지하기 위해 Box3를 이용한 Bounding Box 계산을 필수적으로 수행하라." 1  
* **상태 관리 원칙:** "모든 인터랙션 로직은 useState나 useReducer가 아닌, **XState** 머신으로 정의되어야 한다. 불확실한 if-else 분기 대신 명시적인 상태 전이(State Transition)를 사용하라." 5  
* **리소스 관리:** "생성된 3D 자산(GLB/Texture)은 반드시 비동기적으로 로드되어야 하며, React Suspense와 Fallback 컴포넌트를 사용하여 로딩 중 사용자 경험(UX)을 저해하지 않도록 한다." 8  
* **검증 의무화:** "모든 기능 구현(Feature Implementation) 후에는 QA-Pilot을 호출하여 브라우저 레코딩을 통한 시각적 검증을 통과해야 PR(Pull Request)이 가능하다." 6

## ---

**3\. 인지 엔진(Cognitive Engine): 멀티모달 시나리오 생성 파이프라인**

사용자가 업로드한 이미지를 단순한 배경 텍스처가 아닌, 살아있는 이야기의 무대로 변환하기 위해서는 고도화된 인지 엔진이 필요합니다. 이 엔진은 \*\*제미나이 3 프로(Gemini 3 Pro)\*\*의 **심층 사고(Deep Think)** 모드를 핵심 두뇌로 사용합니다.3

### **3.1 시각적 기호학 분석 및 내러티브 추출 (Visual-to-Narrative)**

이미지 한 장에서 시나리오를 생성하는 과정은 단순한 캡셔닝(Captioning)을 넘어섭니다. 이는 이미지 속에 숨겨진 인과관계, 시간성, 그리고 잠재된 서사를 발굴하는 **'시각적 기호학(Visual Semiotics)'** 추론 과정입니다.

**프로세스 상세 흐름:**

1. **객체 및 속성 인식:** 제미나이 3의 멀티모달 비전 인코더가 이미지 내의 모든 객체(Object), 조명(Lighting), 재질(Material), 그리고 공간적 배치(Spatial Layout)를 식별합니다.  
2. **행동 유도성(Affordance) 추론:** 식별된 객체가 사용자에게 어떤 행동을 유발할 수 있는지 분석합니다. 예를 들어, '닫힌 문'은 '열기(Open)' 또는 '노크하기(Knock)'를 유도하며, '바닥에 떨어진 책'은 '줍기(Pick up)' 또는 '조사하기(Inspect)'를 유도합니다.1  
3. **특이점(Anomaly) 및 분위기(Mood) 분석:** 평범한 패턴에서 벗어난 요소를 탐지합니다. 서재 책상 위에 놓인 '식어버린 커피'는 "누군가 오랫동안 자리를 비웠음"을 암시하며, 깨진 유리창은 "침입" 또는 "폭력"을 암시합니다. 이러한 특이점이 시나리오의 시작점(Hook)이 됩니다.  
4. **심층 사고 시뮬레이션(Deep Think Simulation):** thinking\_level="high" 설정을 통해 모델은 내부적으로 수십 가지의 가능한 시나리오 분기를 시뮬레이션합니다 (예: "이 방은 살인 현장인가, 아니면 단순히 이사 중인가?"). 이 중 사용자의 초기 프롬프트(예: "미스터리 추리물")와 가장 논리적 개연성이 높은 서사를 선택합니다.9

### **3.2 의미론적 장면 그래프 (Semantic Scene Graph) 생성**

텍스트로 생성된 시나리오는 3D 공간으로 변환되기 위해 구조화된 데이터로 변환되어야 합니다. 이를 위해 중간 단계인 \*\*장면 그래프(Scene Graph)\*\*를 생성합니다. 이는 공간 내 객체들의 관계와 위치, 그리고 상호작용 속성을 정의하는 JSON 데이터입니다.10

**Scene Graph JSON 스키마 예시 (Zod 정의):**

TypeScript

const SceneNodeSchema \= z.object({  
  id: z.string(),  
  type: z.enum(\['static\_mesh', 'interactive\_prop', 'light', 'spawn\_point'\]),  
  description: z.string(), // 3D 생성 AI를 위한 프롬프트  
  transform: z.object({  
    position: z.tuple(\[z.number(), z.number(), z.number()\]), // 상대 좌표  
    rotation: z.tuple(\[z.number(), z.number(), z.number()\]),  
    scale: z.tuple(\[z.number(), z.number(), z.number()\]),  
  }),  
  affordances: z.array(z.string()), // 상호작용 가능 목록 (예: \['open', 'inspect'\])  
  relationships: z.array(z.object({  
    targetId: z.string(),  
    type: z.enum(\['on\_top\_of', 'next\_to', 'inside'\]),  
  })),  
});

const ScenarioSchema \= z.object({  
  title: z.string(),  
  theme: z.string(), // Skybox 생성용 스타일 프롬프트  
  nodes: z.array(SceneNodeSchema),  
  narrative\_arc: z.object({  
    intro: z.string(),  
    climax: z.string(),  
    resolution: z.string(),  
  }),  
});

이 장면 그래프는 LLM이 절대 좌표($x, y, z$)를 정확히 계산하기 어렵다는 한계를 극복하기 위해, '책상은 방 중앙에', '램프는 책상 위에'와 같은 \*\*의미론적 관계(Semantic Relationship)\*\*를 중심으로 정의됩니다. 실제 3D 좌표 변환은 후술할 **레이아웃 리졸버(Layout Resolver)** 알고리즘이 담당합니다.11

## ---

**4\. 생성형 3D 파이프라인 (Generative 3D Pipeline) 구축**

안티그라비티의 에이전트는 생성된 장면 그래프를 입력받아, 실제 3D 자산(Mesh, Texture, Environment)을 생성하고 배치하는 파이프라인을 자동으로 코딩하고 연결합니다. 이 과정은 "공장(Factory)"과 같이 자동화되어야 합니다.

### **4.1 환경 생성: Blockade Labs Skybox API 통합**

공간의 전체적인 분위기와 배경을 결정하는 스카이박스(Skybox)는 **Blockade Labs**의 Skybox AI API를 활용합니다. Visual-Core 에이전트는 다음과 같은 세부 로직을 구현합니다.

1. **프롬프트 엔지니어링 자동화:** 시나리오의 theme과 atmosphere 데이터를 바탕으로 Skybox API에 최적화된 프롬프트를 생성합니다.  
   * *입력:* "Gothic Mystery"  
   * *변환:* "Interior of a Victorian library, dust particles, moonlight piercing through tall windows, volumetric fog, 8k resolution, photorealistic style, equirectangular projection."  
2. **심도 맵(Depth Map) 활용:** 단순한 360도 이미지는 평면적입니다. API 요청 시 return\_depth=true 파라미터를 사용하여 Depth Map을 함께 요청합니다. Three.js 쉐이더에서 이 Depth Map을 활용하여 안개(Fog) 효과나 파티클 효과가 배경 깊이에 맞춰 올바르게 렌더링되도록 구현합니다.12  
3. **동적 리믹스(Remix) 기능 구현:** 사용자가 게임 진행 중 "불을 켠다"는 행동을 하면, 환경이 바뀌어야 합니다. 이를 위해 Skybox API의 **리믹스(Remix)** 기능을 활용합니다. 현재의 스카이박스 이미지를 control\_image로 설정하고 control\_model="remix" 파라미터를 사용하여, 구조(Structure)는 유지하되 조명(Lighting)과 분위기만 변경된 새로운 스카이박스를 생성합니다. 이는 사용자의 행동이 세계관에 실시간으로 반영되는 몰입감을 제공합니다.13

### **4.2 객체 생성: Tripo3D 및 Meshy AI 통합**

시나리오의 핵심 아이템(단서, 도구 등)은 **Tripo3D** 또는 **Meshy AI**의 Text-to-3D API를 통해 생성됩니다.

* **API 연동:** Visual-Core 에이전트는 각 서비스의 API 엔드포인트(POST /v1/text-to-model)를 호출하는 클라이언트 모듈을 작성합니다.  
* **지연 시간(Latency) 관리 전략:** 3D 모델 생성은 수 초에서 수 분이 소요될 수 있습니다. 이를 해결하기 위해 **점진적 로딩(Progressive Loading)** 전략을 사용합니다.  
  1. **플레이스홀더(Placeholder):** 객체가 생성되는 동안, 해당 위치에 "홀로그램 쉐이더"가 적용된 기본 도형(Cube, Sphere)을 즉시 배치하여 사용자가 상호작용(예: 클릭하여 정보 확인)할 수 있게 합니다.  
  2. **백그라운드 폴링(Polling):** 생성 작업의 상태(status)를 주기적으로 확인합니다.  
  3. **핫 스왑(Hot-swap):** GLB 파일 생성이 완료되면(SUCCEEDED), 안티그라비티가 작성한 AssetLoader 컴포넌트가 자동으로 홀로그램을 실제 모델로 교체하고, 등장 애니메이션(페이드 인, 파티클 효과)을 재생합니다.1

### **4.3 자동 레이아웃 해결 엔진 (Auto-Layout Resolver)**

LLM이 생성한 추상적인 위치 정보("책상 위")를 구체적인 3D 좌표($x, y, z$)로 변환하는 알고리즘 엔진입니다.

* **구속 조건 충족(Constraint Satisfaction):** 각 객체의 Bounding Box 크기를 고려하여 서로 겹치지 않게 배치합니다.  
* **레이캐스팅(Raycasting) 기반 접지:** 객체가 공중에 떠 있지 않도록, 위에서 아래로 가상의 레이(Ray)를 쏘아 부모 객체(예: 책상)의 표면 Y좌표를 찾아 배치합니다. 이를 위해 **Rapier** 물리 엔진의 레이캐스트 기능을 활용하여 충돌 지점을 정확히 계산합니다.16  
* **검증:** 이 엔진은 TypeScript로 작성되며, Logic-Weaver 에이전트가 핵심 알고리즘을 구현하고, QA-Pilot이 시뮬레이션을 통해 충돌 여부를 검증합니다.

## ---

**5\. 런타임 엔지니어링: Next.js \+ React Three Fiber (R3F)**

최종 사용자가 경험하게 될 클라이언트 애플리케이션의 기술적 구조입니다. **Next.js** 프레임워크 위에 \*\*React Three Fiber (R3F)\*\*를 얹어 선언적(Declarative)인 3D 프로그래밍 환경을 구축합니다.17

### **5.1 R3F 아키텍처 및 성능 최적화**

웹 환경에서의 3D 경험은 성능 최적화가 필수적입니다. 프레임 드랍은 멀미(Motion Sickness)를 유발할 수 있기 때문입니다.

* **온디맨드 렌더링(On-demand Rendering):** 배터리 소모와 발열을 줄이기 위해 \<Canvas frameloop="demand"\>를 사용합니다. 화면에 변화가 있을 때만(카메라 이동, 인터랙션 발생) invalidate() 함수를 호출하여 프레임을 렌더링합니다.18  
* **인스턴싱(Instancing):** 숲이나 책장과 같이 동일한 객체가 반복되는 경우, InstancedMesh를 사용하여 드로우 콜(Draw Call)을 획기적으로 줄입니다. Visual-Core 에이전트는 장면 그래프를 분석하여 반복되는 description을 가진 객체들을 자동으로 인스턴싱 그룹으로 묶습니다.19  
* **압축 파이프라인:** 생성된 모든 GLB 자산은 **Draco** 압축 알고리즘을 거쳐 클라이언트로 전송됩니다. 텍스처는 **WebP** 또는 **KTX2** 포맷으로 자동 변환되어 VRAM 사용량을 최소화합니다.8

### **5.2 물리 엔진 통합: Rapier Physics**

사실적인 상호작용을 위해 **Rapier** 물리 엔진(@react-three/rapier)을 통합합니다. 이는 WASM(WebAssembly) 기반으로 작동하여 자바스크립트 메인 스레드의 부하를 최소화합니다.

* **충돌체(Colliders) 자동 생성:** 생성된 3D 모델의 형태에 맞춰 볼록 헐(Convex Hull) 또는 트리메시(Trimesh) 충돌체를 자동으로 생성합니다.  
* **키네마틱 캐릭터 컨트롤러(Kinematic Character Controller):** 사용자의 이동은 물리력(Force)이 아닌 속도(Velocity) 기반의 키네마틱 제어를 사용하여, 벽에 부딪혔을 때 튕겨 나가는 현상 없이 자연스러운 이동과 슬라이딩(Wall Sliding)을 구현합니다.16

## ---

**6\. 논리 및 상태 관리: XState 기반 결정론적 제어**

단순히 공간을 보여주는 것을 넘어, 복잡한 퍼즐과 서사를 진행하기 위해서는 견고한 상태 관리 시스템이 필요합니다. 웹 파일럿 2.0은 **XState**를 사용하여 결정론적 상태 머신을 구축합니다.20

### **6.1 XState 도입의 필요성**

Zustand나 Redux와 같은 일반적인 상태 관리 라이브러리는 "변수(Data)"를 관리하는 데 적합하지만, "상태(State)"와 "전이(Transition)"를 관리하는 데는 한계가 있습니다. 예를 들어, "금고가 잠겨 있는 상태에서는 문을 열 수 없다"는 로직을 if (isLocked)와 같은 조건문으로 처리하면, 코드가 복잡해질수록 버그가 발생하기 쉽습니다. XState는 이를 수학적으로 모델링하여 불가능한 상태 전이를 원천적으로 차단합니다.21

### **6.2 자율 생성 상태 머신 (Autonomous FSM Generation)**

Logic-Weaver 에이전트는 인지 엔진이 추출한 서사 구조를 바탕으로 상태 머신 코드를 작성합니다.

**생성 프로세스:**

1. **상태 정의:** 시나리오 흐름에 따라 객체의 가능한 상태를 정의합니다 (예: 금고 \- Closed, Locked, Open, Broken).  
2. **이벤트 및 전이 정의:** 상태를 변경하는 이벤트와 조건을 정의합니다.  
   * Locked \-\> Closed (Event: UNLOCK, Guard: correctPassword)  
   * Closed \-\> Open (Event: OPEN)  
3. **코드 생성:** 정의된 로직을 TypeScript 코드로 변환합니다.

**생성된 코드 예시:**

TypeScript

import { setup, assign } from 'xstate';

export const safeMachine \= setup({  
  types: {  
    context: {} as { attempts: number },  
    events: {} as { type: 'UNLOCK'; code: string } | { type: 'OPEN' }  
  },  
  guards: {  
    checkCode: ({ event }) \=\> event.type \=== 'UNLOCK' && event.code \=== '1234'  
  }  
}).createMachine({  
  id: 'safe',  
  initial: 'locked',  
  context: { attempts: 0 },  
  states: {  
    locked: {  
      on: {  
        UNLOCK: \[  
          { target: 'closed', guard: 'checkCode' },  
          { actions: assign({ attempts: ({ context }) \=\> context.attempts \+ 1 }) } // 실패 시 시도 횟수 증가  
        \]  
      }  
    },  
    closed: {  
      on: { OPEN: 'open' }  
    },  
    open: {  
      type: 'final' // 최종 상태  
    }  
  }  
});

이 코드는 R3F 컴포넌트 내에서 useMachine 훅을 통해 연결되며, 3D 객체의 애니메이션과 UI 오버레이를 제어합니다.5

## ---

**7\. 성능 최적화 및 품질 보증 (QA)**

### **7.1 자율 QA 에이전트 (QA-Pilot)**

QA-Pilot 에이전트는 개발자가 잠을 자는 동안에도 끊임없이 시스템을 테스트합니다. Playwright 등을 이용한 E2E 테스트를 수행하며, 특히 3D 환경에 특화된 검증을 수행합니다.

* **충돌 테스트:** 랜덤한 위치에서 캐릭터를 생성하여 벽이나 가구와 충돌시킵니다. 물리 엔진이 제대로 작동하여 캐릭터가 뚫고 지나가지 않는지 확인합니다.  
* **성능 모니터링:** 다양한 시나리오에서 performance.now()를 측정하여 프레임 레이트가 55FPS 이하로 떨어지는 구간을 탐지하고, 해당 구간의 렌더링 부하 원인(과도한 폴리곤, 무거운 쉐이더 등)을 분석하여 보고서로 제출합니다.6

## ---

**8\. 결론 및 미래 전망**

본 보고서는 구글 안티그라비티와 제미나이 3 프로를 활용하여, 단 한 장의 이미지와 텍스트만으로 살아있는 3D 웹 경험을 창조하는 **웹 파일럿 2.0**의 상세 설계도를 제시했습니다. 이는 기존에 수십 명의 개발자와 아티스트가 수주 간 수행해야 했던 작업을, 단 한 명의 '아키텍트'와 AI 에이전트 팀이 몇 시간 만에 수행할 수 있게 만드는 소프트웨어 엔지니어링의 혁명입니다.

향후 **3D 가우시안 스플래팅(3D Gaussian Splatting)** 기술이 웹 표준에 통합되면, 현재의 폴리곤 기반 생성 방식은 사진에서 바로 3D 씬을 합성하는 볼류메트릭(Volumetric) 방식으로 진화할 것입니다.11 웹 파일럿 2.0의 유연한 에이전트 아키텍처는 이러한 미래 기술을 즉각적으로 파이프라인에 통합할 수 있는 확장성을 이미 확보하고 있습니다. 이제 개발자는 코드를 타이핑하는 노동자가 아니라, 세계를 설계하고 지휘하는 \*\*창조자(Creator)\*\*로서 거듭날 것입니다.

### **9\. 기술 스택 요약 및 선정 근거 (Technical Addendum)**

| 구성 요소 | 기술 스택 | 선정 근거 |
| :---- | :---- | :---- |
| **IDE 플랫폼** | **Google Antigravity** | 멀티 에이전트 오케스트레이션, 아티팩트 기반 검증, 매니저 뷰 제공 2 |
| **AI 모델** | **Gemini 3 Pro** | 1M+ 토큰 컨텍스트, 심층 사고(Deep Think)를 통한 복잡한 서사 및 논리 추론 3 |
| **3D 런타임** | **React Three Fiber** | 선언적 컴포넌트 구조로 장면 그래프와 1:1 매핑 용이, 방대한 에코시스템 17 |
| **물리 엔진** | **Rapier** | WASM 기반의 고성능, R3F 훅과의 완벽한 통합, 결정론적 시뮬레이션 23 |
| **상태 관리** | **XState** | 상태 폭발 방지, 복잡한 게임 로직의 시각화 및 정형 검증 가능 5 |
| **3D 생성 API** | **Blockade Labs / Tripo3D** | Skybox Remix 기능을 통한 동적 환경 변화, 빠른 Text-to-Mesh 생성 속도 13 |

#### **참고 자료**

1. 안티그라비티 웹 파일럿 AI 설계.pdf  
2. How to Set Up and Use Google Antigravity \- Codecademy, 1월 6, 2026에 액세스, [https://www.codecademy.com/article/how-to-set-up-and-use-google-antigravity](https://www.codecademy.com/article/how-to-set-up-and-use-google-antigravity)  
3. A new era of intelligence with Gemini 3 \- Google Blog, 1월 6, 2026에 액세스, [https://blog.google/products/gemini/gemini-3/](https://blog.google/products/gemini/gemini-3/)  
4. Build with Google Antigravity, our new agentic development platform, 1월 6, 2026에 액세스, [https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)  
5. Mastering UI Logic with State Machines in React | by Moh Y. \- Medium, 1월 6, 2026에 액세스, [https://medium.com/@adiktiv/mastering-ui-logic-with-state-machines-in-react-913146eaa761](https://medium.com/@adiktiv/mastering-ui-logic-with-state-machines-in-react-913146eaa761)  
6. Google Antigravity Makes the IDE a Control Plane for Agentic Coding \- MarkTechPost, 1월 6, 2026에 액세스, [https://www.marktechpost.com/2025/11/19/google-antigravity-makes-the-ide-a-control-plane-for-agentic-coding/](https://www.marktechpost.com/2025/11/19/google-antigravity-makes-the-ide-a-control-plane-for-agentic-coding/)  
7. Google Antigravity Tool (IDE): What It Is and How Developers Benefit \- Medium, 1월 6, 2026에 액세스, [https://medium.com/@expertappdevs/google-antigravity-tool-ide-what-it-is-and-how-developers-benefit-50119f8d886c](https://medium.com/@expertappdevs/google-antigravity-tool-ide-what-it-is-and-how-developers-benefit-50119f8d886c)  
8. Performance pitfalls \- Introduction \- React Three Fiber, 1월 6, 2026에 액세스, [https://r3f.docs.pmnd.rs/advanced/pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls)  
9. Gemini 3 Pro | Generative AI on Vertex AI \- Google Cloud Documentation, 1월 6, 2026에 액세스, [https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-pro](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-pro)  
10. 3DGraphLLM: Combining Semantic Graphs and Large Language Models for 3D Scene Understanding \- arXiv, 1월 6, 2026에 액세스, [https://arxiv.org/html/2412.18450v3](https://arxiv.org/html/2412.18450v3)  
11. 3DGraphLLM: Combining Semantic Graphs and Large Language Models for 3D Scene Understanding, 1월 6, 2026에 액세스, [https://openaccess.thecvf.com/content/ICCV2025/papers/Zemskova\_3DGraphLLM\_Combining\_Semantic\_Graphs\_and\_Large\_Language\_Models\_for\_3D\_ICCV\_2025\_paper.pdf](https://openaccess.thecvf.com/content/ICCV2025/papers/Zemskova_3DGraphLLM_Combining_Semantic_Graphs_and_Large_Language_Models_for_3D_ICCV_2025_paper.pdf)  
12. Skyboxes | Blockade Labs API Documentation, 1월 6, 2026에 액세스, [https://api-documentation.blockadelabs.com/api/skybox.html](https://api-documentation.blockadelabs.com/api/skybox.html)  
13. Remixing your Skyboxes in Skybox AI \- Blockade Labs, 1월 6, 2026에 액세스, [https://support.blockadelabs.com/hc/en-us/articles/22439759004818-Remixing-your-Skyboxes-in-Skybox-AI](https://support.blockadelabs.com/hc/en-us/articles/22439759004818-Remixing-your-Skyboxes-in-Skybox-AI)  
14. Change Log | Blockade Labs API Documentation, 1월 6, 2026에 액세스, [https://api-documentation.blockadelabs.com/api/changelog.html](https://api-documentation.blockadelabs.com/api/changelog.html)  
15. Tripo API Node Model Generation ComfyUI Official Example, 1월 6, 2026에 액세스, [https://docs.comfy.org/tutorials/partner-nodes/tripo/model-generation](https://docs.comfy.org/tutorials/partner-nodes/tripo/model-generation)  
16. Custom physics with R3F: which hook should it go in? : r/threejs \- Reddit, 1월 6, 2026에 액세스, [https://www.reddit.com/r/threejs/comments/18yg23o/custom\_physics\_with\_r3f\_which\_hook\_should\_it\_go\_in/](https://www.reddit.com/r/threejs/comments/18yg23o/custom_physics_with_r3f_which_hook_should_it_go_in/)  
17. React Three Fiber: Introduction, 1월 6, 2026에 액세스, [https://r3f.docs.pmnd.rs/getting-started/introduction](https://r3f.docs.pmnd.rs/getting-started/introduction)  
18. Scaling performance \- React Three Fiber, 1월 6, 2026에 액세스, [https://r3f.docs.pmnd.rs/advanced/scaling-performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)  
19. Building Efficient Three.js Scenes: Optimize Performance While Maintaining Quality, 1월 6, 2026에 액세스, [https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)  
20. Comparison \- Zustand, 1월 6, 2026에 액세스, [https://zustand.docs.pmnd.rs/getting-started/comparison](https://zustand.docs.pmnd.rs/getting-started/comparison)  
21. Modern State Management Libraries for React: A Comparative Guide \- DEV Community, 1월 6, 2026에 액세스, [https://dev.to/kafrontdev/modern-state-management-libraries-for-react-a-comparative-guide-17kf](https://dev.to/kafrontdev/modern-state-management-libraries-for-react-a-comparative-guide-17kf)  
22. @xstate/react \- Stately.ai, 1월 6, 2026에 액세스, [https://stately.ai/docs/xstate-react](https://stately.ai/docs/xstate-react)  
23. pmndrs/react-three-rapier: Rapier physics in React \- GitHub, 1월 6, 2026에 액세스, [https://github.com/pmndrs/react-three-rapier](https://github.com/pmndrs/react-three-rapier)