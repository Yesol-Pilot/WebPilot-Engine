/**
 * TechStackSection.tsx
 * 
 * 기술 스택 소개 섹션
 * 사용된 주요 기술 로고 및 설명
 */

'use client';

interface TechItem {
    name: string;
    description: string;
    icon: string;
    color: string;
}

const techStack: TechItem[] = [
    {
        name: 'Gemini AI',
        description: '멀티모달 AI 분석',
        icon: '🧠',
        color: '#4285f4'
    },
    {
        name: 'Three.js',
        description: '3D 렌더링 엔진',
        icon: '🎮',
        color: '#000000'
    },
    {
        name: 'Next.js 16',
        description: 'React 프레임워크',
        icon: '⚡',
        color: '#000000'
    },
    {
        name: 'XState',
        description: '상태 머신',
        icon: '🔄',
        color: '#2c3e50'
    },
    {
        name: 'MCP Protocol',
        description: '에이전트 통신',
        icon: '🔗',
        color: '#8b5cf6'
    },
    {
        name: 'ElevenLabs',
        description: 'AI 음성 합성',
        icon: '🎤',
        color: '#00d4aa'
    }
];

export function TechStackSection() {
    return (
        <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-gray-950">
            <div className="max-w-6xl mx-auto">
                {/* 섹션 헤더 */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        기술 <span className="bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">스택</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        최첨단 기술로 구축된 안정적이고 확장 가능한 엔진
                    </p>
                </div>

                {/* 기술 그리드 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {techStack.map((tech, index) => (
                        <div
                            key={tech.name}
                            className="group p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 
                                     hover:bg-white/10 transition-all duration-300 text-center hover:scale-105"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* 아이콘 */}
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                                {tech.icon}
                            </div>

                            {/* 이름 */}
                            <h4 className="font-bold text-white text-sm mb-1">
                                {tech.name}
                            </h4>

                            {/* 설명 */}
                            <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                                {tech.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 추가 정보 */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500 text-sm">
                        + Rapier Physics, Prisma, Neo4j, SSE Streaming, A2A Protocol 등
                    </p>
                </div>
            </div>
        </section>
    );
}

export default TechStackSection;
