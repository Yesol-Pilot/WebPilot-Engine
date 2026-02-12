/**
 * ValidatorAgent.ts
 * 
 * 품질 검증 에이전트
 * - 충돌/겹침 검사
 * - 시맨틱 규칙 위반 감지
 * - VLM 기반 품질 평가 (선택적)
 */

import { BaseAgent } from './BaseAgent';
import { AgentMessage, AgentRole } from './types';
import { getBlackboard, BlackboardEntry } from './Blackboard';
import { getSpatialHashGrid } from '../../lib/geometry/SpatialHashGrid';
import { getSpatialKnowledgeGraph } from '../spatial/SpatialKnowledgeGraph';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============ 타입 정의 ============

export interface ValidationResult {
    valid: boolean;
    score: number;          // 0-100
    issues: ValidationIssue[];
    suggestions: string[];
}

export interface ValidationIssue {
    type: 'COLLISION' | 'SEMANTIC' | 'PHYSICAL' | 'AESTHETIC';
    severity: 'ERROR' | 'WARNING' | 'INFO';
    objectId?: string;
    message: string;
    position?: { x: number; y: number; z: number };
}

interface SceneLayout {
    id: string;
    objects: Array<{
        id: string;
        type: string;
        position: [number, number, number];
        scale?: [number, number, number];
        model?: string;
    }>;
}

// ============ 메인 클래스 ============

export class ValidatorAgent extends BaseAgent {
    public role: AgentRole = 'VALIDATOR';
    private blackboard = getBlackboard();
    private spatialHash = getSpatialHashGrid();
    private knowledgeGraph = getSpatialKnowledgeGraph();
    private genAI: GoogleGenerativeAI | null = null;

    constructor() {
        super('VALIDATOR');
        this.initializeAI();
        this.setupSubscriptions();
    }

    private initializeAI(): void {
        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            console.log('[Validator] VLM 초기화 완료');
        }
    }

    private setupSubscriptions(): void {
        // LAYOUT 엔트리가 생성되면 자동 검증
        this.blackboard.subscribe(
            'VALIDATOR',
            { types: ['LAYOUT'] },
            async (entry) => {
                console.log('[Validator] 레이아웃 검증 시작');
                const result = await this.validateLayout(entry.data);

                // 결과를 블랙보드에 기록
                await this.blackboard.write(
                    'CRITIQUE',
                    result,
                    'VALIDATOR',
                    {
                        parentId: entry.id,
                        priority: result.valid ? 'LOW' : 'HIGH',
                        tags: ['validation', result.valid ? 'passed' : 'failed']
                    }
                );
            }
        );
    }

    protected async handleMessage(message: AgentMessage): Promise<void> {
        switch (message.intent) {
            case 'VERIFY_RESULT':
                if (message.payload.layout) {
                    const result = await this.validateLayout(message.payload.layout);
                    await this.sendValidationResult(message.sender, result);
                }
                break;
            default:
                break;
        }
    }

    /**
     * Level 1: 충돌/물리적 검증
     */
    async validateCollisions(layout: SceneLayout): Promise<ValidationIssue[]> {
        const issues: ValidationIssue[] = [];

        // Spatial Hash에 모든 객체 등록
        this.spatialHash.clear();

        for (const obj of layout.objects) {
            const size = obj.scale || [1, 1, 1];
            const bbox = {
                min: {
                    x: obj.position[0] - size[0] / 2,
                    y: obj.position[1],
                    z: obj.position[2] - size[2] / 2
                },
                max: {
                    x: obj.position[0] + size[0] / 2,
                    y: obj.position[1] + size[1],
                    z: obj.position[2] + size[2] / 2
                }
            };

            // 충돌 체크
            const collisions = this.spatialHash.queryBBox(bbox);
            if (collisions.length > 0) {
                for (const collision of collisions) {
                    issues.push({
                        type: 'COLLISION',
                        severity: 'ERROR',
                        objectId: obj.id,
                        message: `${obj.id}가 ${collision.id}와 충돌`,
                        position: { x: obj.position[0], y: obj.position[1], z: obj.position[2] }
                    });
                }
            }

            // 등록
            this.spatialHash.insert({
                id: obj.id,
                bbox,
                type: obj.type
            });
        }

        // 물리적 안정성 검사
        for (const obj of layout.objects) {
            // 공중에 떠 있는 객체 (샹들리에 등 제외)
            const floatingTypes = ['chandelier', 'pendant', 'hanging'];
            const isFloating = floatingTypes.some(t => obj.type.toLowerCase().includes(t));

            if (!isFloating && obj.position[1] > 0.5) {
                // 아래에 지지대가 있는지 확인
                const below = this.spatialHash.queryNearby(
                    { x: obj.position[0], y: 0, z: obj.position[2] },
                    0.5
                );

                const hasSupport = below.some(b =>
                    b.type && ['table', 'desk', 'shelf', 'floor'].some(t =>
                        b.type!.toLowerCase().includes(t)
                    )
                );

                if (!hasSupport) {
                    issues.push({
                        type: 'PHYSICAL',
                        severity: 'WARNING',
                        objectId: obj.id,
                        message: `${obj.id}가 공중에 떠 있음 (지지대 없음)`,
                        position: { x: obj.position[0], y: obj.position[1], z: obj.position[2] }
                    });
                }
            }
        }

        return issues;
    }

    /**
     * Level 2: 시맨틱 규칙 검증
     */
    async validateSemantics(layout: SceneLayout): Promise<ValidationIssue[]> {
        const issues: ValidationIssue[] = [];

        for (const obj of layout.objects) {
            // 관계 규칙 조회
            const relations = this.knowledgeGraph.queryRelations(obj.type);

            for (const relation of relations) {
                const targetType = relation.subject === obj.type ? relation.object : relation.subject;
                const target = layout.objects.find(o =>
                    o.type.toLowerCase().includes(targetType.toLowerCase())
                );

                if (!target) continue;

                const distance = Math.sqrt(
                    Math.pow(obj.position[0] - target.position[0], 2) +
                    Math.pow(obj.position[1] - target.position[1], 2) +
                    Math.pow(obj.position[2] - target.position[2], 2)
                );

                // 거리 제약 위반
                if (relation.constraints.distance) {
                    if (distance < relation.constraints.distance.min) {
                        issues.push({
                            type: 'SEMANTIC',
                            severity: 'WARNING',
                            objectId: obj.id,
                            message: `${obj.type}이 ${targetType}에 너무 가까움 (${distance.toFixed(1)}m < ${relation.constraints.distance.min}m)`
                        });
                    } else if (distance > relation.constraints.distance.max) {
                        issues.push({
                            type: 'SEMANTIC',
                            severity: 'INFO',
                            objectId: obj.id,
                            message: `${obj.type}이 ${targetType}에서 너무 멀리 있음`
                        });
                    }
                }
            }
        }

        return issues;
    }

    /**
     * Level 3: VLM 기반 품질 평가 (선택적)
     */
    async evaluateWithVLM(image: Buffer | string): Promise<{ score: number; feedback: string }> {
        if (!this.genAI) {
            return { score: 70, feedback: 'VLM 비활성화됨' };
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

            // 이미지가 base64 문자열인 경우
            const imageData = typeof image === 'string'
                ? image
                : image.toString('base64');

            const result = await model.generateContent([
                {
                    inlineData: {
                        mimeType: 'image/png',
                        data: imageData
                    }
                },
                `이 3D 씬을 평가해주세요:
                
1. 심미성 (0-100): 색상 조화, 스타일 일관성
2. 기능성 (0-100): 동선 확보, 가구 배치
3. 전체 점수 (0-100)

JSON으로 응답: { "aesthetics": 숫자, "functionality": 숫자, "overall": 숫자, "feedback": "개선점" }`
            ]);

            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    score: parsed.overall || 70,
                    feedback: parsed.feedback || ''
                };
            }
        } catch (error) {
            console.error('[Validator] VLM 평가 실패:', error);
        }

        return { score: 70, feedback: 'VLM 평가 실패' };
    }

    /**
     * 종합 검증
     */
    async validateLayout(layout: SceneLayout): Promise<ValidationResult> {
        console.log(`[Validator] 검증 시작: ${layout.objects?.length || 0}개 객체`);

        const allIssues: ValidationIssue[] = [];

        // Level 1: 충돌 검사
        const collisionIssues = await this.validateCollisions(layout);
        allIssues.push(...collisionIssues);

        // Level 2: 시맨틱 검사
        const semanticIssues = await this.validateSemantics(layout);
        allIssues.push(...semanticIssues);

        // 점수 계산
        const errorCount = allIssues.filter(i => i.severity === 'ERROR').length;
        const warningCount = allIssues.filter(i => i.severity === 'WARNING').length;

        let score = 100;
        score -= errorCount * 20;
        score -= warningCount * 5;
        score = Math.max(0, Math.min(100, score));

        // 개선 제안 생성
        const suggestions: string[] = [];
        if (errorCount > 0) {
            suggestions.push('충돌하는 객체들의 위치를 조정하세요.');
        }
        if (warningCount > 0) {
            suggestions.push('시맨틱 규칙을 확인하고 객체 관계를 개선하세요.');
        }

        const result: ValidationResult = {
            valid: errorCount === 0,
            score,
            issues: allIssues,
            suggestions
        };

        console.log(`[Validator] 검증 완료: ${result.valid ? '통과' : '실패'} (점수: ${score})`);
        return result;
    }

    private async sendValidationResult(target: AgentRole, result: ValidationResult): Promise<void> {
        await this.sendMessage(target, 'REPORT_STATUS', {
            action: 'VALIDATION_RESULT',
            result
        });
    }
}

export default ValidatorAgent;
