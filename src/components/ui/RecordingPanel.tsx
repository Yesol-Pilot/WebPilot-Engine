'use client';

/**
 * RecordingPanel.tsx
 * 
 * 영상 녹화 UI 패널
 */

import { useState, useEffect, useCallback } from 'react';
import { videoRecorder, downloadRecording, RecordingResult, RecordingState } from '@/services/VideoRecorder';
import './recording-panel.css';

interface RecordingPanelProps {
    /** 컴팩트 모드 */
    compact?: boolean;
}

export default function RecordingPanel({ compact = false }: RecordingPanelProps) {
    const [state, setState] = useState<RecordingState>('idle');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [lastResult, setLastResult] = useState<RecordingResult | null>(null);

    // 시간 업데이트
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (state === 'recording') {
            interval = setInterval(() => {
                setElapsedTime(videoRecorder.getElapsedTime());
            }, 100);
        }
        return () => clearInterval(interval);
    }, [state]);

    // 캔버스 설정
    useEffect(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            videoRecorder.setCanvas(canvas);
        }
    }, []);

    // 녹화 시작
    const handleStart = useCallback(async () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            videoRecorder.setCanvas(canvas);
        }
        await videoRecorder.start();
        setState('recording');
        setElapsedTime(0);
    }, []);

    // 녹화 중지
    const handleStop = useCallback(async () => {
        const result = await videoRecorder.stop();
        setState('stopped');
        if (result) {
            setLastResult(result);
        }
    }, []);

    // 다운로드
    const handleDownload = useCallback(() => {
        if (lastResult) {
            downloadRecording(lastResult);
        }
    }, [lastResult]);

    // 새 녹화
    const handleReset = useCallback(() => {
        if (lastResult) {
            URL.revokeObjectURL(lastResult.url);
        }
        setLastResult(null);
        setState('idle');
        setElapsedTime(0);
    }, [lastResult]);

    // 시간 포맷
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`recording-panel ${compact ? 'compact' : ''}`}>
            <div className="panel-header">
                <span className="rec-icon">🎬</span>
                <span className="panel-title">영상 녹화</span>
            </div>

            {/* 상태 표시 */}
            <div className="status-row">
                <div className={`status-indicator ${state}`}>
                    {state === 'recording' && '● REC'}
                    {state === 'idle' && '○ 대기'}
                    {state === 'stopped' && '✓ 완료'}
                </div>
                <div className="elapsed-time">
                    {formatTime(elapsedTime)}
                </div>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="control-buttons">
                {state === 'idle' && (
                    <button onClick={handleStart} className="btn-record">
                        ⏺ 녹화 시작
                    </button>
                )}
                {state === 'recording' && (
                    <button onClick={handleStop} className="btn-stop">
                        ⏹ 녹화 중지
                    </button>
                )}
                {state === 'stopped' && lastResult && (
                    <>
                        <button onClick={handleDownload} className="btn-download">
                            ⬇ 다운로드
                        </button>
                        <button onClick={handleReset} className="btn-new">
                            🔄 새 녹화
                        </button>
                    </>
                )}
            </div>

            {/* 결과 정보 */}
            {lastResult && state === 'stopped' && (
                <div className="result-info">
                    <div>길이: {lastResult.duration.toFixed(1)}초</div>
                    <div>크기: {(lastResult.blob.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
            )}
        </div>
    );
}
