'use client';

import SceneCanvas from './SceneCanvas';
import { AtmosphereController } from './AtmosphereController';
import { InteractionProvider } from '@/components/interaction/InteractionManager';
import InteractionUI from '@/components/interaction/InteractionUI';
import LayoutResolver from './LayoutResolver';
import BrainSimulator from '../debug/BrainSimulator';
import ToonPostProcessing from './ToonPostProcessing';
import CameraDirector, { dispatchCameraCommand } from '../scene/CameraDirector';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game';
import { useUnifiedStore } from '@/store/unifiedStore';

// Phase 5: 영상형 웹툰 컴포넌트
import ComicEffects from '../ui/ComicEffects';
import { useProgress } from '@react-three/drei';
import { GameHUD } from '../ui/GameHUD';
import SpeechBubble from '../ui/SpeechBubble';
import RecordingPanel from '../ui/RecordingPanel';

// Phase 6: 오디오 반응 컴포넌트
import AudioReactiveController from '../scene/AudioReactiveController';
import NarrativeOverlay from '../ui/NarrativeOverlay';
import LoadingOverlay from '../ui/LoadingOverlay';
import ErrorOverlay from '../ui/ErrorOverlay';
import ToastNotification from '../ui/ToastNotification';

export default function Experience() {
    const pollMcpCommands = useGameStore((state) => state.pollMcpCommands);
    const [showRecordingPanel, setShowRecordingPanel] = useState(false);
    const { active, progress } = useProgress();

    // [FIX] 로딩 타임아웃 메커니즘 - 100%에서 멈추는 문제 해결
    const [forceLoadingComplete, setForceLoadingComplete] = useState(false);

    // 로딩이 100%에 도달하고 10초가 지나면 강제 완료 처리
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (active && progress >= 100) {
            timer = setTimeout(() => {
                console.warn('[Experience] ⚠️ 로딩 타임아웃 (10초): 강제 완료 처리');
                setForceLoadingComplete(true);
            }, 10000); // 10초 타임아웃
        } else if (!active) {
            // 정상 완료 시 상태 리셋
            setForceLoadingComplete(false);
        }

        return () => clearTimeout(timer);
    }, [active, progress]);

    // State
    const [cameraMode, setCameraMode] = useState<'follow' | 'free'>('follow');
    const [showIntro, setShowIntro] = useState(false); // [NEW] 내러티브 인트로 표시 여부

    // Global UI State
    const currentScenario = useGameStore((state) => state.currentScenario);
    const isLoading = useGameStore((state) => state.isLoading);
    const loadingMessage = useGameStore((state) => state.loadingMessage);
    const error = useGameStore((state) => state.error);
    const errorTitle = useGameStore((state) => state.errorTitle); // @ts-ignore
    const setError = useGameStore((state) => state.setError);
    const gameMode = useGameStore((state) => state.gameMode); // [NEW] Added for mode check

    // Poll MCP Commands (Legacy & Fallback) and Listen to SSE
    useEffect(() => {
        const store = useGameStore.getState();
        let aiSceneRestored = false; // [FIX] 복원 성공 플래그

        // [FIX] sessionStorage에서 AI 씬 복원 (페이지 리로드 생존)
        const savedScene = sessionStorage.getItem('webpilot_ai_scene');
        if (savedScene && !store.currentScenario) {
            try {
                const parsed = JSON.parse(savedScene);
                if (parsed.scenario?.nodes?.length > 0) {
                    const restoredMode = parsed.gameMode || 'custom';
                    console.log('[Experience] ✅ AI 씬 복원:', parsed.scenario.nodes.length, '개 노드, 모드:', restoredMode);
                    store.loadScenario(parsed.scenario);
                    store.setGameMode(restoredMode);
                    store.setLoading(false);

                    // 통합 스토어에도 동기화
                    const unified = useUnifiedStore.getState();
                    unified.loadScenario(parsed.scenario);
                    unified.setGameMode('custom');
                    if (parsed.aiScene?.objects) {
                        unified.setAIScene(parsed.aiScene.objects);
                    }

                    // [구조 개선] 환경 리소스 전체 복원
                    if (parsed.aiScene?.skyboxUrl) unified.setSkyboxUrl(parsed.aiScene.skyboxUrl);
                    if (parsed.aiScene?.bgmUrl) unified.setBgmUrl(parsed.aiScene.bgmUrl);
                    if (parsed.aiScene?.lighting) unified.setLighting(parsed.aiScene.lighting);
                    if (parsed.aiScene?.particles) unified.setParticles(parsed.aiScene.particles);
                    if (parsed.aiScene?.postProcessing) unified.setPostProcessing(parsed.aiScene.postProcessing);
                    console.log('[Experience] 🎨 환경 리소스 복원 완료 (skybox/BGM/lighting/particles/postFX)');

                    // 복원 완료 후 세션 데이터 클리어 (1회성)
                    sessionStorage.removeItem('webpilot_ai_scene');
                    aiSceneRestored = true; // [FIX] 복원 성공 → 기본 시나리오 건너뛰기
                }
            } catch (e) {
                console.warn('[Experience] sessionStorage 파싱 실패:', e);
                sessionStorage.removeItem('webpilot_ai_scene');
            }
        }

        // [Safety] AI 씬이 복원되지 않은 경우에만 기본 시나리오 로드
        // [FIX] store.gameMode 스냅샷 대신 플래그로 확인 (Zustand getState 스냅샷 이슈 회피)
        if (!aiSceneRestored && useGameStore.getState().gameMode === 'demo' && !useGameStore.getState().currentScenario) {
            console.log('[Experience] Demo Mode Detected: Loading Default Scenario');
            const { DEFAULT_SCENARIO } = require('@/data/scenarios');
            store.loadScenario(DEFAULT_SCENARIO);
            store.setLoading(false);
        }

        // [Narrative] 커스텀 모드 진입 시 인트로 표시 (데이터가 있을 경우)
        if (store.gameMode === 'custom' && store.currentScenario?.narrative?.intro) {
            setShowIntro(true);
        }

        pollMcpCommands();

        // SSE Connection (Real-time)
        const eventSource = new EventSource('/api/mcp/events');

        eventSource.onopen = () => {
            console.log('[SSE] Connected to MCP Stream');
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'connected') return;

                console.log('[SSE] Received Command:', data);

                // 카메라 명령 처리
                if (data.type === 'set_camera' && data.payload?.shot_type) {
                    dispatchCameraCommand(data.payload.shot_type, data.payload.target_id);
                    return;
                }

                useGameStore.getState().processCommand(data);

            } catch (e) {
                console.error('[SSE] Parse Error:', e);
            }
        };

        eventSource.onerror = (e) => {
            console.error('[SSE] Connection Error', e);
        };

        // 키보드 단축키
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                setShowRecordingPanel(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            eventSource.close();
            window.removeEventListener('keydown', handleKeyDown);
            console.log('[SSE] Disconnected');
        };
    }, [pollMcpCommands]);

    return (
        <div className="h-screen w-full relative bg-black">
            {/* 디버그/제어 패널 */}
            <BrainSimulator />

            {/* 녹화 패널 (Ctrl+R 토글) */}
            {showRecordingPanel && (
                <div className="absolute top-4 right-4 z-50">
                    <RecordingPanel compact />
                </div>
            )}

            {/* 3D 캔버스 - InteractionProvider로 감싸서 상호작용 시스템 활성화 */}
            <InteractionProvider>
                <SceneCanvas
                    objects={currentScenario?.nodes || []} // Pass nodes
                    skyboxUrl={currentScenario?.atmosphere || null}
                    architecture={currentScenario?.architecture || null} // Pass AI Architecture
                    cameraMode={cameraMode}
                >
                    <AtmosphereController />
                    <LayoutResolver />
                    <CameraDirector defaultShot="wide" transitionSpeed={2} />
                    <ToonPostProcessing autoTheme />
                </SceneCanvas>
                <InteractionUI />
            </InteractionProvider>

            {/* Phase 5: 만화 효과 오버레이 */}
            <GameHUD
                cameraMode={cameraMode}
                onToggleCamera={() => setCameraMode(prev => prev === 'follow' ? 'free' : 'follow')}
            />
            <ComicEffects />

            {/* Phase 5: 말풍선 오버레이 */}
            <SpeechBubble />

            {/* Phase 7: 내러티브 오버레이 (Intro/Ending) */}
            {/* @ts-ignore - 레거시 호환: NarrativeOverlay 내부에서 store 직접 참조 */}
            <NarrativeOverlay />

            {/* Global UI Overlays */}
            <LoadingOverlay
                visible={(isLoading || active) && !forceLoadingComplete}
                message={isLoading ? loadingMessage : `RES LOADING ${(progress || 0).toFixed(0)}%`}
                progress={progress}
            />
            <ErrorOverlay
                visible={!!error}
                title={errorTitle || '오류'}
                message={error || ''}
                onClose={() => setError(null)}
                onRetry={() => { setError(null); window.location.reload(); }}
            />
            <ToastNotification />

            {/* Phase 6: 오디오 반응 컨트롤러 (렌더링 없음) */}
            <AudioReactiveController
                enabled={true}
                settings={{
                    lightReactive: true,
                    cameraReactive: true,
                    effectReactive: true,
                    beatThreshold: 0.7
                }}
            />
        </div>
    );
}

