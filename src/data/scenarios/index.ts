/**
 * World Bible - 시나리오 레지스트리
 * 
 * 모든 사용 가능한 시나리오를 중앙에서 관리합니다.
 * 테마별 분류 및 검색 기능을 제공합니다.
 */

import { Scenario } from '@/types/schema';
import { HorrorDemo } from './horror_demo';
import { FantasyDemo } from './fantasy_demo';
import { CyberpunkDemo } from './cyberpunk_demo';
import { DebugRoom } from './debug_room';
import { HOUSE_SCENARIOS, SORTING_CEREMONY_SCENARIO } from '../legacy/hogwarts';

export const LEGACY_SCENARIOS = {
    ...HOUSE_SCENARIOS,
    SortingCeremony: SORTING_CEREMONY_SCENARIO
};

// 기본 데모 시나리오 (판타지 숲)
export const DEFAULT_SCENARIO = FantasyDemo;


export type ThemeType = 'Horror' | 'Fantasy' | 'Cyberpunk' | 'SF' | 'Mystery' | 'Debug';

export interface ScenarioEntry {
    scenario: Scenario;
    theme: ThemeType;
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedDuration: number; // 분 단위
    tags: string[];
}

/**
 * 모든 시나리오 레지스트리
 */
export const WORLD_BIBLE: Record<string, ScenarioEntry> = {
    // 호러 테마
    horror_demo: {
        scenario: HorrorDemo,
        theme: 'Horror',
        difficulty: 'medium',
        estimatedDuration: 15,
        tags: ['basement', 'curse', 'key', 'chest']
    },

    // 판타지 테마
    fantasy_demo: {
        scenario: FantasyDemo,
        theme: 'Fantasy',
        difficulty: 'easy',
        estimatedDuration: 20,
        tags: ['crystal', 'magic', 'cavern', 'tome']
    },

    // 사이버펑크 테마
    cyberpunk_demo: {
        scenario: CyberpunkDemo,
        theme: 'Cyberpunk',
        difficulty: 'hard',
        estimatedDuration: 25,
        tags: ['neon', 'hacking', 'data', 'alley']
    },

    // 디버그용
    debug_room: {
        scenario: DebugRoom,
        theme: 'Debug',
        difficulty: 'easy',
        estimatedDuration: 5,
        tags: ['test', 'debug', 'development']
    }
};

/**
 * 테마별 시나리오 필터링
 */
export function getScenariosByTheme(theme: ThemeType): ScenarioEntry[] {
    return Object.values(WORLD_BIBLE).filter(entry => entry.theme === theme);
}

/**
 * 난이도별 시나리오 필터링
 */
export function getScenariosByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ScenarioEntry[] {
    return Object.values(WORLD_BIBLE).filter(entry => entry.difficulty === difficulty);
}

/**
 * ID로 시나리오 검색
 */
export function getScenarioById(id: string): Scenario | null {
    const entry = WORLD_BIBLE[id];
    return entry ? entry.scenario : null;
}

/**
 * 태그로 시나리오 검색
 */
export function searchScenariosByTag(tag: string): ScenarioEntry[] {
    return Object.values(WORLD_BIBLE).filter(entry =>
        entry.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
}

/**
 * 모든 시나리오 목록 반환
 */
export function getAllScenarios(): Scenario[] {
    return Object.values(WORLD_BIBLE).map(entry => entry.scenario);
}

/**
 * 랜덤 시나리오 선택 (테마 필터 선택적)
 */
export function getRandomScenario(theme?: ThemeType): Scenario {
    const candidates = theme
        ? getScenariosByTheme(theme)
        : Object.values(WORLD_BIBLE);

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex].scenario;
}
