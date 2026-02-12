/**
 * SpatialRelationshipInferenceEngine.ts
 * 
 * 뉴로-심볼릭 아키텍처: 공간 관계 추론 엔진
 * 
 * 프롬프트에서 공간적 관계를 추론하여
 * 오브젝트 간의 계층 구조와 배치 제약 조건을 생성합니다.
 * 
 * 설계 문서: neuro_symbolic_architecture_design.md
 */

import { SemanticRole } from '@/lib/schema/scene';

// ============================================================
// 공간 관계 타입 정의
// ============================================================

export interface SpatialRelationship {
    sourceId: string;           // 관계의 주체 (예: "촛불")
    targetId: string;           // 관계의 대상 (예: "대강당")
    type: 'inside' | 'on_top_of' | 'floating' | 'hanging' | 'near';
    confidence: number;         // 추론 신뢰도 (0.0 ~ 1.0)
    metadata?: {
        floatingRange?: [number, number];  // 부유 범위 [minY, maxY]
        heightOffset?: number;              // 높이 오프셋
    };
}

export interface InferredElement {
    name: string;
    keywords: string[];
    semanticRole: SemanticRole;
    isContainer: boolean;
    count: number;
    placementHint?: {
        floatingRange?: [number, number];
        attachTo?: 'floor' | 'ceiling' | 'wall' | 'parent_surface';
    };
}

export interface InferenceResult {
    elements: InferredElement[];
    relationships: SpatialRelationship[];
    mainContainer?: InferredElement;
}

// ============================================================
// 키워드 패턴 정의
// ============================================================

// 컨테이너 키워드 (건물, 방 등 내부 공간이 있는 오브젝트)
const CONTAINER_KEYWORDS = [
    // 한국어
    '건물', '성', '대강당', '궁전', '동굴', '방', '홀', '교실', '사무실',
    '집', '저택', '성당', '교회', '사원', '신전', '탑', '감옥', '도서관',
    '식당', '주방', '욕실', '침실', '거실', '창고', '지하실', '다락방',
    // 영어
    'building', 'castle', 'hall', 'great hall', 'palace', 'cave', 'room',
    'house', 'mansion', 'cathedral', 'church', 'temple', 'tower', 'prison',
    'library', 'restaurant', 'kitchen', 'bathroom', 'bedroom', 'living room',
    'dungeon', 'chamber', 'throne room',
];

// 부유 키워드 (공중에 떠 있는 오브젝트)
const FLOATING_KEYWORDS = [
    // 한국어
    '떠다니는', '부유하는', '공중', '하늘', '날아다니는', '떠있는',
    // 영어
    'floating', 'hovering', 'flying', 'suspended', 'airborne',
];

// 매달림 키워드 (천장에서 내려오는 오브젝트)
const HANGING_KEYWORDS = [
    // 한국어
    '매달린', '걸린', '드리워진', '천장에서', '내려오는',
    // 영어
    'hanging', 'suspended', 'chandelier', 'pendant', 'dangling',
];

// 가구 키워드
const FURNITURE_KEYWORDS = [
    // 한국어
    '테이블', '책상', '의자', '소파', '침대', '선반', '책장', '캐비닛',
    '서랍장', '옷장', '벤치', '식탁',
    // 영어
    'table', 'desk', 'chair', 'sofa', 'bed', 'shelf', 'bookcase', 'cabinet',
    'dresser', 'wardrobe', 'bench', 'dining table',
];

// 장식 키워드
const DECORATION_KEYWORDS = [
    // 한국어
    '촛불', '꽃', '화분', '그림', '액자', '거울', '카펫', '커튼', '램프',
    '조각상', '화병', '시계', '깃발', '배너',
    // 영어
    'candle', 'candles', 'flower', 'plant', 'painting', 'picture', 'mirror',
    'carpet', 'curtain', 'lamp', 'statue', 'vase', 'clock', 'flag', 'banner',
];

// ============================================================
// SpatialRelationshipInferenceEngine 서비스
// ============================================================

export const SpatialRelationshipInferenceEngine = {

    /**
     * 프롬프트에서 공간 관계 추론
     * 
     * @param prompt - 사용자 프롬프트 (예: "호그와트 대강당, 떠다니는 촛불과 긴 테이블")
     * @returns InferenceResult - 추론된 요소들과 관계
     */
    inferFromPrompt(prompt: string): InferenceResult {
        const normalizedPrompt = prompt.toLowerCase();
        const elements: InferredElement[] = [];
        const relationships: SpatialRelationship[] = [];

        // 1. 프롬프트 토큰화 (쉼표, '와/과', 공백 기준)
        const tokens = this.tokenizePrompt(normalizedPrompt);

        // 2. 각 토큰에서 요소 추출
        for (const token of tokens) {
            const element = this.inferElement(token);
            if (element) {
                elements.push(element);
            }
        }

        // 3. 메인 컨테이너 찾기
        const mainContainer = elements.find(e => e.isContainer);

        // 4. 관계 추론
        if (mainContainer) {
            for (const element of elements) {
                if (element !== mainContainer) {
                    // 컨테이너 내부 관계 추론
                    relationships.push({
                        sourceId: element.name,
                        targetId: mainContainer.name,
                        type: 'inside',
                        confidence: 0.9,
                    });

                    // 부유 관계 확인
                    if (element.semanticRole === 'decoration_floating') {
                        relationships.push({
                            sourceId: element.name,
                            targetId: '__AIR__',
                            type: 'floating',
                            confidence: 0.95,
                            metadata: {
                                floatingRange: element.placementHint?.floatingRange || [3, 10],
                            },
                        });
                    }

                    // 매달림 관계 확인
                    if (element.semanticRole === 'decoration_hanging') {
                        relationships.push({
                            sourceId: element.name,
                            targetId: '__CEILING__',
                            type: 'hanging',
                            confidence: 0.9,
                        });
                    }
                }
            }
        }

        return {
            elements,
            relationships,
            mainContainer,
        };
    },

    /**
     * 프롬프트 토큰화
     */
    tokenizePrompt(prompt: string): string[] {
        // 쉼표, '와', '과', '그리고', 'and', 'with' 기준으로 분리
        const separators = /[,，]|\s+와\s+|\s+과\s+|\s+그리고\s+|\s+and\s+|\s+with\s+/gi;
        return prompt
            .split(separators)
            .map(token => token.trim())
            .filter(token => token.length > 0);
    },

    /**
     * 토큰에서 요소 추론
     */
    inferElement(token: string): InferredElement | null {
        const lowerToken = token.toLowerCase();

        // 컨테이너 확인
        const isContainer = CONTAINER_KEYWORDS.some(kw => lowerToken.includes(kw));

        // 부유 확인
        const isFloating = FLOATING_KEYWORDS.some(kw => lowerToken.includes(kw));

        // 매달림 확인
        const isHanging = HANGING_KEYWORDS.some(kw => lowerToken.includes(kw));

        // 가구 확인
        const isFurniture = FURNITURE_KEYWORDS.some(kw => lowerToken.includes(kw));

        // 장식 확인
        const isDecoration = DECORATION_KEYWORDS.some(kw => lowerToken.includes(kw));

        // 시맨틱 역할 결정
        let semanticRole: SemanticRole = 'unspecified';
        if (isContainer) {
            semanticRole = 'environment_container';
        } else if (isFloating) {
            semanticRole = 'decoration_floating';
        } else if (isHanging) {
            semanticRole = 'decoration_hanging';
        } else if (isFurniture) {
            semanticRole = 'furniture_floor';
        } else if (isDecoration) {
            semanticRole = 'decoration_surface';
        }

        // 빈 토큰이거나 불명확한 경우 null 반환
        if (semanticRole === 'unspecified' && !isContainer) {
            // 최소한의 요소로 인식 시도
            if (token.length < 2) return null;
        }

        // 수량 추론
        let count = 1;
        const countPatterns = [
            /(\d+)\s*개/,
            /(\d+)\s*ea/i,
            /수많은|많은|여러/,
        ];

        for (const pattern of countPatterns) {
            const match = lowerToken.match(pattern);
            if (match) {
                if (match[1]) {
                    count = parseInt(match[1], 10);
                } else {
                    count = 10; // "수많은"은 10개로 추정
                }
                break;
            }
        }

        // 이름 정규화
        const name = token
            .replace(/[0-9]+\s*(개|ea)/gi, '')
            .replace(/수많은|많은|여러/g, '')
            .trim();

        return {
            name,
            keywords: this.extractKeywords(token),
            semanticRole,
            isContainer,
            count,
            placementHint: {
                floatingRange: isFloating ? [3, 10] : undefined,
                attachTo: isFloating ? undefined : (isFurniture ? 'floor' : 'parent_surface'),
            },
        };
    },

    /**
     * 키워드 추출
     */
    extractKeywords(token: string): string[] {
        // 공백으로 분리하고 2글자 이상만 유지
        return token
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length >= 2)
            .slice(0, 5);
    },

    /**
     * 관계를 SceneNode relationships 형식으로 변환
     */
    toSceneNodeRelationships(spatialRels: SpatialRelationship[]): Array<{
        targetId: string;
        type: 'on_top_of' | 'next_to' | 'inside' | 'under' | 'supporting';
    }> {
        return spatialRels
            .filter(rel => rel.type === 'inside')
            .map(rel => ({
                targetId: rel.targetId,
                type: 'inside' as const,
            }));
    },

    /**
     * 부유 오브젝트의 높이 범위 추출
     */
    getFloatingHeight(element: InferredElement): [number, number] | null {
        if (element.semanticRole !== 'decoration_floating') {
            return null;
        }
        return element.placementHint?.floatingRange || [3, 10];
    },
};

export default SpatialRelationshipInferenceEngine;
