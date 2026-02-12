/**
 * analyzer.ts
 * 
 * 하이브리드 리소스 분석기
 * 1순위: 원본 프롬프트 (API 생성물)
 * 2순위: GLTF 메타데이터
 * 3순위: 파일명 AI 분석
 * 4순위: Vision AI (스크린샷)
 */

import { ScannedFile } from './scanner';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AnalysisResult {
    category: string;
    subCategory: string;
    keywords: {
        ko: string[];
        en: string[];
    };
    description: string;
    confidence: number;
    source: 'prompt' | 'metadata' | 'filename' | 'vision';
    meshNames?: string[];
    materialNames?: string[];
}

// 카테고리 정의
export const CATEGORIES = [
    'environment',  // 환경/장소
    'furniture',    // 가구
    'character',    // 캐릭터/생물
    'prop',         // 소품
    'nature',       // 자연물
    'structure'     // 구조물
] as const;

// 폴더 → 카테고리 기본 매핑
const FOLDER_CATEGORY_MAP: Record<string, string> = {
    'Harry': 'environment',
    'furniture': 'furniture',
    'character': 'character',
    'misc': 'prop',
    'nature': 'nature',
    'prop': 'prop',
    'structure': 'structure'
};

// 파일명 패턴 → 서브카테고리
const FILENAME_PATTERNS: Record<string, { category: string; subCategory: string }> = {
    // furniture
    'desk': { category: 'furniture', subCategory: 'desk' },
    'chair': { category: 'furniture', subCategory: 'chair' },
    'table': { category: 'furniture', subCategory: 'table' },
    'grandoak': { category: 'furniture', subCategory: 'table' },
    'largeoak': { category: 'furniture', subCategory: 'table' },
    'bookcase': { category: 'furniture', subCategory: 'storage' },
    'broomstick': { category: 'furniture', subCategory: 'misc' },
    'castiron': { category: 'furniture', subCategory: 'cauldron' },
    'antique': { category: 'furniture', subCategory: 'antique' },
    'grand_': { category: 'furniture', subCategory: 'grand' },

    // character
    'bookshelf': { category: 'character', subCategory: 'bookshelf' },
    'portrait': { category: 'character', subCategory: 'decoration' },
    'ghost': { category: 'character', subCategory: 'creature' },
    'houseelf': { category: 'character', subCategory: 'creature' },
    'dumbledore': { category: 'character', subCategory: 'wizard' },
    'albus': { category: 'character', subCategory: 'wizard' },

    // prop
    'candle': { category: 'prop', subCategory: 'light' },
    'floatingcandle': { category: 'prop', subCategory: 'light' },
    'potion': { category: 'prop', subCategory: 'potion' },
    'hat': { category: 'prop', subCategory: 'hat' },
    'sortinghat': { category: 'prop', subCategory: 'hat' },
    'snitch': { category: 'prop', subCategory: 'quidditch' },
    'book': { category: 'prop', subCategory: 'book' },
    'stack': { category: 'prop', subCategory: 'book' },
    'leatherbound': { category: 'prop', subCategory: 'book' },
    'glass': { category: 'prop', subCategory: 'orb' },

    // nature
    'crystal': { category: 'nature', subCategory: 'crystal' },

    // environment
    'common_room': { category: 'environment', subCategory: 'room' },
    'grand_hall': { category: 'environment', subCategory: 'hall' },
    'corridor': { category: 'environment', subCategory: 'corridor' },
    'classroom': { category: 'environment', subCategory: 'classroom' },
    'office': { category: 'environment', subCategory: 'office' },
    'shop': { category: 'environment', subCategory: 'shop' },
};

/**
 * 하이브리드 분석
 */
export async function analyzeAsset(
    file: ScannedFile,
    existingPrompt?: string | null
): Promise<AnalysisResult> {

    // 1순위: 원본 프롬프트가 있으면 사용
    if (existingPrompt) {
        console.log(`[Analyzer] 프롬프트 기반 분석: ${file.filename}`);
        return analyzeFromPrompt(existingPrompt, file);
    }

    // 2순위: GLTF 메타데이터 (추후 구현)
    // const metadata = await extractGLTFMetadata(file.absolutePath);
    // if (metadata.meshNames.length > 0) {
    //     return analyzeFromMetadata(metadata, file);
    // }

    // 3순위: 파일명 패턴 분석
    const patternResult = analyzeFromFilename(file);
    if (patternResult.confidence >= 0.7) {
        console.log(`[Analyzer] 파일명 패턴 분석: ${file.filename} → ${patternResult.category}/${patternResult.subCategory}`);
        return patternResult;
    }

    // 4순위: AI 분석 (Gemini)
    console.log(`[Analyzer] AI 분석 필요: ${file.filename}`);
    return analyzeWithAI(file);
}

/**
 * 원본 프롬프트 기반 분석
 */
async function analyzeFromPrompt(
    prompt: string,
    file: ScannedFile
): Promise<AnalysisResult> {
    // Gemini로 프롬프트 분석
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const response = await model.generateContent(`
당신은 3D 에셋 분류 전문가입니다.

생성 프롬프트: "${prompt}"
파일 폴더: ${file.folder}

다음 JSON만 출력하세요:
{
    "category": "environment|furniture|character|prop|nature|structure",
    "subCategory": "desk|chair|table|room|hall|wizard|creature|book|...",
    "keywords": {
        "ko": ["한국어 키워드 3-5개"],
        "en": ["english keywords 3-5"]
    },
    "description": "한 줄 설명"
}
`);

    try {
        const text = response.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                category: parsed.category,
                subCategory: parsed.subCategory,
                keywords: parsed.keywords,
                description: parsed.description,
                confidence: 0.95,
                source: 'prompt'
            };
        }
    } catch (err) {
        console.warn('[Analyzer] 프롬프트 분석 실패:', err);
    }

    // 폴백
    return analyzeFromFilename(file);
}

/**
 * 파일명 패턴 분석
 */
function analyzeFromFilename(file: ScannedFile): AnalysisResult {
    const lower = file.filename.toLowerCase();

    // 패턴 매칭
    for (const [pattern, info] of Object.entries(FILENAME_PATTERNS)) {
        if (lower.includes(pattern.toLowerCase())) {
            return {
                category: info.category,
                subCategory: info.subCategory,
                keywords: generateKeywords(file, info),
                description: `${info.subCategory} 타입의 ${info.category}`,
                confidence: 0.75,
                source: 'filename'
            };
        }
    }

    // 폴더 기반 폴백
    const category = FOLDER_CATEGORY_MAP[file.folder] || 'prop';

    return {
        category,
        subCategory: 'unknown',
        keywords: {
            ko: [file.filename],
            en: [file.filename]
        },
        description: `${file.folder} 폴더의 에셋`,
        confidence: 0.5,
        source: 'filename'
    };
}

/**
 * 키워드 자동 생성
 */
function generateKeywords(
    file: ScannedFile,
    info: { category: string; subCategory: string }
): { ko: string[]; en: string[] } {
    const koMap: Record<string, string[]> = {
        'desk': ['책상', '사무용책상'],
        'chair': ['의자', '사무용의자'],
        'table': ['테이블', '탁자'],
        'bookshelf': ['책장', '서재'],
        'wizard': ['마법사'],
        'creature': ['생물', '크리처'],
        'light': ['조명', '양초'],
        'potion': ['물약', '포션'],
        'hat': ['모자', '마법모자'],
        'book': ['책', '고서'],
        'crystal': ['수정', '크리스탈'],
        'room': ['방', '기숙사'],
        'hall': ['홀', '대강당'],
        'office': ['사무실', '교장실'],
        'grand': ['대형', '고급'],
        'antique': ['골동품', '앤티크'],
    };

    const enMap: Record<string, string[]> = {
        'desk': ['desk', 'office desk'],
        'chair': ['chair', 'office chair'],
        'table': ['table', 'oak table'],
        'bookshelf': ['bookshelf', 'library'],
        'wizard': ['wizard', 'mage'],
        'creature': ['creature', 'being'],
        'light': ['light', 'candle'],
        'potion': ['potion', 'flask'],
        'hat': ['hat', 'magic hat'],
        'book': ['book', 'tome'],
        'crystal': ['crystal', 'crystal ball'],
        'room': ['room', 'common room'],
        'hall': ['hall', 'great hall'],
        'office': ['office'],
        'grand': ['grand', 'large'],
        'antique': ['antique', 'vintage'],
    };

    return {
        ko: koMap[info.subCategory] || [info.subCategory],
        en: enMap[info.subCategory] || [info.subCategory]
    };
}

/**
 * AI 기반 분석 (파일명만으로 추론 불가 시)
 */
async function analyzeWithAI(file: ScannedFile): Promise<AnalysisResult> {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const response = await model.generateContent(`
당신은 3D 에셋 분류 전문가입니다.

파일 정보:
- 경로: ${file.relativePath}
- 폴더: ${file.folder}
- 파일명: ${file.filename}
- 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB

파일명과 폴더로 추론하여 다음 JSON만 출력하세요:
{
    "category": "environment|furniture|character|prop|nature|structure",
    "subCategory": "구체적인 서브카테고리",
    "keywords": {
        "ko": ["한국어 키워드 3-5개"],
        "en": ["english keywords 3-5"]
    },
    "description": "이 에셋에 대한 한 줄 설명"
}
`);

        const text = response.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                category: parsed.category,
                subCategory: parsed.subCategory,
                keywords: parsed.keywords,
                description: parsed.description,
                confidence: 0.8,
                source: 'filename' // AI가 파일명 기반으로 추론
            };
        }
    } catch (err) {
        console.warn('[Analyzer] AI 분석 실패:', err);
    }

    // 최종 폴백
    return analyzeFromFilename(file);
}
