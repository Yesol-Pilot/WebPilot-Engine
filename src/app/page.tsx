'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSceneData } from '@/context/SceneContext';
import { GeminiService } from '@/services/GeminiService';
// [SSOT] 통합 스토어 사용 (레거시 스토어 대체)
import { useUnifiedStore, getUnifiedStore } from '@/store/unifiedStore';
import { useGameStore } from '@/store/gameStore'; // 레거시 호환
import { useGameStore as useGameStore2 } from '@/store/game'; // 레거시 호환
import { useSceneStore } from '@/store/useSceneStore'; // 레거시 호환 (단계적 제거 예정)
import { LEGACY_SCENARIOS, DEFAULT_SCENARIO } from '@/data/scenarios';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
import { Loader } from '@react-three/drei';
import { SceneNode } from '@/lib/schema/scene';
import dynamic from 'next/dynamic';
import AssetPreloader from '@/components/studio/AssetPreloader';
import DirectorChatPanel from '@/components/studio/DirectorChatPanel';

// 동적 import로 PreviewCanvas 로드 (SSR 비활성화)
const PreviewCanvas = dynamic(
  () => import('@/components/studio/PreviewCanvas'),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-950 rounded-2xl flex items-center justify-center text-gray-500">🎮 캔버스 로딩...</div> }
);

/**
 * 크리에이터 스튜디오
 * 3열 구조: 입력 | 3D 미리보기 | 설정
 */
export default function CreatorStudioPage() {
  const router = useRouter();
  const { setSceneData } = useSceneData();

  // 입력 상태
  const [inputMode, setInputMode] = useState<'image' | 'text'>('image');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  // 설정 상태
  const [selectedGenre, setSelectedGenre] = useState('none');
  const [selectedGameType, setSelectedGameType] = useState('escape');
  const [selectedEngine, setSelectedEngine] = useState<'tripo' | 'hyper3d'>('tripo');
  const [useAIPipeline, setUseAIPipeline] = useState(true); // 새 AI Pipeline 사용 여부

  // 생성 상태
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [previewNodes, setPreviewNodes] = useState<SceneNode[]>([]);

  // 게임 진입 상태
  const [isIngame, setIsIngame] = useState(false);

  // Agent 초기화 상태
  const [agentReady, setAgentReady] = useState(false);
  const [agentError, setAgentError] = useState('');

  // 생성 가능 여부
  const canGenerate = inputMode === 'image' ? !!imagePreview : !!prompt.trim();

  // Agent Refs
  const directorRef = React.useRef<any>(null);

  // [Phase 6] Initialize Agent System (에러 핸들링 + 타임아웃 추가)
  React.useEffect(() => {
    const initAgents = async () => {
      try {
        console.log('[System] Agent 시스템 초기화 시작...');

        // Neo4jService 초기화 (실패해도 Mock Mode로 전환됨)
        try {
          const { Neo4jService } = await import('@/services/graph/Neo4jService');
          await Promise.race([
            Neo4jService.initialize(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Neo4j 타임아웃')), 5000))
          ]);
        } catch (neo4jErr) {
          console.warn('[System] Neo4j 초기화 스킵 (Mock Mode):', neo4jErr);
        }

        const { isFeatureEnabled } = await import('@/config/featureFlags');

        if (isFeatureEnabled('ENABLE_SYNAPTIC_BRIDGE_MS1_5')) {
          // MS1.5: 신경-유기적 파이프라인
          const { CommanderCell } = await import('@/cells/cortex/CommanderCell');
          const { SpatialZonerCell } = await import('@/cells/musculoskeletal/SpatialZonerCell');
          const { PropMasterCell } = await import('@/cells/musculoskeletal/PropMasterCell');
          const { AssetHunterCell } = await import('@/cells/musculoskeletal/AssetHunterCell');
          const { ConstructorSquad } = await import('@/cells/musculoskeletal/ConstructorSquad');
          // MS3: 면역 분대
          const { SemanticNKCell } = await import('@/cells/immune/SemanticNKCell');
          const { AestheticMacrophage } = await import('@/cells/immune/AestheticMacrophage');

          // 세포 인스턴스 생성
          const commander = new CommanderCell();
          new SpatialZonerCell();
          new PropMasterCell();
          new AssetHunterCell();
          new ConstructorSquad();
          new SemanticNKCell();
          new AestheticMacrophage();

          (directorRef as any).current = commander;
          console.log('[System] 🧬 Neuro-Organic Pipeline Ready (MS1.5 + MS3 Immune)');
        } else {
          // 레거시: DirectorAgent 파이프라인
          const { DirectorAgent } = await import('@/services/a2a/DirectorAgent');
          const { ArchitectAgent } = await import('@/services/a2a/ArchitectAgent');
          const { VisualCoreAgent } = await import('@/services/a2a/VisualCoreAgent');

          directorRef.current = new DirectorAgent();
          new ArchitectAgent();
          new VisualCoreAgent();
          console.log('[System] All Agents Online & Ready. (Legacy)');
        }

        setAgentReady(true);
        console.log('[System] ✅ Agent 시스템 초기화 완료!');
      } catch (err) {
        const msg = err instanceof Error ? err.message : '알 수 없는 오류';
        console.error('[System] ❌ Agent 초기화 실패:', msg);
        setAgentError(`Agent 초기화 실패: ${msg}`);
        // 실패해도 UI는 동작 가능하게: agentReady는 false로 유지
      }
    };

    initAgents();
  }, []);

  // [Phase 8] Unified Store 구독 및 UI 동기화
  const unifiedStore = useUnifiedStore();

  React.useEffect(() => {
    // 1. 씬 데이터 동기화
    if (unifiedStore.aiScene?.objects) {
      setPreviewNodes(unifiedStore.aiScene.objects as any);

      // 레거시 호환: SceneContext도 업데이트 (PreviewCanvas가 사용)
      if (unifiedStore.aiScene.objects.length > 0) {
        const scenario = unifiedStore.convertAISceneToScenario();
        if (scenario) setSceneData(scenario as any);
      }
    }

    // 2. 로딩 상태 동기화
    if (unifiedStore.isLoading !== loading) {
      setLoading(unifiedStore.isLoading);
    }
    if (unifiedStore.loadingMessage && unifiedStore.loadingMessage !== status) {
      setStatus(unifiedStore.loadingMessage);
    }
    if (unifiedStore.error && unifiedStore.error !== error) {
      setError(unifiedStore.error);
    }
  }, [unifiedStore.aiScene, unifiedStore.isLoading, unifiedStore.loadingMessage, unifiedStore.error]);
  const handleEnterHogwarts = () => {
    const store = useGameStore.getState();
    const scenario = LEGACY_SCENARIOS.SortingCeremony;
    store.setScenario(scenario);
    store.setLoaded(true);
    setSceneData(scenario);
    router.push('/demo/sorting');
  };

  /**
   * 체험하기 진입 (SSOT 기반)
   * 
   * [리팩토링] 3중 스토어 의존성 → 통합 스토어 단일 연결
   */
  const handleStartDemo = () => {
    const unifiedStore = getUnifiedStore();

    // [SSOT] AI 씬 확인 → 통합 스토어 사용
    if (unifiedStore.aiScene.isGenerated && unifiedStore.aiScene.objects.length > 0) {
      console.log('[Studio] AI 생성 씬으로 진입:', unifiedStore.aiScene.objects.length, '개 오브젝트');

      // [SSOT] 단일 액션으로 월드 진입
      unifiedStore.enterAIWorld();

      // 레거시 호환 (단계적 제거 예정)
      const scenario = unifiedStore.convertAISceneToScenario();
      if (scenario) {
        setSceneData(scenario as any);
        // 레거시 스토어 동기화 (제거 대상)
        useGameStore.getState().setScenario(scenario as any);
        useGameStore2.getState().loadScenario(scenario as any);

        // [구조 개선] 페이지 리로드에서도 AI 씬 전체 상태 보존
        // lighting, particles, postProcessing 등 환경 리소스까지 포함
        try {
          sessionStorage.setItem('webpilot_ai_scene', JSON.stringify({
            scenario,
            gameMode: 'custom',
            aiScene: unifiedStore.aiScene, // 전체 AISceneState 직렬화
            timestamp: Date.now(),
          }));
          console.log('[Studio] AI 씬 sessionStorage 저장 완료 (환경 리소스 포함)');
        } catch (e) {
          console.warn('[Studio] sessionStorage 저장 실패:', e);
        }
      }

      // [FIX] Next.js 16 canary에서 router.push 불안정 → 전체 페이지 이동
      window.location.href = '/game';
    } else {
      // 생성된 씬이 없으면 기본 시나리오 사용
      console.log('[Studio] 기본 시나리오로 진입');
      const scenario = DEFAULT_SCENARIO;

      // [SSOT] 통합 스토어로 시나리오 로드
      unifiedStore.loadScenario(scenario as any);
      unifiedStore.setGameMode('demo');

      // 레거시 호환 (단계적 제거 예정)
      useGameStore.getState().setScenario(scenario as any);
      useGameStore.getState().setLoaded(true);
      useGameStore2.getState().loadScenario(scenario as any);

      setSceneData(scenario);
      // [FIX] Next.js 16 canary에서 router.push 불안정 → 전체 페이지 이동
      window.location.href = '/game';
    }
  };

  // [FIX] AI 파이프라인이 통합 스토어에 씬을 설정하면 previewNodes 자동 동기화
  const aiSceneObjects = useUnifiedStore((s) => s.aiScene.objects);
  const aiSceneGenerated = useUnifiedStore((s) => s.aiScene.isGenerated);

  React.useEffect(() => {
    if (aiSceneGenerated && aiSceneObjects.length > 0 && previewNodes.length === 0) {
      // AI 파이프라인이 씬을 생성했지만 previewNodes가 비어있는 경우 동기화
      const nodes = aiSceneObjects.map((obj: any) => ({
        id: obj.id || obj.concept,
        name: obj.name || obj.concept,
        modelUrl: obj.modelUrl || obj.file_path,
        position: obj.position || [0, 0, 0],
        rotation: obj.rotation || [0, 0, 0],
        scale: obj.scale || [1, 1, 1],
      }));
      setPreviewNodes(nodes as any);
      setStatus('🎮 "월드 입장" 버튼을 클릭하세요!');
      setLoading(false);
      console.log('[Studio] AI 파이프라인 씬 → previewNodes 동기화:', nodes.length, '개');
    }
  }, [aiSceneGenerated, aiSceneObjects]);

  // 생성 핸들러
  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    setStatus(inputMode === 'image' ? '🔍 이미지 분석 중...' : '📝 시나리오 작성 중...');

    // [FIX] 이전 씬 데이터 클리어 (캐시 잔재 방지)
    setPreviewNodes([]);
    sessionStorage.removeItem('webpilot_ai_scene');

    // 생성 카운터 초기화 (1회 시도당 5개 제한)
    if (typeof window !== 'undefined') {
      (window as Window & { __GENERATION_COUNT?: number }).__GENERATION_COUNT = 0;
    }

    try {
      let sceneGraph;

      console.log('[CreatorStudio] Generating with:', { inputMode, prompt, imagePreview: !!imagePreview, useAIPipeline });

      // [Phase 3] 단일 컨테이너 프롬프트 감지 - AI 우회 (정확한 모델 매칭)
      const SINGLE_CONTAINER_KEYWORDS: Record<string, { modelUrl: string, scale: number }> = {
        // 호그와트 환경
        '슬리데린': { modelUrl: '/models/buildings/slytherin_dorm_room.glb', scale: 3 },
        'slytherin': { modelUrl: '/models/buildings/slytherin_dorm_room.glb', scale: 3 },
        '그리핀도르': { modelUrl: '/models/buildings/gryffindor_common_room.glb', scale: 3 },
        'gryffindor': { modelUrl: '/models/buildings/gryffindor_common_room.glb', scale: 3 },
        '덤블도어': { modelUrl: '/models/buildings/dumbledores_office.glb', scale: 3 },
        'dumbledore': { modelUrl: '/models/buildings/dumbledores_office.glb', scale: 3 },
        '호그와트 대강당': { modelUrl: '/models/buildings/hogwarts_grand_hall.glb', scale: 3 },
        '대강당': { modelUrl: '/models/buildings/hogwarts_grand_hall.glb', scale: 3 },
        'grand hall': { modelUrl: '/models/buildings/hogwarts_grand_hall.glb', scale: 3 },
        'hogwarts hall': { modelUrl: '/models/buildings/hogwarts_grand_hall.glb', scale: 3 },
        '마법약 교실': { modelUrl: '/models/buildings/potions_classroom.glb', scale: 3 },
        'potions': { modelUrl: '/models/buildings/potions_classroom.glb', scale: 3 },
        '올리밴더': { modelUrl: '/models/buildings/ollivanders_wand_shop.glb', scale: 3 },
        'ollivander': { modelUrl: '/models/buildings/ollivanders_wand_shop.glb', scale: 3 },
        '허니듀크': { modelUrl: '/models/buildings/honey_dukes_shop.glb', scale: 3 },
        'honeydukes': { modelUrl: '/models/buildings/honey_dukes_shop.glb', scale: 3 },
        '엄브릿지': { modelUrl: '/models/buildings/umbridges_office.glb', scale: 3 },
        'umbridge': { modelUrl: '/models/buildings/umbridges_office.glb', scale: 3 },
        '유령의 집': { modelUrl: '/models/buildings/haunted_house.glb', scale: 3 },
        'haunted house': { modelUrl: '/models/buildings/haunted_house.glb', scale: 3 },
      };

      const lowerPrompt = prompt.toLowerCase();
      const matchedContainer = Object.entries(SINGLE_CONTAINER_KEYWORDS).find(([key]) =>
        lowerPrompt.includes(key.toLowerCase())
      );

      // 1. 단일 컨테이너 감지 (최우선 - AI 우회)
      /* [User Request: 하드코딩 제거] - 모든 요청을 AI Agent가 처리하도록 변경
      if (matchedContainer && inputMode === 'text') {
        const [key, config] = matchedContainer;
        console.log(`[CreatorStudio] 🎯 단일 컨테이너 감지: ${key} → AI 우회`);

        sceneGraph = {
           // ... (Existing Hardcoded Logic)
        } as unknown as any;
        console.log('[CreatorStudio] 📊 Direct Container Load:', sceneGraph);
      }
      */
      // 2. [Phase 6] Agent System (뉴로-심볼릭 파이프라인)
      if (useAIPipeline && inputMode === 'text') {
        const { isFeatureEnabled } = await import('@/config/featureFlags');

        if (isFeatureEnabled('ENABLE_SYNAPTIC_BRIDGE_MS1_5')) {
          // MS1.5: CommanderCell 오케스트레이션
          const commander = (directorRef as any).current;
          if (!commander || !commander.orchestrate) {
            throw new Error('CommanderCell이 초기화되지 않았습니다.');
          }

          setStatus('🧬 신경-유기적 파이프라인 가동 중...');
          console.log(`[CreatorStudio] CommanderCell.orchestrate: ${prompt}`);
          await commander.orchestrate(prompt);
        } else {
          // 레거시: DirectorAgent
          if (!directorRef.current) throw new Error('Agent System not initialized');

          setStatus('🤖 Agents Working: Director -> Architect -> VisualCore...');
          console.log(`[CreatorStudio] Calling DirectorAgent for: ${prompt}`);
          await directorRef.current.createScenario(prompt);
        }

        setStatus('✅ 요청 전달 완료! 에이전트가 작업 중입니다.');
        setLoading(false);
        return;
      }
      // 3. 이미지 분석 (Legacy)
      else if (inputMode === 'image' && imagePreview) {
        sceneGraph = await GeminiService.analyzeImage(imagePreview, prompt, selectedGenre, selectedGameType);
      }
      // 4. 기본 텍스트 생성 (Legacy Fallback)
      else {
        console.log('[CreatorStudio] 🧠 Legacy Gemini Generation...');
        sceneGraph = await GeminiService.generateScenarioFromText(prompt, selectedGenre);
      }

      console.log('[CreatorStudio] 📊 Raw SceneGraph:', sceneGraph);

      if (!sceneGraph || !sceneGraph.nodes) {
        throw new Error("생성된 시나리오가 올바르지 않습니다.");
      }

      setStatus('✅ 분석 완료! 미리보기 생성 중...');
      setPreviewNodes(sceneGraph.nodes as any);

      // 스토어에 저장
      setSceneData(sceneGraph);
      const store = useGameStore.getState();
      store.setGenre(selectedGenre);
      store.setGameType(selectedGameType);
      store.setScenario(sceneGraph); // 시나리오 데이터 동기화

      setStatus('🎮 "월드 입장" 버튼을 클릭하세요!');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.';
      console.error('Generation Failed:', err);
      setError(errorMessage);
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  // 월드 입장 (Seamless Transition)
  // [FIX] 통합 스토어의 최신 AI 씬을 우선 사용 (stale 캐시 방지)
  const handleEnterWorld = () => {
    const unifiedStore = getUnifiedStore();
    const store = useGameStore.getState();
    const gameStore2 = useGameStore2.getState();

    // 1. 통합 스토어에서 최신 AI 씬 확인
    if (unifiedStore.aiScene.isGenerated && unifiedStore.aiScene.objects.length > 0) {
      console.log('[Studio] ✅ 통합 스토어 AI 씬으로 월드 진입:', unifiedStore.aiScene.objects.length, '개 오브젝트');

      // AI 씬 → Scenario 변환
      unifiedStore.enterAIWorld();
      const scenario = unifiedStore.convertAISceneToScenario();

      if (scenario) {
        // 레거시 스토어 동기화
        setSceneData(scenario as any);
        store.setScenario(scenario as any);
        store.setLoaded(true);
        gameStore2.loadScenario(scenario as any);
        gameStore2.setGameMode('custom');

        // sessionStorage에 저장 (페이지 리로드 생존)
        try {
          sessionStorage.setItem('webpilot_ai_scene', JSON.stringify({
            scenario,
            gameMode: 'custom',
            aiScene: unifiedStore.aiScene,
            timestamp: Date.now(),
          }));
        } catch (e) {
          console.warn('[Studio] sessionStorage 저장 실패:', e);
        }
      }
    } else if (store.scenario) {
      // 2. 레거시 시나리오 사용 (AI 파이프라인 아닌 경우)
      console.log('[Studio] 레거시 시나리오로 월드 진입');
      store.setLoaded(true);
      if (store.scenario.id) {
        gameStore2.loadScenario(store.scenario as any);
        gameStore2.setGameMode('custom');
      }
    }

    setIsIngame(true); // 페이지 이동 없이 즉시 게임 모드 전환
  };

  // 게임 모드일 경우 Experience 렌더링
  if (isIngame) {
    const Experience = dynamic(() => import('@/components/canvas/Experience'), {
      ssr: false,
      loading: () => <div className="w-full h-full bg-black text-white flex items-center justify-center">🎮 게임 로딩 중...</div>
    });

    return (
      <main className="w-full h-screen relative">
        <Experience />
        {/* 나가기 버튼 */}
        <button
          onClick={() => setIsIngame(false)}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-black/50 text-white rounded-lg hover:bg-black/80 transition-all text-xs border border-white/10"
        >
          ← 스튜디오로 돌아가기
        </button>
      </main>
    );
  }

  return (
    <>
      <OnboardingOverlay />

      <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
        {/* 헤더 */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              WebPilot Studio
            </h1>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Beta</span>
          </div>

          <div className="flex gap-3">
            {/* 기본 데모 (Primary) */}
            <button
              onClick={handleStartDemo}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-sm font-bold hover:scale-105 transition-transform border border-cyan-400/30 shadow-lg shadow-cyan-900/20"
            >
              <span>✨</span>
              <span>체험하기</span>
            </button>

            {/* 호그와트 데모 (Legacy) */}
            <button
              onClick={handleEnterHogwarts}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm font-medium hover:scale-105 transition-transform border border-white/10 text-gray-400 hover:text-white"
            >
              <span>🎩</span>
              <span>Legacy</span>
            </button>
          </div>
        </header>

        {/* 메인 2열 레이아웃 (Chat + Canvas) */}
        <main className="flex-1 flex gap-4 p-4 overflow-hidden">
          {/* 좌측: Director Chat + 설정 */}
          <div className="w-96 flex-shrink-0 flex flex-col gap-4">
            {/* Director Chat (메인 입력) */}
            <DirectorChatPanel
              directorRef={directorRef}
              isEmbedded={true}
              agentReady={agentReady}
              agentError={agentError}
            />

            {/* 축소된 설정 패널 */}
            <div className="bg-gray-900/50 backdrop-blur rounded-2xl border border-white/10 p-4 space-y-3">
              <h3 className="text-sm font-bold text-gray-400">⚙️ 설정</h3>

              <div className="flex gap-2">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  title="장르 선택"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-sm text-white"
                >
                  <option value="auto">🎭 장르: Auto</option>
                  <option value="fantasy">🐉 Fantasy</option>
                  <option value="scifi">🚀 Sci-Fi</option>
                  <option value="horror">👻 Horror</option>
                  <option value="nature">🌲 Nature</option>
                </select>
                <select
                  value={selectedGameType}
                  onChange={(e) => setSelectedGameType(e.target.value)}
                  title="게임 유형 선택"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-sm text-white"
                >
                  <option value="escape">🔐 Escape</option>
                  <option value="exploration">🗺️ Explore</option>
                  <option value="narrative">📖 Story</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">🤖 AI Pipeline</span>
                <button
                  onClick={() => setUseAIPipeline(!useAIPipeline)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${useAIPipeline
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                    }`}
                >
                  {useAIPipeline ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* 상태 표시 */}
              {status && (
                <p className="text-xs text-cyan-400 animate-pulse">{status}</p>
              )}
              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
            </div>
          </div>

          {/* 중앙: 3D 미리보기 (확장) */}
          <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
              <PreviewCanvas
                nodes={previewNodes}
                isGenerating={loading}
                isEmpty={previewNodes.length === 0}
                prompt={prompt}
              />
              {/* Background Asset Preloader */}
              {previewNodes.length > 0 && <AssetPreloader nodes={previewNodes} />}
            </div>

            {/* 월드 입장 버튼 - Floating */}
            {previewNodes.length > 0 && !loading && (
              <button
                onClick={handleEnterWorld}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-2xl z-50 animate-bounce"
              >
                🌐 월드 입장 (즉시)
              </button>
            )}
          </div>
        </main>

        {/* 푸터 */}
        <footer className="px-6 py-3 border-t border-white/5 text-center">
          <p className="text-xs text-gray-500">
            Powered by Gemini 2.0 Flash, Tripo3D, Hyper3D & Blockade Labs
          </p>
        </footer>
      </div>
    </>
  );
}
