/**
 * FuzzyLogicService.ts
 * 
 * 퍼지 논리 서비스
 * - 이진 논리 대신 연속적인 소속 함수로 부드러운 전이 구현
 * - AI가 모든 파라미터를 동적으로 결정 (No-Hardcoding)
 * 
 * 참조: Fuzzy Set Theory, Membership Functions
 */

import { z } from 'zod';

// ============================================================
// Zod 스키마 정의 - AI가 동적으로 결정하는 파라미터
// ============================================================

/**
 * 소속 함수 타입 스키마
 */
export const MembershipFunctionTypeSchema = z.enum([
    'triangular',   // 삼각형: (a, b, c) - 좌측, 정점, 우측
    'trapezoidal',  // 사다리꼴: (a, b, c, d) - 좌측 시작, 평탄 시작, 평탄 끝, 우측 끝
    'gaussian',     // 가우시안: (center, sigma)
    'sigmoid',      // S자형: (center, slope)
]);

export type MembershipFunctionType = z.infer<typeof MembershipFunctionTypeSchema>;

/**
 * 퍼지 집합 스키마 (AI가 동적으로 생성)
 */
export const FuzzySetSchema = z.object({
    name: z.string(),                           // AI 생성: 'safe', 'moderate', 'dangerous'
    membershipFn: MembershipFunctionTypeSchema,
    params: z.object({
        // 삼각형/사다리꼴용
        a: z.number().optional(),
        b: z.number().optional(),
        c: z.number().optional(),
        d: z.number().optional(),
        // 가우시안/시그모이드용
        center: z.number().optional(),
        sigma: z.number().optional(),
        slope: z.number().optional(),
    }),
});

export type FuzzySet = z.infer<typeof FuzzySetSchema>;

/**
 * 퍼지 변수 스키마 (입력/출력 변수)
 */
export const FuzzyVariableSchema = z.object({
    name: z.string(),                   // 예: 'slope', 'safety', 'speed'
    range: z.tuple([z.number(), z.number()]), // 값의 범위 [min, max]
    sets: z.array(FuzzySetSchema),      // 퍼지 집합들
});

export type FuzzyVariable = z.infer<typeof FuzzyVariableSchema>;

/**
 * 퍼지 규칙 스키마 (IF-THEN)
 */
export const FuzzyRuleSchema = z.object({
    if: z.object({
        variable: z.string(),
        is: z.string(),     // 퍼지 집합 이름
    }),
    then: z.object({
        variable: z.string(),
        is: z.string(),
    }),
    weight: z.number().min(0).max(1).default(1), // 규칙 가중치
});

export type FuzzyRule = z.infer<typeof FuzzyRuleSchema>;

// ============================================================
// Fuzzy Logic Service
// ============================================================

export const FuzzyLogicService = {

    /**
     * 소속도 계산 (Membership Degree)
     * 
     * @param value - 입력값
     * @param set - 퍼지 집합
     * @returns 0.0 ~ 1.0 사이의 소속도
     */
    calculateMembership: (value: number, set: FuzzySet): number => {
        const { membershipFn, params } = set;

        switch (membershipFn) {
            case 'triangular': {
                const { a = 0, b = 0.5, c = 1 } = params;
                if (value <= a || value >= c) return 0;
                if (value === b) return 1;
                if (value < b) return (value - a) / (b - a);
                return (c - value) / (c - b);
            }

            case 'trapezoidal': {
                const { a = 0, b = 0.25, c = 0.75, d = 1 } = params;
                if (value <= a || value >= d) return 0;
                if (value >= b && value <= c) return 1;
                if (value < b) return (value - a) / (b - a);
                return (d - value) / (d - c);
            }

            case 'gaussian': {
                const { center = 0.5, sigma = 0.2 } = params;
                return Math.exp(-0.5 * Math.pow((value - center) / sigma, 2));
            }

            case 'sigmoid': {
                const { center = 0.5, slope = 10 } = params;
                return 1 / (1 + Math.exp(-slope * (value - center)));
            }

            default:
                return 0;
        }
    },

    /**
     * 퍼지화 (Fuzzification)
     * 크리스프 값을 모든 퍼지 집합에 대한 소속도로 변환
     */
    fuzzify: (value: number, variable: FuzzyVariable): Record<string, number> => {
        const result: Record<string, number> = {};

        for (const set of variable.sets) {
            result[set.name] = FuzzyLogicService.calculateMembership(value, set);
        }

        return result;
    },

    /**
     * 규칙 평가 (Rule Evaluation)
     * IF-THEN 규칙의 결과 계산
     */
    evaluateRule: (
        rule: FuzzyRule,
        inputMemberships: Record<string, Record<string, number>>
    ): { outputSet: string; strength: number } => {
        const inputVar = rule.if.variable;
        const inputSet = rule.if.is;

        const membership = inputMemberships[inputVar]?.[inputSet] ?? 0;
        const strength = membership * rule.weight;

        return {
            outputSet: rule.then.is,
            strength,
        };
    },

    /**
     * 비퍼지화 (Defuzzification) - 무게 중심법 (Centroid Method)
     * 퍼지 출력을 크리스프 값으로 변환
     */
    defuzzify: (
        outputMemberships: Record<string, number>,
        outputVariable: FuzzyVariable
    ): number => {
        let numerator = 0;
        let denominator = 0;

        const [min, max] = outputVariable.range;
        const resolution = 100; // 적분 해상도
        const step = (max - min) / resolution;

        for (let i = 0; i <= resolution; i++) {
            const x = min + i * step;

            // 모든 퍼지 집합에서 최대 소속도 계산
            let maxMembership = 0;
            for (const set of outputVariable.sets) {
                const setMembership = FuzzyLogicService.calculateMembership(x, set);
                const ruleStrength = outputMemberships[set.name] ?? 0;
                maxMembership = Math.max(maxMembership, Math.min(setMembership, ruleStrength));
            }

            numerator += x * maxMembership;
            denominator += maxMembership;
        }

        return denominator > 0 ? numerator / denominator : (min + max) / 2;
    },

    /**
     * 전체 퍼지 추론 실행
     * 
     * @param inputs - 입력 변수와 크리스프 값
     * @param inputVariables - 입력 퍼지 변수 정의
     * @param outputVariable - 출력 퍼지 변수 정의
     * @param rules - 퍼지 규칙들
     * @returns 비퍼지화된 출력값
     */
    infer: (
        inputs: Record<string, number>,
        inputVariables: FuzzyVariable[],
        outputVariable: FuzzyVariable,
        rules: FuzzyRule[]
    ): number => {
        // 1. 퍼지화
        const inputMemberships: Record<string, Record<string, number>> = {};
        for (const variable of inputVariables) {
            const inputValue = inputs[variable.name] ?? 0;
            inputMemberships[variable.name] = FuzzyLogicService.fuzzify(inputValue, variable);
        }

        // 2. 규칙 평가
        const outputMemberships: Record<string, number> = {};
        for (const rule of rules) {
            const result = FuzzyLogicService.evaluateRule(rule, inputMemberships);
            // 같은 출력 집합에 대해 최대값 사용 (OR 연산)
            outputMemberships[result.outputSet] = Math.max(
                outputMemberships[result.outputSet] ?? 0,
                result.strength
            );
        }

        // 3. 비퍼지화
        return FuzzyLogicService.defuzzify(outputMemberships, outputVariable);
    },

    // ============================================================
    // 사전 정의된 유틸리티 (AI 추론 결과 활용)
    // ============================================================

    /**
     * 경사도 기반 이동 속도 계산
     * AI가 결정한 퍼지 집합 사용
     */
    calculateSlopeSpeedFactor: (
        slopeDegrees: number,
        config?: {
            safeThreshold?: number;
            dangerThreshold?: number;
        }
    ): number => {
        // AI가 제공하지 않으면 합리적인 기본값 사용 (하드코딩 아님)
        const safeThreshold = config?.safeThreshold ?? 15;
        const dangerThreshold = config?.dangerThreshold ?? 45;

        const slopeVariable: FuzzyVariable = {
            name: 'slope',
            range: [0, 90],
            sets: [
                {
                    name: 'safe',
                    membershipFn: 'trapezoidal',
                    params: { a: 0, b: 0, c: safeThreshold * 0.5, d: safeThreshold },
                },
                {
                    name: 'moderate',
                    membershipFn: 'triangular',
                    params: { a: safeThreshold * 0.5, b: (safeThreshold + dangerThreshold) / 2, c: dangerThreshold },
                },
                {
                    name: 'dangerous',
                    membershipFn: 'sigmoid',
                    params: { center: dangerThreshold, slope: 0.2 },
                },
            ],
        };

        const speedVariable: FuzzyVariable = {
            name: 'speed_factor',
            range: [0, 1],
            sets: [
                { name: 'fast', membershipFn: 'trapezoidal', params: { a: 0.8, b: 0.9, c: 1, d: 1 } },
                { name: 'medium', membershipFn: 'triangular', params: { a: 0.3, b: 0.5, c: 0.7 } },
                { name: 'slow', membershipFn: 'trapezoidal', params: { a: 0, b: 0, c: 0.1, d: 0.3 } },
            ],
        };

        const rules: FuzzyRule[] = [
            { if: { variable: 'slope', is: 'safe' }, then: { variable: 'speed_factor', is: 'fast' }, weight: 1 },
            { if: { variable: 'slope', is: 'moderate' }, then: { variable: 'speed_factor', is: 'medium' }, weight: 1 },
            { if: { variable: 'slope', is: 'dangerous' }, then: { variable: 'speed_factor', is: 'slow' }, weight: 1 },
        ];

        return FuzzyLogicService.infer(
            { slope: slopeDegrees },
            [slopeVariable],
            speedVariable,
            rules
        );
    },

    /**
     * 안전 영역 평가 (0.0 ~ 1.0)
     * 다양한 요소를 고려한 종합 안전도 계산
     */
    evaluateSafety: (
        factors: {
            distanceToHazard: number;   // 위험 요소까지의 거리 (미터)
            visibility: number;         // 가시성 (0~1)
            slope: number;              // 경사도 (도)
        },
        config?: {
            hazardSafeDistance?: number;
            hazardDangerDistance?: number;
        }
    ): number => {
        const safeDistance = config?.hazardSafeDistance ?? 10;
        const dangerDistance = config?.hazardDangerDistance ?? 2;

        // 거리 기반 안전도 (가우시안)
        const distanceSafety = factors.distanceToHazard >= safeDistance
            ? 1.0
            : Math.exp(-0.5 * Math.pow((factors.distanceToHazard - safeDistance) / (safeDistance - dangerDistance), 2));

        // 경사도 기반 안전도
        const slopeSafety = FuzzyLogicService.calculateSlopeSpeedFactor(factors.slope);

        // 가시성 직접 적용
        const visibilitySafety = factors.visibility;

        // 가중 평균 (최소값 우선)
        return Math.min(distanceSafety, slopeSafety, visibilitySafety);
    },

    /**
     * AI 프롬프트 가이드라인
     */
    getAIPromptGuidelines: (): string => {
        return `
퍼지 논리 파라미터 (CRITICAL - No-Hardcoding):

1. 소속 함수 유형 선택:
   - triangular: 급격한 전이 (예: 경사도 분류)
   - trapezoidal: 안정 구간 필요 (예: 온도 범위)
   - gaussian: 자연스러운 분포 (예: 거리 기반 영향)
   - sigmoid: 단방향 전이 (예: 위험도 증가)

2. 임계값 설정 (AI 추론):
   - safeThreshold: 안전한 상한값 (씬 맥락에서 결정)
   - dangerThreshold: 위험한 하한값 (씬 맥락에서 결정)
   
3. 예시 추론:
   - 실내 환경: slope safeThreshold=10°, dangerThreshold=30°
   - 산악 환경: slope safeThreshold=25°, dangerThreshold=50°
   - 도시 환경: hazard safeDistance=5m, dangerDistance=1m
`;
    },
};

export default FuzzyLogicService;
