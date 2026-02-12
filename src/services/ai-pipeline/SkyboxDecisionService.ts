/**
 * SkyboxDecisionService.ts
 * 
 * 씬이 야외인지 실내인지 판단하고 적절한 Skybox를 적용
 * 
 * 판단 기준:
 * 1. 프롬프트 키워드 분석
 * 2. 씬 오브젝트 분석 (지붕/천장 유무)
 * 3. 컨테이너 타입 분석
 */

import { SkyboxService } from '../SkyboxService';

// 야외 키워드
const OUTDOOR_KEYWORDS = [
    // 자연 환경
    'forest', 'mountain', 'beach', 'ocean', 'river', 'lake', 'field', 'meadow',
    'desert', 'jungle', 'valley', 'cliff', 'waterfall', 'island', 'coast',
    '숲', '산', '해변', '바다', '강', '호수', '들판', '초원', '사막', '정글',
    // 도시 야외
    'street', 'plaza', 'park', 'garden', 'courtyard', 'market', 'square',
    '거리', '광장', '공원', '정원', '마당', '시장',
    // 판타지 야외
    'kingdom', 'village', 'town', 'castle grounds', 'battlefield', 'ruins',
    '왕국', '마을', '성', '전장', '폐허',
    // 명시적 야외
    'outdoor', 'outside', 'open air', 'sky', 'sun', 'moon', 'stars',
    '야외', '하늘', '태양', '달', '별',
];

// 실내 키워드
const INDOOR_KEYWORDS = [
    // 건물 내부
    'room', 'hall', 'chamber', 'corridor', 'basement', 'attic', 'cellar',
    '방', '홀', '복도', '지하실', '다락방',
    // 특정 공간
    'library', 'tavern', 'inn', 'shop', 'store', 'kitchen', 'bedroom',
    'bathroom', 'office', 'laboratory', 'dungeon', 'prison', 'cave',
    '도서관', '선술집', '여관', '상점', '주방', '침실', '욕실', '사무실', '연구실', '던전', '감옥', '동굴',
    // 명시적 실내
    'indoor', 'inside', 'interior', 'enclosed',
    '실내', '내부',
];

// Skybox 스타일 매핑
const SKYBOX_STYLE_MAP: Record<string, number> = {
    // Fantasy
    'fantasy': 5,
    'medieval': 5,
    'magical': 6,
    // Sci-Fi
    'scifi': 12,
    'futuristic': 12,
    'space': 13,
    // Nature
    'forest': 2,
    'mountain': 3,
    'beach': 4,
    'desert': 8,
    // Urban
    'city': 10,
    'urban': 10,
    // Default
    'default': 20,  // Nebula/Stylized
};

interface SkyboxDecision {
    needsSkybox: boolean;
    isOutdoor: boolean;
    confidence: number;
    suggestedStyle: number;
    suggestedPrompt: string;
    reason: string;
}

class SkyboxDecisionServiceClass {

    /**
     * 프롬프트를 분석하여 Skybox 필요 여부 판단
     */
    analyzePrompt(prompt: string): SkyboxDecision {
        const lowerPrompt = prompt.toLowerCase();

        // 키워드 매칭
        const outdoorMatches = OUTDOOR_KEYWORDS.filter(kw => lowerPrompt.includes(kw.toLowerCase()));
        const indoorMatches = INDOOR_KEYWORDS.filter(kw => lowerPrompt.includes(kw.toLowerCase()));

        const outdoorScore = outdoorMatches.length;
        const indoorScore = indoorMatches.length;

        // 판단
        const isOutdoor = outdoorScore > indoorScore;
        const needsSkybox = isOutdoor || (outdoorScore === indoorScore && outdoorScore > 0);
        const confidence = Math.min(1, Math.abs(outdoorScore - indoorScore) * 0.2 + 0.3);

        // 스타일 결정
        const style = this.determineSkyboxStyle(prompt);

        // 프롬프트 생성
        const suggestedPrompt = this.generateSkyboxPrompt(prompt, outdoorMatches);

        const reason = needsSkybox
            ? `야외 키워드 감지: [${outdoorMatches.slice(0, 3).join(', ')}]`
            : `실내 키워드 감지: [${indoorMatches.slice(0, 3).join(', ')}]`;

        console.log(`[SkyboxDecision] "${prompt.substring(0, 30)}..." → ${needsSkybox ? '야외' : '실내'} (${(confidence * 100).toFixed(0)}%)`);

        return {
            needsSkybox,
            isOutdoor,
            confidence,
            suggestedStyle: style,
            suggestedPrompt,
            reason,
        };
    }

    /**
     * 스카이박스 스타일 결정
     */
    private determineSkyboxStyle(prompt: string): number {
        const lowerPrompt = prompt.toLowerCase();

        for (const [keyword, styleId] of Object.entries(SKYBOX_STYLE_MAP)) {
            if (lowerPrompt.includes(keyword)) {
                return styleId;
            }
        }

        return SKYBOX_STYLE_MAP['default'];
    }

    /**
     * 스카이박스 프롬프트 생성
     */
    private generateSkyboxPrompt(originalPrompt: string, keywords: string[]): string {
        // 핵심 키워드 추출
        const mainKeyword = keywords[0] || 'fantasy landscape';

        // 기본 환경 설명 추가
        const enhancedPrompt = `${mainKeyword}, dramatic sky, volumetric clouds, cinematic lighting, highly detailed environment`;

        return enhancedPrompt;
    }

    /**
     * Skybox 생성 및 적용 (로컬 HDRI 우선 검색)
     */
    async generateSkyboxIfNeeded(prompt: string): Promise<string | null> {
        const decision = this.analyzePrompt(prompt);

        if (!decision.needsSkybox) {
            console.log('[SkyboxDecision] 실내 씬 - Skybox 생성 스킵');
            return null;
        }

        // 1️⃣ 먼저 로컬 HDRI 검색 (무료!)
        try {
            const localSkybox = await SkyboxService.findLocalSkybox(prompt, decision.isOutdoor);
            if (localSkybox) {
                console.log(`[SkyboxDecision] ✅ 로컬 HDRI 사용: ${localSkybox}`);
                return localSkybox;
            }
        } catch (error) {
            console.warn('[SkyboxDecision] 로컬 HDRI 검색 실패:', error);
        }

        // 2️⃣ 로컬에 없으면 Blockade Labs API 호출
        console.log(`[SkyboxDecision] Skybox API 생성 시작: "${decision.suggestedPrompt}"`);

        try {
            const result = await SkyboxService.generateAndWait(decision.suggestedPrompt, {
                skybox_style_id: decision.suggestedStyle,
                enhance_prompt: true,
            });

            console.log(`[SkyboxDecision] Skybox API 생성 완료: ${result.file_url}`);
            return result.file_url || null;
        } catch (error) {
            console.error('[SkyboxDecision] Skybox API 생성 실패:', error);
            return null;
        }
    }
}

// 싱글톤
export const SkyboxDecisionService = new SkyboxDecisionServiceClass();
export default SkyboxDecisionService;
