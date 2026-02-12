'use client';

/**
 * SequencerTimeline.tsx
 * 
 * 카메라 시퀀스 타임라인 UI 컴포넌트
 */

import { useState, useEffect, useCallback } from 'react';
import {
    cameraSequencer,
    CameraSequence,
    CameraKeyframe,
    PlaybackState,
    PRESET_SEQUENCES
} from '@/services/CameraSequencer';

interface SequencerTimelineProps {
    /** 초기 시퀀스 */
    initialSequence?: CameraSequence;
    /** 컴팩트 모드 */
    compact?: boolean;
}

export default function SequencerTimeline({
    initialSequence,
    compact = false
}: SequencerTimelineProps) {
    const [state, setState] = useState<PlaybackState>('idle');
    const [currentTime, setCurrentTime] = useState(0);
    const [currentKeyframe, setCurrentKeyframe] = useState<CameraKeyframe | null>(null);
    const [sequence, setSequence] = useState<CameraSequence | null>(initialSequence || null);
    const [showPresets, setShowPresets] = useState(false);

    // 콜백 설정
    useEffect(() => {
        cameraSequencer.setCallbacks({
            onPlay: () => setState('playing'),
            onPause: () => setState('paused'),
            onStop: () => {
                setState('idle');
                setCurrentTime(0);
            },
            onKeyframeChange: (kf) => setCurrentKeyframe(kf),
            onTimeUpdate: (time) => setCurrentTime(time),
            onComplete: () => setState('idle'),
        });

        if (initialSequence) {
            cameraSequencer.loadSequence(initialSequence);
        }

        return () => {
            cameraSequencer.dispose();
        };
    }, [initialSequence]);

    // 프리셋 로드
    const loadPreset = useCallback((presetId: string) => {
        const preset = PRESET_SEQUENCES[presetId];
        if (preset) {
            cameraSequencer.loadSequence(preset);
            setSequence(preset);
            setShowPresets(false);
            console.log(`[Timeline] 프리셋 로드: ${preset.name}`);
        }
    }, []);

    // 타임라인 클릭으로 시간 이동
    const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!sequence) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        const targetTime = percent * sequence.totalDuration;
        cameraSequencer.seek(targetTime);
    }, [sequence]);

    const progressPercent = sequence ? (currentTime / sequence.totalDuration) * 100 : 0;

    return (
        <div className={`sequencer-timeline ${compact ? 'compact' : ''}`}>
            {/* 헤더 */}
            <div className="timeline-header">
                <span className="timeline-title">
                    🎬 {sequence?.name || '시퀀스 미선택'}
                </span>
                <span className="timeline-time">
                    {currentTime.toFixed(1)}s / {sequence?.totalDuration || 0}s
                </span>
            </div>

            {/* 타임라인 바 */}
            <div className="timeline-bar" onClick={handleTimelineClick}>
                {/* 키프레임 마커 */}
                {sequence?.keyframes.map((kf, i) => (
                    <div
                        key={i}
                        className={`keyframe-marker ${currentKeyframe === kf ? 'active' : ''}`}
                        style={{ left: `${(kf.time / sequence.totalDuration) * 100}%` }}
                        title={kf.label || kf.shotType}
                    />
                ))}
                {/* 진행 바 */}
                <div
                    className="progress-bar"
                    style={{ width: `${progressPercent}%` }}
                />
                {/* 플레이헤드 */}
                <div
                    className="playhead"
                    style={{ left: `${progressPercent}%` }}
                />
            </div>

            {/* 현재 키프레임 */}
            {currentKeyframe && (
                <div className="current-keyframe">
                    📍 {currentKeyframe.label || currentKeyframe.shotType}
                </div>
            )}

            {/* 컨트롤 */}
            <div className="timeline-controls">
                <button
                    onClick={() => cameraSequencer.stop()}
                    className="ctrl-btn"
                    title="정지"
                >
                    ⏹
                </button>
                <button
                    onClick={() => state === 'playing' ? cameraSequencer.pause() : cameraSequencer.play()}
                    className="ctrl-btn primary"
                    title={state === 'playing' ? '일시정지' : '재생'}
                >
                    {state === 'playing' ? '⏸' : '▶'}
                </button>
                <button
                    onClick={() => setShowPresets(!showPresets)}
                    className="ctrl-btn"
                    title="프리셋"
                >
                    📂
                </button>
            </div>

            {/* 프리셋 메뉴 */}
            {showPresets && (
                <div className="preset-menu">
                    {Object.entries(PRESET_SEQUENCES).map(([id, preset]) => (
                        <button
                            key={id}
                            onClick={() => loadPreset(id)}
                            className="preset-item"
                        >
                            {preset.name} ({preset.totalDuration}s)
                        </button>
                    ))}
                </div>
            )}

            <style jsx>{`
                .sequencer-timeline {
                    background: rgba(0, 0, 0, 0.8);
                    border: 1px solid rgba(0, 200, 255, 0.3);
                    border-radius: 8px;
                    padding: 12px;
                    font-family: 'Outfit', sans-serif;
                    color: #fff;
                    min-width: 300px;
                }
                .sequencer-timeline.compact {
                    padding: 8px;
                }
                .timeline-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                .timeline-title {
                    font-weight: 600;
                }
                .timeline-time {
                    color: rgba(0, 200, 255, 0.8);
                    font-family: monospace;
                }
                .timeline-bar {
                    position: relative;
                    height: 24px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                    cursor: pointer;
                    overflow: hidden;
                    margin-bottom: 8px;
                }
                .progress-bar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background: linear-gradient(90deg, rgba(0, 200, 255, 0.5), rgba(0, 200, 255, 0.3));
                    pointer-events: none;
                }
                .playhead {
                    position: absolute;
                    top: 0;
                    width: 2px;
                    height: 100%;
                    background: #00c8ff;
                    box-shadow: 0 0 8px rgba(0, 200, 255, 0.8);
                    pointer-events: none;
                }
                .keyframe-marker {
                    position: absolute;
                    top: 0;
                    width: 8px;
                    height: 100%;
                    background: rgba(255, 200, 0, 0.6);
                    border-radius: 2px;
                    transform: translateX(-50%);
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .keyframe-marker.active {
                    background: #ffc800;
                    box-shadow: 0 0 8px rgba(255, 200, 0, 0.8);
                }
                .current-keyframe {
                    font-size: 12px;
                    color: rgba(255, 200, 0, 0.9);
                    margin-bottom: 8px;
                }
                .timeline-controls {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                }
                .ctrl-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.2s;
                }
                .ctrl-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                .ctrl-btn.primary {
                    background: rgba(0, 200, 255, 0.3);
                    border-color: rgba(0, 200, 255, 0.5);
                }
                .ctrl-btn.primary:hover {
                    background: rgba(0, 200, 255, 0.5);
                }
                .preset-menu {
                    margin-top: 8px;
                    background: rgba(0, 0, 0, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    padding: 4px;
                }
                .preset-item {
                    display: block;
                    width: 100%;
                    background: transparent;
                    border: none;
                    color: #fff;
                    padding: 8px 12px;
                    text-align: left;
                    cursor: pointer;
                    font-size: 13px;
                }
                .preset-item:hover {
                    background: rgba(0, 200, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
