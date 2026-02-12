/**
 * PropMasterCell.ts
 *
 * 근골격계(Musculoskeletal) 제작 분대 — 물류+서사 주입 세포
 *
 * 역할:
 * - ZoneManifest → AssetBatch[] 변환
 * - 배치 합산(Batching): 동일/유사 자산 요청 묶기
 * - 마이크로스토리 주입: LoreWeaver의 microStories 활용
 * - 크기 사전 추정: AssetMetadataService.estimateSize 호출
 * - 우선순위 결정: focal=HIGH, structural=NORMAL, ambient=LOW
 *
 * 설계 원칙:
 * "의자 100개"를 100번의 개별 트랜잭션이 아닌 1개의 배치로 처리.
 * 이는 AssetHunter와 Constructor의 호출 횟수를 최소화한다.
 */

import { v4 as uuidv4 } from 'uuid';
import { BaseCell } from '../BaseCell';
import type {
    NeuralSignal,
    NarrativeResult,
    ElementSpec,
    Zone,
    ZoneManifest,
    AssetBatch,
    AssetBatchItem,
} from '../types';
import { SIGNALS } from '../types';
import { AssetMetadataService } from '@/services/AssetMetadataService';

// ── 역할 → 우선순위 매핑 ──
const ROLE_PRIORITY: Record<ElementSpec['role'], AssetBatch['priority']> = {
    focal: 'HIGH',
    structural: 'NORMAL',
    support: 'NORMAL',
    ambient: 'LOW',
};

export class PropMasterCell extends BaseCell {
    private metadataService: typeof AssetMetadataService;

    constructor() {
        super('PROP_MASTER', 'MUSCULOSKELETAL');
        this.metadataService = AssetMetadataService;
    }

    // ══════════════════════════════════════════════════════════
    // 공개 API
    // ══════════════════════════════════════════════════════════

    /**
     * ZoneManifest → AssetBatch[] 변환
     *
     * @param manifest SpatialZoner가 생성한 구역 작업 지시서
     * @param narrative LoreWeaver의 서사 결과 (마이크로스토리 주입용)
     * @returns 구역별 AssetBatch 배열
     */
    batch(manifest: ZoneManifest, narrative?: NarrativeResult): AssetBatch[] {
        console.log(
            `[PropMaster] 📦 배치 합산 시작: ${manifest.zones.length}개 구역, ` +
            `${manifest.totalElements}개 엘리먼트`
        );

        const batches: AssetBatch[] = [];

        for (const zone of manifest.zones) {
            if (zone.elements.length === 0) continue;

            const batch = this.createBatchForZone(zone, narrative);
            batches.push(batch);
        }

        // 우선순위 정렬: HIGH → NORMAL → LOW
        batches.sort((a, b) => {
            const order = { HIGH: 0, NORMAL: 1, LOW: 2 };
            return order[a.priority] - order[b.priority];
        });

        const totalItems = batches.reduce((sum, b) => sum + b.items.length, 0);
        console.log(
            `[PropMaster] ✅ 배치 합산 완료: ${batches.length}개 배치, ` +
            `${totalItems}개 아이템 (중복 제거 후)`
        );

        return batches;
    }

    // ══════════════════════════════════════════════════════════
    // BaseCell 추상 구현
    // ══════════════════════════════════════════════════════════

    async handleSignal(signal: NeuralSignal): Promise<void> {
        if (signal.signal === SIGNALS.MANIFEST_COMPLETED) {
            const { manifest, narrative, traceId } = signal.payload;
            const batches = this.batch(manifest, narrative);

            await this.transmit('ASSET_HUNTER', SIGNALS.BATCHES_READY, {
                batches,
                sceneDimensions: manifest.sceneDimensions,
                traceId,
            });
        }
    }

    // ══════════════════════════════════════════════════════════
    // Private: 배치 생성
    // ══════════════════════════════════════════════════════════

    /**
     * 단일 구역의 엘리먼트들을 하나의 AssetBatch로 변환
     */
    private createBatchForZone(zone: Zone, narrative?: NarrativeResult): AssetBatch {
        const items: AssetBatchItem[] = [];
        let maxPriority: AssetBatch['priority'] = 'LOW';

        for (const element of zone.elements) {
            // 같은 이름의 아이템이 이미 있으면 수량 합산 (중복 제거)
            const existing = items.find(item => item.name === element.name);
            if (existing) {
                existing.quantity += element.quantity;
                continue;
            }

            // 크기 사전 추정
            const estimatedSize = this.estimateSize(element);

            // 마이크로스토리 주입
            const microStory = narrative?.microStories?.[element.name]
                || this.generateFallbackStory(element);

            items.push({
                name: element.name,
                role: element.role,
                quantity: element.quantity,
                estimatedSize: this.applyNarrativeScaling(estimatedSize, element, narrative),
                constraints: element.constraints || [],
                microStory,
            });

            // 구역 내 가장 높은 우선순위 채택
            const priority = ROLE_PRIORITY[element.role] || 'NORMAL';
            if (priority === 'HIGH') maxPriority = 'HIGH';
            else if (priority === 'NORMAL' && maxPriority !== 'HIGH') maxPriority = 'NORMAL';
        }

        return {
            batchId: uuidv4(),
            zoneId: zone.id,
            items,
            priority: maxPriority,
        };
    }

    /**
     * AssetMetadataService를 활용한 크기 사전 추정
     * 실제 GLB 로딩 전에 공간을 예약(Phantom Placement)하는 데 사용
     */
    private estimateSize(element: ElementSpec): [number, number, number] {
        try {
            const estimated = this.metadataService.estimateSizeByName(
                element.name
            );

            if (estimated) {
                return [estimated.x, estimated.y, estimated.z];
            }
        } catch {
            // 추정 실패 시 폴백
        }

        // 역할 기반 기본값
        return this.getDefaultSize(element.role);
    }

    /**
     * 역할 기반 기본 크기 (미터)
     */
    private getDefaultSize(role: ElementSpec['role']): [number, number, number] {
        switch (role) {
            case 'focal': return [2.0, 2.0, 2.0];
            case 'structural': return [1.5, 3.0, 1.5];
            case 'support': return [0.5, 0.8, 0.5];
            case 'ambient': return [0.3, 0.3, 0.3];
            default: return [1.0, 1.0, 1.0];
        }
    }

    /**
     * LoreWeaver 마이크로스토리가 없을 때 간단한 폴백 생성
     */
    private generateFallbackStory(element: ElementSpec): string {
        const stories: Record<string, string> = {
            focal: `이 ${element.name}은(는) 씬의 중심에 자리하고 있다.`,
            structural: `${element.name}이(가) 공간의 뼈대를 이루고 있다.`,
            support: `${element.name}이(가) 분위기를 더하고 있다.`,
            ambient: `${element.name}이(가) 배경을 채우고 있다.`,
        };
        return stories[element.role] || `${element.name}이(가) 존재하고 있다.`;
    }

    // ══════════════════════════════════════════════════════════
    // Private: 서사적 스케일링 (MS1.5 시냅스 강화)
    // ══════════════════════════════════════════════════════════

    /**
     * narrative에서 크기 힌트를 추출하여 estimatedSize에 보정 적용
     *
     * 예: "거대한 용" → 1.5배, "미니어처 성" → 0.4배
     * 서사적 DNA가 물리적 크기로 변환되는 접점
     */
    private applyNarrativeScaling(
        baseSize: [number, number, number],
        element: ElementSpec,
        narrative?: NarrativeResult
    ): [number, number, number] {
        if (!narrative) return baseSize;

        // microStory + world_setting에서 크기 힌트 추출
        const microStory = narrative.microStories?.[element.name] || '';
        const context = `${microStory} ${narrative.world_setting || ''}`;
        const factor = this.extractScaleFactor(context, element.name);

        if (factor !== 1.0) {
            console.log(
                `[PropMaster] 📏 서사적 스케일링: ${element.name} ×${factor.toFixed(2)}`
            );
        }

        return [
            baseSize[0] * factor,
            baseSize[1] * factor,
            baseSize[2] * factor,
        ];
    }

    /**
     * 텍스트에서 크기 보정 팩터 추출
     *
     * 규칙 기반이 아닌 가중치 매칭 — 여러 힌트가 겹치면 가장 강한 것 채택
     */
    private extractScaleFactor(text: string, _name: string): number {
        const lower = text.toLowerCase();

        // 크기 힌트 → 팩터 매핑 (강한 순)
        const SCALE_HINTS: Array<{ keywords: string[]; factor: number }> = [
            { keywords: ['거대한', '거대', 'enormous', 'colossal', 'massive'], factor: 2.0 },
            { keywords: ['큰', '대형', 'large', 'big', 'grand'], factor: 1.5 },
            { keywords: ['작은', '소형', 'small', 'little', 'tiny'], factor: 0.5 },
            { keywords: ['미니어처', '초소형', 'miniature', 'micro'], factor: 0.3 },
            { keywords: ['낡은', '오래된', 'ancient', 'weathered'], factor: 1.0 },
        ];

        for (const hint of SCALE_HINTS) {
            if (hint.keywords.some(k => lower.includes(k))) {
                return hint.factor;
            }
        }

        return 1.0;  // 힌트 없으면 보정 없음
    }
}
