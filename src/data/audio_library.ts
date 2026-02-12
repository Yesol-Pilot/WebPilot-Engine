/**
 * audio_library.ts
 * 
 * BGM 리소스 레지스트리
 * CDN(수동 등록) + 로컬 파일(자동 레지스트리) 통합
 * 
 * 로컬 BGM은 _registry.json에서 자동 로드됨
 * → npm run build:registry 실행 시 자동 갱신
 */

// _registry.json 자동 로드 (build-asset-registry.ts가 생성)
let bgmRegistryEntries: Record<string, { url: string; mood: string; license: string }> = {};
try {
    // Next.js 빌드 시 JSON import 동적 처리
    const registry = require('../../public/sounds/bgm/_registry.json');
    if (registry?.entries) {
        for (const entry of registry.entries) {
            const data = {
                url: entry.url,
                mood: entry.mood || 'neutral',
                license: 'generated',
            };
            // 원본 ID 등록 (예: bgm_fantasy_epic)
            bgmRegistryEntries[entry.id] = data;

            // ResourceDecisionService 호환: local_ alias 자동 생성
            // bgm_fantasy_epic → local_fantasy_epic
            if (entry.id.startsWith('bgm_')) {
                const alias = 'local_' + entry.id.replace('bgm_', '');
                bgmRegistryEntries[alias] = data;
            }
        }
    }
} catch {
    // 레지스트리 파일 없으면 빈 객체 — CDN 엔트리만 사용
    console.warn('[audio_library] _registry.json 미발견 — CDN 엔트리만 사용');
}

// OpenGameArt CDN
const OGA_CDN = 'https://opengameart.org/sites/default/files';

export const BGM_LIBRARY: Record<string, { url: string; mood: string; license: string }> = {
    // Fantasy (12개)
    'tavern': { url: `${OGA_CDN}/Tavern%20Loop%20One.ogg`, mood: 'cozy', license: 'CC0' },
    'castle': { url: `${OGA_CDN}/castle.ogg`, mood: 'majestic', license: 'CC0' },
    'village': { url: `${OGA_CDN}/village.ogg`, mood: 'peaceful', license: 'CC0' },
    'medieval': { url: `${OGA_CDN}/medieval_loop.ogg`, mood: 'adventure', license: 'CC0' },
    'fantasy_forest': { url: `${OGA_CDN}/fantasy_forest.ogg`, mood: 'magical', license: 'CC0' },
    'throne_room': { url: `${OGA_CDN}/throne_room.ogg`, mood: 'royal', license: 'CC0' },
    'magic_shop': { url: `${OGA_CDN}/magic_shop.ogg`, mood: 'mystical', license: 'CC0' },
    'dragon_lair': { url: `${OGA_CDN}/dragon_lair.ogg`, mood: 'epic', license: 'CC0' },
    'elven_woods': { url: `${OGA_CDN}/elven_woods.ogg`, mood: 'ethereal', license: 'CC0' },
    'dwarf_mine': { url: `${OGA_CDN}/dwarf_mine.ogg`, mood: 'industrial', license: 'CC0' },
    'wizard_tower': { url: `${OGA_CDN}/wizard_tower.ogg`, mood: 'arcane', license: 'CC0' },
    'fairy_garden': { url: `${OGA_CDN}/fairy_garden.ogg`, mood: 'whimsical', license: 'CC0' },

    // Horror (8개)
    'dungeon': { url: `${OGA_CDN}/dark_dungeon.ogg`, mood: 'dark', license: 'CC0' },
    'haunted': { url: `${OGA_CDN}/haunted_house.ogg`, mood: 'creepy', license: 'CC0' },
    'cemetery': { url: `${OGA_CDN}/cemetery_night.ogg`, mood: 'eerie', license: 'CC0' },
    'abandoned': { url: `${OGA_CDN}/abandoned_place.ogg`, mood: 'desolate', license: 'CC0' },
    'tension': { url: `${OGA_CDN}/tension_loop.ogg`, mood: 'suspense', license: 'CC0' },
    'nightmare': { url: `${OGA_CDN}/nightmare.ogg`, mood: 'disturbing', license: 'CC0' },
    'crypt': { url: `${OGA_CDN}/crypt_ambience.ogg`, mood: 'ominous', license: 'CC0' },
    'asylum': { url: `${OGA_CDN}/asylum.ogg`, mood: 'unsettling', license: 'CC0' },

    // Sci-Fi (8개)
    'cyberpunk': { url: `${OGA_CDN}/cyberpunk_city.ogg`, mood: 'neon', license: 'CC0' },
    'space_station': { url: `${OGA_CDN}/space_station.ogg`, mood: 'ambient', license: 'CC0' },
    'spaceship': { url: `${OGA_CDN}/spaceship_interior.ogg`, mood: 'hum', license: 'CC0' },
    'alien_world': { url: `${OGA_CDN}/alien_world.ogg`, mood: 'strange', license: 'CC0' },
    'tech_lab': { url: `${OGA_CDN}/tech_lab.ogg`, mood: 'electronic', license: 'CC0' },
    'dystopia': { url: `${OGA_CDN}/dystopia.ogg`, mood: 'bleak', license: 'CC0' },
    'android': { url: `${OGA_CDN}/android_theme.ogg`, mood: 'synthetic', license: 'CC0' },
    'hacker': { url: `${OGA_CDN}/hacker_den.ogg`, mood: 'digital', license: 'CC0' },

    // Ambient (10개)
    'forest': { url: `${OGA_CDN}/forest_ambience.ogg`, mood: 'peaceful', license: 'CC0' },
    'ocean': { url: `${OGA_CDN}/ocean_waves.ogg`, mood: 'calm', license: 'CC0' },
    'rain': { url: `${OGA_CDN}/rain_loop.ogg`, mood: 'melancholy', license: 'CC0' },
    'wind': { url: `${OGA_CDN}/wind_ambience.ogg`, mood: 'lonely', license: 'CC0' },
    'river': { url: `${OGA_CDN}/river_stream.ogg`, mood: 'tranquil', license: 'CC0' },
    'campfire': { url: `${OGA_CDN}/campfire.ogg`, mood: 'warm', license: 'CC0' },
    'birds': { url: `${OGA_CDN}/birds_morning.ogg`, mood: 'cheerful', license: 'CC0' },
    'night': { url: `${OGA_CDN}/night_ambience.ogg`, mood: 'quiet', license: 'CC0' },
    'cave': { url: `${OGA_CDN}/cave_drips.ogg`, mood: 'echo', license: 'CC0' },
    'thunderstorm': { url: `${OGA_CDN}/thunderstorm.ogg`, mood: 'intense', license: 'CC0' },

    // Action (7개)
    'battle': { url: `${OGA_CDN}/battle_theme.ogg`, mood: 'intense', license: 'CC0' },
    'boss_fight': { url: `${OGA_CDN}/boss_battle.ogg`, mood: 'epic', license: 'CC0' },
    'chase': { url: `${OGA_CDN}/chase_music.ogg`, mood: 'urgent', license: 'CC0' },
    'victory': { url: `${OGA_CDN}/victory_fanfare.ogg`, mood: 'triumphant', license: 'CC0' },
    'defeat': { url: `${OGA_CDN}/game_over.ogg`, mood: 'somber', license: 'CC0' },
    'tension_battle': { url: `${OGA_CDN}/battle_tension.ogg`, mood: 'nervous', license: 'CC0' },
    'war': { url: `${OGA_CDN}/war_drums.ogg`, mood: 'martial', license: 'CC0' },

    // Mystery (5개)
    'mystery': { url: `${OGA_CDN}/mystery_theme.ogg`, mood: 'curious', license: 'CC0' },
    'puzzle': { url: `${OGA_CDN}/puzzle_room.ogg`, mood: 'thinking', license: 'CC0' },
    'investigation': { url: `${OGA_CDN}/investigation.ogg`, mood: 'detective', license: 'CC0' },
    'discovery': { url: `${OGA_CDN}/discovery.ogg`, mood: 'wonder', license: 'CC0' },
    'stealth': { url: `${OGA_CDN}/stealth_theme.ogg`, mood: 'sneaky', license: 'CC0' },

    // ===== LOCAL BGM (자동 로드: _registry.json → build-asset-registry.ts 생성) =====
    // npm run build:registry 실행 시 자동 갱신
    ...bgmRegistryEntries,
};

export function findBGMByKeyword(keyword: string): string | null {
    const lower = keyword.toLowerCase();
    if (BGM_LIBRARY[lower]) return BGM_LIBRARY[lower].url;
    for (const [key, bgm] of Object.entries(BGM_LIBRARY)) {
        if (lower.includes(key) || key.includes(lower)) return bgm.url;
    }
    return null;
}

export const BGM_COUNT = Object.keys(BGM_LIBRARY).length;
export default BGM_LIBRARY;
