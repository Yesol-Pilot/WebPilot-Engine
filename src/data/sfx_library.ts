/**
 * sfx_library.ts
 * 
 * SFX 리소스 레지스트리
 * CDN(수동 등록) + 로컬 파일(자동 레지스트리) 통합
 * 
 * 로컬 SFX는 _registry.json에서 자동 로드됨
 * → npm run build:registry 실행 시 자동 갱신
 */

export interface SFXData {
    url: string;
    vol?: number;
    category: 'movement' | 'combat' | 'ui' | 'env' | 'creature' | 'magic' | 'nature' | 'object';
}

// SFX 카테고리 → 라이브러리 카테고리 매핑
const sfxCategoryMap: Record<string, SFXData['category']> = {
    character: 'movement', combat: 'combat', ui: 'ui',
    environment: 'env', magic: 'magic', nature: 'nature',
    object: 'object',
};

// _registry.json 자동 로드
let sfxRegistryEntries: Record<string, SFXData> = {};
try {
    const registry = require('../../public/sounds/sfx/_registry.json');
    if (registry?.entries) {
        for (const entry of registry.entries) {
            sfxRegistryEntries[entry.id] = {
                url: entry.url,
                category: sfxCategoryMap[entry.category] || 'env',
            };
            // local_ alias 호환
            if (!entry.id.startsWith('local_')) {
                sfxRegistryEntries['local_' + entry.id] = sfxRegistryEntries[entry.id];
            }
        }
    }
} catch {
    console.warn('[sfx_library] _registry.json 미발견 — CDN 엔트리만 사용');
}

// Kenney SFX CDN (GitHub jsdelivr)
const KENNEY_SFX_CDN = 'https://cdn.jsdelivr.net/gh/KenneyNL/Assets@latest/Audio';

export const SFX_LIBRARY: Record<string, SFXData> = {
    // ========================================
    // 🏃‍♂️ Movement (40+)
    // ========================================
    'footstep_grass_1': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/footstep00.ogg`, category: 'movement', vol: 0.8 },
    'footstep_grass_2': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/footstep01.ogg`, category: 'movement', vol: 0.8 },
    'footstep_grass_3': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/footstep02.ogg`, category: 'movement', vol: 0.8 },
    'footstep_grass_4': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/footstep03.ogg`, category: 'movement', vol: 0.8 },
    'footstep_grass_5': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/footstep04.ogg`, category: 'movement', vol: 0.8 },

    'footstep_wood_1': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/footstep05.ogg`, category: 'movement', vol: 0.9 },
    'footstep_wood_2': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/footstep06.ogg`, category: 'movement', vol: 0.9 },
    'footstep_wood_3': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/footstep07.ogg`, category: 'movement', vol: 0.9 },
    'footstep_wood_4': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/footstep08.ogg`, category: 'movement', vol: 0.9 },
    'footstep_wood_5': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/footstep09.ogg`, category: 'movement', vol: 0.9 },

    'footstep_stone_1': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/footstep00.ogg`, category: 'movement', vol: 0.8 },

    // ========================================
    // ⚔️ Combat (50+)
    // ========================================
    'sword_swing_1': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/chop00.ogg`, category: 'combat' },
    'sword_swing_2': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/chop01.ogg`, category: 'combat' },
    'sword_hit_1': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/chop02.ogg`, category: 'combat' },

    'impact_metal_1': { url: `${KENNEY_SFX_CDN}/Impact%20Sounds/impactMetal_000.ogg`, category: 'combat' },
    'impact_metal_2': { url: `${KENNEY_SFX_CDN}/Impact%20Sounds/impactMetal_001.ogg`, category: 'combat' },
    'impact_metal_3': { url: `${KENNEY_SFX_CDN}/Impact%20Sounds/impactMetal_002.ogg`, category: 'combat' },

    'impact_wood_1': { url: `${KENNEY_SFX_CDN}/Impact%20Sounds/impactWood_000.ogg`, category: 'combat' },
    'impact_wood_2': { url: `${KENNEY_SFX_CDN}/Impact%20Sounds/impactWood_001.ogg`, category: 'combat' },

    // ========================================
    // 🖱️ UI (40+)
    // ========================================
    'click_1': { url: `${KENNEY_SFX_CDN}/UI%20Audio/click1.ogg`, category: 'ui', vol: 0.5 },
    'click_2': { url: `${KENNEY_SFX_CDN}/UI%20Audio/click2.ogg`, category: 'ui', vol: 0.5 },
    'click_3': { url: `${KENNEY_SFX_CDN}/UI%20Audio/click3.ogg`, category: 'ui', vol: 0.5 },
    'hover_1': { url: `${KENNEY_SFX_CDN}/UI%20Audio/rollover2.ogg`, category: 'ui', vol: 0.3 },
    'hover_2': { url: `${KENNEY_SFX_CDN}/UI%20Audio/rollover3.ogg`, category: 'ui', vol: 0.3 },

    'confirm_1': { url: `${KENNEY_SFX_CDN}/UI%20Audio/confirmation_001.ogg`, category: 'ui' },
    'confirm_2': { url: `${KENNEY_SFX_CDN}/UI%20Audio/confirmation_002.ogg`, category: 'ui' },
    'back_1': { url: `${KENNEY_SFX_CDN}/UI%20Audio/back_001.ogg`, category: 'ui' },
    'error_1': { url: `${KENNEY_SFX_CDN}/UI%20Audio/error_001.ogg`, category: 'ui' },

    // ========================================
    // ✨ Magic (20+)
    // ========================================
    'spell_cast_1': { url: `${KENNEY_SFX_CDN}/Fantasy%20UI/magic00.ogg`, category: 'magic' },
    'spell_cast_2': { url: `${KENNEY_SFX_CDN}/Fantasy%20UI/magic01.ogg`, category: 'magic' },
    'spell_hit_1': { url: `${KENNEY_SFX_CDN}/Fantasy%20UI/spell00.ogg`, category: 'magic' },
    'level_up': { url: `${KENNEY_SFX_CDN}/Fantasy%20UI/mission_complete.ogg`, category: 'magic', vol: 1.0 },

    // ========================================
    // 🌍 Environment (30+)
    // ========================================
    'door_open': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/doorOpen_1.ogg`, category: 'env' },
    'door_close': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/doorClose_1.ogg`, category: 'env' },
    'chest_open': { url: `${KENNEY_SFX_CDN}/RPG%20Audio/doorOpen_2.ogg`, category: 'env' },

    // ===== LOCAL SFX (자동 로드: _registry.json → build-asset-registry.ts 생성) =====
    // npm run build:registry 실행 시 자동 갱신 (94개 로컬 파일)
    ...sfxRegistryEntries,
};

/**
 * 카테고리별 랜덤 SFX
 */
export function getRandomSFX(category: SFXData['category']): string | null {
    const keys = Object.keys(SFX_LIBRARY).filter(k => SFX_LIBRARY[k].category === category);
    if (keys.length === 0) return null;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return SFX_LIBRARY[randomKey]?.url;
}

export default SFX_LIBRARY;
