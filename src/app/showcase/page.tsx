'use client';

import React, { useState, useEffect } from 'react';

// 서비스 정보
const SERVICES = [
    {
        id: 'tiles',
        name: '3D Tiles Renderer',
        category: '렌더링',
        description: 'OGC 3D Tiles 표준 지원. 대규모 지형 LOD 렌더링.',
        file: 'TilesViewer.tsx',
        status: 'ready',
    },
    {
        id: '3dgs',
        name: '3D Gaussian Splatting',
        category: '렌더링',
        description: '실사급 3D 씬 렌더링. GPU 가속 정렬.',
        file: 'GaussianSplatViewer.tsx',
        status: 'ready',
    },
    {
        id: 'lora',
        name: 'LoRA 파이프라인',
        category: 'AI',
        description: 'NPC 개인화 LoRA 학습 및 추론.',
        file: 'PersonaLoRAService.ts',
        status: 'ready',
    },
    {
        id: 'judge',
        name: 'LLM-as-a-Judge',
        category: 'AI',
        description: 'AI 출력물 자동 품질 평가.',
        file: 'LLMJudgeService.ts',
        status: 'ready',
    },
    {
        id: 'multiplayer',
        name: 'Yjs CRDT 동기화',
        category: '멀티플레이어',
        description: '실시간 상태 동기화. 오프라인 지원.',
        file: 'MultiplayerSyncService.ts',
        status: 'ready',
    },
    {
        id: 'voronoi',
        name: 'Voronoi 파티션',
        category: '멀티플레이어',
        description: '심리스 월드 분할. 동적 로드밸런싱.',
        file: 'VoronoiPartitionService.ts',
        status: 'ready',
    },
    {
        id: 'tba',
        name: 'ERC-6551 TBA',
        category: '블록체인',
        description: 'NFT 연결 스마트 계정.',
        file: 'TokenBoundAccountService.ts',
        status: 'ready',
    },
    {
        id: 'story',
        name: 'Story Protocol',
        category: '블록체인',
        description: 'IP 라이선싱 및 로열티 분배.',
        file: 'StoryProtocolService.ts',
        status: 'ready',
    },
    {
        id: 'economy',
        name: 'AI 경제 시뮬레이터',
        category: '시뮬레이션',
        description: '자율 AI 에이전트 경제 시스템.',
        file: 'AgentEconomySimulator.ts',
        status: 'ready',
    },
    {
        id: 'mr',
        name: 'MR 플랫폼',
        category: 'XR',
        description: 'WebXR 기반 MR 라이프스타일.',
        file: 'MRLifestylePlatform.ts',
        status: 'ready',
    },
];

// 카테고리 색상
const CATEGORY_COLORS: Record<string, string> = {
    '렌더링': '#10b981',
    'AI': '#8b5cf6',
    '멀티플레이어': '#3b82f6',
    '블록체인': '#f59e0b',
    '시뮬레이션': '#ec4899',
    'XR': '#06b6d4',
};

export default function ShowcasePage() {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [economyStats, setEconomyStats] = useState({
        agents: 50,
        totalWealth: 25000,
        gini: 0.35,
        tick: 0,
    });

    // 경제 시뮬레이션 Mock 애니메이션
    useEffect(() => {
        const interval = setInterval(() => {
            setEconomyStats(prev => ({
                agents: prev.agents,
                totalWealth: prev.totalWealth + Math.floor(Math.random() * 100 - 30),
                gini: Math.max(0.1, Math.min(0.9, prev.gini + (Math.random() - 0.5) * 0.02)),
                tick: prev.tick + 1,
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            color: 'white',
            padding: '2rem',
        }}>
            {/* 헤더 */}
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem',
                }}>
                    WebPilot Engine
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.25rem' }}>
                    AI 기반 3D 웹 씬 생성 엔진
                </p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    marginTop: '1.5rem',
                    flexWrap: 'wrap',
                }}>
                    <Stat label="서비스" value="10" />
                    <Stat label="코드 라인" value="4,400+" />
                    <Stat label="파일" value="34" />
                </div>
            </header>

            {/* 서비스 그리드 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem',
                maxWidth: '1400px',
                margin: '0 auto',
            }}>
                {SERVICES.map(service => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        isSelected={selectedService === service.id}
                        onClick={() => setSelectedService(
                            selectedService === service.id ? null : service.id
                        )}
                    />
                ))}
            </div>

            {/* 실시간 경제 시뮬레이션 위젯 */}
            <div style={{
                marginTop: '3rem',
                maxWidth: '600px',
                margin: '3rem auto 0',
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '1rem',
                border: '1px solid rgba(255,255,255,0.1)',
            }}>
                <h3 style={{
                    fontSize: '1.25rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        background: '#10b981',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite',
                    }} />
                    실시간 AI 경제 시뮬레이션
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <MiniStat label="에이전트" value={economyStats.agents.toString()} />
                    <MiniStat label="총 자산" value={`${economyStats.totalWealth.toLocaleString()} G`} />
                    <MiniStat label="Gini 계수" value={economyStats.gini.toFixed(2)} />
                    <MiniStat label="Tick" value={economyStats.tick.toString()} />
                </div>
            </div>

            {/* 푸터 */}
            <footer style={{
                textAlign: 'center',
                marginTop: '4rem',
                color: '#64748b',
                fontSize: '0.875rem',
            }}>
                <p>Built with Next.js + React Three Fiber + WebGPU</p>
                <p style={{ marginTop: '0.5rem' }}>
                    © 2026 WebPilot Engine | Phase 4 Complete
                </p>
            </footer>
        </div>
    );
}

// 통계 컴포넌트
function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>{value}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{label}</div>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{label}</div>
        </div>
    );
}

// 서비스 카드 컴포넌트
function ServiceCard({
    service,
    isSelected,
    onClick
}: {
    service: typeof SERVICES[0];
    isSelected: boolean;
    onClick: () => void;
}) {
    const categoryColor = CATEGORY_COLORS[service.category] || '#64748b';

    return (
        <div
            onClick={onClick}
            style={{
                padding: '1.5rem',
                background: isSelected
                    ? 'rgba(99, 102, 241, 0.2)'
                    : 'rgba(255,255,255,0.05)',
                borderRadius: '1rem',
                border: isSelected
                    ? '2px solid #6366f1'
                    : '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            }}
        >
            {/* 카테고리 뱃지 */}
            <div style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                background: `${categoryColor}20`,
                color: categoryColor,
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
            }}>
                {service.category}
            </div>

            {/* 서비스 이름 */}
            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
            }}>
                {service.name}
            </h3>

            {/* 설명 */}
            <p style={{
                color: '#94a3b8',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                lineHeight: '1.5',
            }}>
                {service.description}
            </p>

            {/* 파일명 */}
            <code style={{
                display: 'block',
                padding: '0.5rem',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                color: '#94a3b8',
            }}>
                {service.file}
            </code>
        </div>
    );
}
