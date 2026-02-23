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
// Fallback Audio CDN (Phaser Examples & Google Actions) due to KenneyNL availability issues
const PHASER_SFX_CDN = 'https://cdn.jsdelivr.net/gh/photonstorm/phaser-examples@master/examples/assets/audio/SoundEffects';
const GOOGLE_SFX_CDN = 'https://actions.google.com/sounds/v1/cartoon';
const KENNEY_SFX_CDN = PHASER_SFX_CDN; // Backwards compatibility for variable name

export const SFX_LIBRARY: Record<string, SFXData> = {
    // ========================================
    // 🏃‍♂️ Movement (40+)
    // ========================================
    'footstep_grass_1': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'movement', vol: 0.5 },
    'footstep_grass_2': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'movement', vol: 0.5 },
    'footstep_grass_3': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'movement', vol: 0.5 },
    'footstep_grass_4': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'movement', vol: 0.5 },
    'footstep_grass_5': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'movement', vol: 0.5 },

    'footstep_wood_1': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'movement', vol: 0.5 },
    'footstep_wood_2': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'movement', vol: 0.5 },
    'footstep_wood_3': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'movement', vol: 0.5 },
    'footstep_wood_4': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'movement', vol: 0.5 },
    'footstep_wood_5': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'movement', vol: 0.5 },

    'footstep_stone_1': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'movement', vol: 0.5 },

    // ========================================
    // ⚔️ Combat (50+)
    // ========================================
    'sword_swing_1': { url: `${PHASER_SFX_CDN}/alien_death1.wav`, category: 'combat' },
    'sword_swing_2': { url: `${PHASER_SFX_CDN}/alien_death1.wav`, category: 'combat' },
    'sword_hit_1': { url: `${PHASER_SFX_CDN}/boss_hit.wav`, category: 'combat' },

    'impact_metal_1': { url: `${PHASER_SFX_CDN}/boss_hit.wav`, category: 'combat' },
    'impact_metal_2': { url: `${PHASER_SFX_CDN}/boss_hit.wav`, category: 'combat' },
    'impact_metal_3': { url: `${PHASER_SFX_CDN}/boss_hit.wav`, category: 'combat' },

    'impact_wood_1': { url: `${PHASER_SFX_CDN}/boss_hit.wav`, category: 'combat' },
    'impact_wood_2': { url: `${PHASER_SFX_CDN}/boss_hit.wav`, category: 'combat' },

    // ========================================
    // 🖱️ UI (40+)
    // ========================================
    'click_1': { url: `${GOOGLE_SFX_CDN}/pop.ogg`, category: 'ui', vol: 0.5 },
    'click_2': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'ui', vol: 0.5 },
    'click_3': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'ui', vol: 0.5 },
    'hover_1': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'ui', vol: 0.3 },
    'hover_2': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'ui', vol: 0.3 },

    'confirm_1': { url: `${PHASER_SFX_CDN}/escape.wav`, category: 'ui' },
    'confirm_2': { url: `${PHASER_SFX_CDN}/escape.wav`, category: 'ui' },
    'back_1': { url: `${PHASER_SFX_CDN}/numkey.wav`, category: 'ui' },
    'error_1': { url: `${PHASER_SFX_CDN}/squit.mp3`, category: 'ui' },

    // ========================================
    // ✨ Magic (20+)
    // ========================================
    'spell_cast_1': { url: `${PHASER_SFX_CDN}/blaster.mp3`, category: 'magic' },
    'spell_cast_2': { url: `${PHASER_SFX_CDN}/blaster.mp3`, category: 'magic' },
    'spell_hit_1': { url: `${PHASER_SFX_CDN}/boss_hit.wav`, category: 'magic' },
    'level_up': { url: `${PHASER_SFX_CDN}/escape.wav`, category: 'magic', vol: 1.0 },

    // ========================================
    // 🌍 Environment (30+)
    // ========================================
    'door_open': { url: `${PHASER_SFX_CDN}/squit.mp3`, category: 'env' },
    'door_close': { url: `${PHASER_SFX_CDN}/squit.mp3`, category: 'env' },
    'chest_open': { url: `${PHASER_SFX_CDN}/squit.mp3`, category: 'env' },

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
