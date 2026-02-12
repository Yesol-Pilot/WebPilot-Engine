'use client';

/**
 * Sorting Ceremony 페이지
 * 
 * 3D 호그와트 대연회장 + AI 소팅햇 채팅 (Immersive 모드)
 */

import { useState, useEffect } from 'react';
import GameClient from '@/components/game/GameClient';
import { LEGACY_SCENARIOS } from '@/data/scenarios';
import SortingChat from '@/components/sorting/SortingChat';
import { HouseType } from '@/lib/sorting/SortingHatAI';
import { useGameStore } from '@/store/gameStore';

export default function SortingPage() {
    const [showChat, setShowChat] = useState(true);
    const [assignedHouse, setAssignedHouse] = useState<HouseType | null>(null);
    const [currentScenario, setCurrentScenario] = useState(LEGACY_SCENARIOS.SortingCeremony);
    const { setUIMode } = useGameStore();

    // Immersive 모드로 설정 (게임 UI 숨김)
    useEffect(() => {
        setUIMode('immersive');
        return () => setUIMode('game'); // 페이지 나갈 때 복원
    }, [setUIMode]);

    // 기숙사 배정 완료 핸들러
    const handleHouseAssigned = (house: HouseType, reason: string) => {
        setAssignedHouse(house);
        console.log(`[Sorting] 배정 완료: ${house} - ${reason}`);

        // 3초 후 해당 기숙사 휴게실로 전환
        setTimeout(() => {
            const houseKey = house.charAt(0).toUpperCase() + house.slice(1);
            const legacy = LEGACY_SCENARIOS as Record<string, typeof LEGACY_SCENARIOS.SortingCeremony>; // 타입 안전성 확보
            if (legacy[houseKey]) {
                setCurrentScenario(legacy[houseKey]);
            }
        }, 3000);
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            {/* 3D 씬 - Immersive 모드로 시작 */}
            <GameClient initialScenario={currentScenario} mode="immersive" />

            {/* 채팅 토글 버튼 (채팅이 닫혀있을 때) */}
            {!showChat && (
                <button
                    onClick={() => setShowChat(true)}
                    style={{
                        position: 'fixed',
                        right: '20px',
                        bottom: '20px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #740001, #ae0001)',
                        border: 'none',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                        cursor: 'pointer',
                        fontSize: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    🎩
                </button>
            )}

            {/* 소팅햇 채팅 */}
            {showChat && (
                <SortingChat
                    onHouseAssigned={handleHouseAssigned}
                    onClose={() => setShowChat(false)}
                />
            )}

            {/* 현재 기숙사 표시 (배정 후) */}
            {assignedHouse && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '12px 24px',
                    background: 'rgba(0,0,0,0.7)',
                    borderRadius: '8px',
                    color: 'white',
                    fontFamily: 'Georgia, serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '24px' }}>
                        {assignedHouse === 'gryffindor' && '🦁'}
                        {assignedHouse === 'slytherin' && '🐍'}
                        {assignedHouse === 'ravenclaw' && '🦅'}
                        {assignedHouse === 'hufflepuff' && '🦡'}
                    </span>
                    <span>
                        {assignedHouse === 'gryffindor' && '그리핀도르'}
                        {assignedHouse === 'slytherin' && '슬리데린'}
                        {assignedHouse === 'ravenclaw' && '래번클로'}
                        {assignedHouse === 'hufflepuff' && '후플푸프'}
                    </span>
                </div>
            )}
        </div>
    );
}
