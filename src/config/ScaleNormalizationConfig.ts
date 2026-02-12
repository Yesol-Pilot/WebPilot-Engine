/**
 * Config: ScaleNormalizationConfig.ts
 * 
 * [Phase 2.5] Universal Scale System
 * 카테고리별 목표 렌더링 스케일 (Unit Normalized 기준)
 * 
 * 모든 GLB는 로드 시 1m 크기로 정규화되며, 그 후 이 설정값에 따라 최종 크기가 결정됩니다.
 */

export const CATEGORY_SCALE_TABLE: Record<string, number> = {
    // ----------------------------------------------------
    // [Environment] 씬의 배경 및 구조물
    // ----------------------------------------------------
    'buildings': 6.0,      // 건물 (성, 탑) - 뷰포트 고려
    'environment': 8.0,    // 대형 환경 (동굴, 던전 내부)
    'environment_container': 45.0, // [P0] 대규모 환경 컨테이너 (대강당, 성 내부) - 카메라 maxDistance 대비 45%
    'structures': 5.0,     // 구조물 (다리, 문)

    // ----------------------------------------------------
    // [Living] 생명체
    // ----------------------------------------------------
    'characters': 1.8,     // 인간 표준 키 (1.8m)
    'creatures': 1.5,      // 몬스터/동물 평균
    'boss': 4.0,           // 보스급 몬스터

    // ----------------------------------------------------
    // [Furniture] 가구 및 인테리어
    // ----------------------------------------------------
    'furniture': 0.9,      // 책상, 의자, 침대
    'storage': 1.2,        // 책장, 옷장
    'decor': 0.6,          // 장식품, 화분

    // ----------------------------------------------------
    // [Props] 소품 및 아이템
    // ----------------------------------------------------
    'props': 0.4,          // 일반 소품
    'items': 0.3,          // 손에 쥐는 아이템
    'lighting': 0.25,      // 촛불, 램프 (작게 유지)
    'food': 0.15,          // 음식류

    // ----------------------------------------------------
    // [Nature] 자연물
    // ----------------------------------------------------
    'nature': 3.0,         // 나무
    'rocks': 1.0,          // 바위
    'vegetation': 0.5,     // 풀, 꽃

    // ----------------------------------------------------
    // Default
    // ----------------------------------------------------
    'default': 1.0,        // 알 수 없음
};

/**
 * 키워드 기반 카테고리 추론 헬퍼
 * (Asset Index에 카테고리가 없을 경우를 위한 Fallback)
 */
export const KEYWORD_CATEGORY_MAP: Record<string, string[]> = {
    'buildings': ['castle', 'tower', 'house', 'building', 'palace', 'temple'],
    'environment_container': ['grand_hall', 'great_hall', 'hogwarts', 'throne_room', 'cathedral', 'ballroom', 'arena', 'colosseum', 'gryffindor', 'slytherin', 'hufflepuff', 'ravenclaw', 'common_room', 'dorm_room', 'dormitory'],
    'environment': ['dungeon', 'cave', 'terrain', 'ground', 'floor', 'sky'],
    'characters': ['man', 'woman', 'hero', 'villain', 'npc'],
    'creatures': ['monster', 'beast', 'dragon', 'animal', 'wolf'],
    'furniture': ['table', 'chair', 'desk', 'bed', 'sofa', 'shelf', 'bookcase'],
    'lighting': ['lamp', 'candle', 'light', 'torch', 'lantern'],
    'nature': ['tree', 'bush', 'flower', 'grass', 'plant'],
};

/**
 * [P0] mm 단위 모델 감지 임계값
 * 
 * 원본 크기가 이 값을 초과하면 mm 단위로 모델링된 것으로 판단하고
 * 사전 스케일링(0.001x)을 적용합니다.
 */
export const MM_UNIT_DETECTION_THRESHOLD = 1000; // 1km 이상이면 mm 단위로 간주
export const MM_TO_METER_SCALE = 0.001; // mm → m 변환 계수

/**
 * 폴더 경로 기반 카테고리 추론 테이블
 * (inferCategory 함수에서 사용)
 */
export const FOLDER_CATEGORY_MAP: Record<string, string[]> = {
    environment_container: ['/hogwarts/', '/grand_hall/', '/great_hall/', '/throne/'],
    buildings: ['/buildings/', '/architecture/', '/structures/'],
    furniture: ['/furniture/', '/interiors/'],
    characters: ['/characters/', '/people/', '/humans/'],
    creatures: ['/creatures/', '/animals/', '/monsters/'],
    props: ['/props/', '/objects/', '/items/'],
    nature: ['/nature/', '/plants/', '/trees/', '/rocks/'],
    vehicles: ['/vehicles/', '/cars/', '/transportation/'],
};

/**
 * [Zero-Hardcode] 축 방향 추론 카테고리 테이블
 * detectDominantAxis 함수에서 사용
 */
export const VERTICAL_CATEGORIES = ['characters', 'creatures', 'nature', 'furniture'];
export const HORIZONTAL_CATEGORIES = ['vehicles', 'buildings'];
