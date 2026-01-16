# **차세대 생성형 공간 콘텐츠 플랫폼 (GSCP) 시스템 상세 설계서**

## **1\. 시스템 개요 (System Overview)**

본 문서는 텍스트와 이미지 입력을 통해 자동으로 3D 공간, 객체, 시나리오를 생성하고, 이를 웹상에서 즉시 실행 가능한 형태(Executable Content)로 변환하는 \*\*GSCP(Generative Spatial Content Platform)\*\*의 상세 설계를 기술합니다.

* **핵심 목표:** "상상하는 즉시 플레이 가능한(Imagine-to-Play)" 경험 제공.  
* **주요 기능:** 자동화된 3D 월드 구축, 뉴로-심볼릭 기반 게임 로직 생성, 멀티모달 AI 에이전트(NPC) 통합.  
* **기술적 차별점:** Hunyuan3D 2.0 기반의 고품질 자산 생성, WebGPU를 활용한 클라이언트 사이드 렌더링, 자율적 NPC 아키텍처 도입.

## ---

**2\. 시스템 아키텍처 (System Architecture)**

전체 시스템은 크게 **입력 처리 레이어**, **생성 코어(Generative Core)**, \*\*런타임 엔진(Runtime Engine)\*\*의 3계층으로 구성됩니다.

### **2.1 아키텍처 다이어그램**

코드 스니펫

graph TD  
    User\[사용자 입력 (텍스트/이미지)\] \--\> InputLayer\[입력 처리 및 의도 분석 (VLM)\]  
    InputLayer \--\> |JSON Layout & Logic| GenCore  
      
    subgraph "생성 코어 (Generative Core)"  
        Direction\[디렉터 모듈\] \--\> |Task 분배| AssetGen  
        Direction \--\> |Scenario 분배| LogicGen\[로직/시나리오 생성기\]  
          
        AssetGen \--\> |Mesh/Texture| Hunyuan  
        AssetGen \--\> |Rigging| UniRig  
          
        LogicGen \--\> |Behavior Tree| CodeBT  
        LogicGen \--\> |Agent Mind| Altera\[Altera Agent Arch\]  
    end  
      
    GenCore \--\> |OpenUSD / glTF| Assembler\[월드 어셈블러\]  
    Assembler \--\> |Optimized Assets| Runtime

## ---

**3\. 상세 모듈 설계 (Detailed Module Design)**

### **3.1 3D 자산 생성 모듈 (Visual Asset Generator)**

기존의 단순 Point Cloud 방식에서 벗어나, 고해상도 텍스처와 메쉬를 동시에 확보하기 위해 2025년 최신 기술인 **Hunyuan3D 2.0** 파이프라인을 채택합니다.

* **Hunyuan3D 2.0 통합:**  
  * **Shape Generation (Hunyuan3D-DiT):** 텍스트/이미지 프롬프트로부터 기하학적 구조(Geometry)를 생성하는 확산 변환기(Diffusion Transformer) 모델을 사용합니다. 이는 기존 모델 대비 복잡한 구조의 정합성을 획기적으로 개선합니다.  
  * **Texture Synthesis (Hunyuan3D-Paint):** 생성된 메쉬에 고해상도 텍스처를 입히는 단계로, 기하학적 왜곡 없이 텍스트 설명에 부합하는 재질을 생성합니다.  
* **렌더링 최적화 (3DGS):**  
  * 생성된 자산을 실시간 웹 렌더링에 적합하도록 **3D Gaussian Splatting** 형식으로 변환하거나, 물리 엔진 적용을 위해 메쉬 데이터를 유지하는 하이브리드 방식을 사용합니다.

### **3.2 캐릭터 및 애니메이션 모듈 (Character & Kinetic Module)**

정적인 3D 모델에 '움직임'을 부여하여 실행 가능한 콘텐츠로 만듭니다.

* **자동 리깅 (UniRig):**  
  * 인간형뿐만 아니라 이족, 사족 보행 괴물 등 다양한 형태의 모델에 대해 뼈대(Skeleton)와 스킨 웨이트(Skin Weights)를 자동으로 생성합니다. 이는 사용자가 생성한 독창적인 크리처를 즉시 게임 캐릭터로 변환하는 데 필수적입니다.1  
* **모션 리타겟팅 (WonderDynamics/Move.ai):**  
  * 비디오 입력을 통해 캐릭터의 동작을 생성하거나, 텍스트 지시("춤추는 오크")를 통해 사전 학습된 모션 라이브러리를 캐릭터에 매핑합니다.

### **3.3 로직 및 에이전트 엔진 (Logic & Agent Engine)**

단순한 스크립트 실행을 넘어, 기억과 사회성을 가진 NPC를 구현하기 위해 **Altera** 및 **Neuro-Symbolic** 아키텍처를 적용합니다.

* **디지털 휴먼 아키텍처 (Altera Project Sid 기반):**  
  * **복합 AI 모델:** 단순 LLM 응답이 아닌, 뇌과학에 기반한 복합 모듈(기억, 사회적 규범, 감정 상태)을 사용하여 NPC가 장기적인 자율성을 갖도록 설계합니다.  
  * **장기 기억 (Long-term Autonomy):** 플레이어와의 상호작용을 저장하고 시간이 지나도 잊지 않으며, 동료 NPC와 협력하거나 독자적인 목표를 수행하는 '살아있는' 에이전트를 구현합니다.  
* **절차적 로직 생성 (Code-BT):**  
  * 오류가 잦은 직접 코드 생성 대신, **행동 트리(Behavior Tree)** 구조를 생성하여 게임 로직의 안정성을 확보합니다. LLM은 "순찰하다 적을 보면 공격해"라는 텍스트를 Sequence\] 형태의 트리 구조로 변환합니다.2  
* **로직 검증 (TextArena):**  
  * 생성된 게임 규칙과 텍스트 기반 로직이 논리적으로 타당한지 검증하기 위해 **TextArena**와 같은 샌드박스 환경에서 시뮬레이션을 거친 후 배포합니다.

### **3.4 런타임 및 렌더링 환경 (Runtime Environment)**

웹 브라우저에서 플러그인 없이 실행 가능한 고성능 환경을 구축합니다.

* **WebGPU 기반 엔진:**  
  * Babylon.js 또는 Three.js의 WebGPU 렌더러를 사용하여, 수백만 개의 3D Gaussian Splats와 물리 연산을 60fps 이상으로 처리합니다.3  
* **실시간 월드 모델 (OASIS \- 실험적 기능):**  
  * 전통적인 3D 엔진 방식 외에, **OASIS**와 같은 **AI 월드 모델**을 도입하여, 렌더링 과정 없이 AI가 실시간으로 프레임을 생성하는 '인터랙티브 비디오' 모드를 R\&D 과제로 포함합니다. 이는 저사양 기기에서도 4K급 화질의 게임 플레이를 가능하게 할 미래 기술입니다.

## ---

**4\. 데이터 파이프라인 (Data Pipeline)**

1. **입력 분석 (Intent Analysis):**  
   * 사용자 프롬프트: "중세 판타지 마을에서 용과 싸우는 게임 만들어줘."  
   * VLM/LLM 분석: 장르(RPG), 배경(Medieval), 주요 객체(Dragon, Village), 승리 조건(Kill Dragon) 추출.  
2. **레이아웃 생성 (Layout Generation):**  
   * LLM이 JSON 형식의 공간 배치도 생성 (마을 중앙에 분수대, 북쪽에 용의 둥지 배치).  
3. **자산 병렬 생성 (Parallel Asset Gen):**  
   * AssetGen\_Worker\_1: 마을 건물 및 소품 생성 (Hunyuan3D).  
   * AssetGen\_Worker\_2: 용 캐릭터 생성 및 리깅 (Hunyuan3D \+ UniRig).  
   * LogicGen\_Worker: 용의 AI 패턴 및 플레이어 조작 스크립트 생성.  
4. **어셈블리 (Assembly):**  
   * 생성된 자산들을 OpenUSD 포맷으로 통합하고, 물리 속성(Collision, Physics Material)을 자동 부여.  
5. **배포 (Deployment):**  
   * 최적화된 glTF/USD 파일과 WebAssembly(WASM) 로직 파일을 패키징하여 CDN에 업로드.

## ---

**5\. 기술 스택 요약 (Technology Stack)**

| 구분 | 기술 스택 | 비고 |
| :---- | :---- | :---- |
| **Frontend** | React, Generative UI | 사용자 맞춤형 인터페이스 생성 |
| **3D Generation** | **Hunyuan3D 2.0**, 3DGS | High-Fidelity Mesh & Texture |
| **Physics/Rigging** | **UniRig**, PhysGaussian | 자동 리깅 및 물리 충돌 처리 1 |
| **Logic/NPC** | **Altera Architecture**, GPT-4o | 장기 기억 및 자율 에이전트 |
| **Game Engine** | **Babylon.js (WebGPU)** | 웹 기반 고성능 렌더링 |
| **Validation** | **TextArena** | 게임 룰 및 로직 검증 |
| **Experimental** | **OASIS (Decart)** | 실시간 생성형 비디오 게임 엔진 |
| **Interchange** | **OpenUSD** | 산업 표준 데이터 교환 포맷 |

## ---

**6\. 결론 및 기대 효과**

본 설계는 단순한 3D 모델링 도구를 넘어, **지능형 에이전트**와 **실행 가능한 게임 로직**이 결합된 완전한 콘텐츠 플랫폼을 지향합니다. 특히 **Hunyuan3D 2.0**의 고품질 자산 생성 능력과 **Altera**의 자율 에이전트 기술을 결합함으로써, 사용자는 텍스트 입력만으로 '살아있는' 가상 세계를 창조하고 경험할 수 있습니다. 이는 게임 개발의 민주화를 이끄는 핵심 플랫폼이 될 것입니다.

#### **참고 자료**

1. VAST-AI-Research/UniRig: \[SIGGRAPH 2025\] One Model to Rig Them All \- GitHub, 1월 8, 2026에 액세스, [https://github.com/VAST-AI-Research/UniRig](https://github.com/VAST-AI-Research/UniRig)  
2. A Code-Driven Approach to Behavior Tree Generation for Robot Tasks Planning with Large Language Models \- IJCAI, 1월 8, 2026에 액세스, [https://www.ijcai.org/proceedings/2025/0980.pdf](https://www.ijcai.org/proceedings/2025/0980.pdf)  
3. Unlock the Potential of AI and Immersive Web Applications with WebGPU | by Intel \- Medium, 1월 8, 2026에 액세스, [https://medium.com/intel-tech/unlock-the-potential-of-ai-and-immersive-web-applications-with-webgpu-4a1cff079178](https://medium.com/intel-tech/unlock-the-potential-of-ai-and-immersive-web-applications-with-webgpu-4a1cff079178)