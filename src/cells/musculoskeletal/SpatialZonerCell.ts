/**
 * SpatialZonerCell.ts
 *
 * 근골격계(Musculoskeletal) 제작 분대 — 공간 분할 세포
 *
 * 역할:
 * - ScenarioData → Zone[] 공간 분할 (유사 분열 / Mitosis)
 * - Grid 기반 분할: 씬 크기에 따라 4~9 구역
 * - 역할 기반 엘리먼트 할당: focal→중앙, ambient→전체
 * - ZoneManifest 발행 → PropMasterCell로 전달
 *
 * 생물학적 메타포:
 * 단일 세포가 거대해지는 대신 분열하여 조직을 형성하듯,
 * 거대한 공간을 처리 가능한 단위(Zone)로 분할한다.
 * 이는 O(N²) → O(k log k) 복잡도 감소의 핵심 전략.
 */

import { v4 as uuidv4 } from 'uuid';
import { BaseCell } from '../BaseCell';
import type {
    NeuralSignal,
    ScenarioData,
    ElementSpec,
    Zone,
    ZoneManifest,
} from '../types';
import { SIGNALS } from '../types';

// ── 분할 상수 ──
const MIN_ZONES = 4;           // 최소 구역 수 (2×2)
const MAX_ZONES = 9;           // 최대 구역 수 (3×3)
const COMPLEXITY_THRESHOLD = {
    LOW: 8,     // 엘리먼트 8개 이하 → 4구역
    MID: 15,    // 15개 이하 → 6구역
    HIGH: 25,   // 25개 초과 → 9구역
};

// MS1.5: 세포 분열 임계값
const MITOSIS_COMPLEXITY = 0.7; // 복잡도 0.7 초과 시 분열

export class SpatialZonerCell extends BaseCell {
    constructor() {
        super('SPATIAL_ZONER', 'MUSCULOSKELETAL');
    }

    // ══════════════════════════════════════════════════════════
    // 공개 API — Commander/ConstructorSquad가 호출
    // ══════════════════════════════════════════════════════════

    /**
     * ScenarioData를 공간 분할하여 ZoneManifest 생성
     */
    zone(scenario: ScenarioData): ZoneManifest {
        const { dimensions, elements } = scenario;
        console.log(
            `[SpatialZoner] 🗺️ 공간 분할 시작: ` +
            `${dimensions.width}×${dimensions.height}×${dimensions.depth}m, ` +
            `${elements.length}개 엘리먼트`
        );

        // 1. 그리드 크기 결정
        const gridSize = this.calculateGridSize(elements.length);
        const cols = gridSize.cols;
        const rows = gridSize.rows;

        console.log(`[SpatialZoner] 📐 그리드: ${cols}×${rows} = ${cols * rows}구역`);

        // 2. 구역 생성
        const zones = this.createGrid(dimensions, cols, rows);

        // 3. 엘리먼트 할당 (역할 기반)
        this.assignElements(zones, elements);

        // 4. 복잡도 계산
        const complexity = this.calculateComplexity(elements);

        // Zone ID에 sceneId 접두사 포함 → 멀티 씬 동시 처리 시 ID 충돌 방지
        const prefixedZones = zones.map(z => ({
            ...z,
            id: `${scenario.id}_${z.id}`,
        }));

        const manifest: ZoneManifest = {
            sceneId: scenario.id,
            zones: prefixedZones,
            sceneDimensions: dimensions,
            totalElements: elements.length,
            complexity,
        };

        console.log(
            `[SpatialZoner] ✅ 분할 완료: ${zones.length}개 구역, ` +
            `복잡도=${complexity.toFixed(2)}`
        );

        return manifest;
    }

    // ══════════════════════════════════════════════════════════
    // BaseCell 추상 구현
    // ══════════════════════════════════════════════════════════

    async handleSignal(signal: NeuralSignal): Promise<void> {
        if (signal.signal === SIGNALS.PLAN_COMPLETED) {
            const scenario = signal.payload.scenario as ScenarioData;
            const manifest = this.zone(scenario);

            // MS1.5: 복잡도 임계값 초과 시 세포 분열
            if (manifest.complexity > MITOSIS_COMPLEXITY) {
                await this.handleMitosisMode(manifest, signal);
            } else {
                // 일반 경로: 단일 세포 처리
                await this.transmit('PROP_MASTER', SIGNALS.MANIFEST_COMPLETED, {
                    manifest,
                    narrative: signal.payload.narrative,
                    traceId: signal.payload.traceId,
                });
            }
        }
    }

    /**
     * 세포 분열 모드: Zone을 2개 그룹으로 나누어 병렬
     *
     * 생물학적 메타포: 단세포 유기체가 거대해지는 대신
     * 분열하여 조직을 형성하는 것처럼, 대규모 씨을 병렬 처리.
     */
    private async handleMitosisMode(
        manifest: ZoneManifest,
        signal: NeuralSignal
    ): Promise<void> {
        const mid = Math.ceil(manifest.zones.length / 2);
        const groupA = manifest.zones.slice(0, mid);
        const groupB = manifest.zones.slice(mid);

        console.log(
            `[SpatialZoner] 🧬 세포 분열! 복잡도=${manifest.complexity.toFixed(2)} > ${MITOSIS_COMPLEXITY}\n` +
            `  ├─ 그룹 A: ${groupA.length}구역\n` +
            `  └─ 그룹 B: ${groupB.length}구역`
        );

        // 두 그룹을 병렬로 PropMaster에 전달
        const manifestA: ZoneManifest = {
            ...manifest,
            zones: groupA,
            totalElements: groupA.reduce((s, z) => s + z.elements.length, 0),
        };
        const manifestB: ZoneManifest = {
            ...manifest,
            zones: groupB,
            totalElements: groupB.reduce((s, z) => s + z.elements.length, 0),
        };

        // 병렬 전송 (두 개의 MANIFEST_COMPLETED 신호)
        await Promise.all([
            this.transmit('PROP_MASTER', SIGNALS.MANIFEST_COMPLETED, {
                manifest: manifestA,
                narrative: signal.payload.narrative,
                traceId: signal.payload.traceId,
                mitosisGroup: 'A',
            }),
            this.transmit('PROP_MASTER', SIGNALS.MANIFEST_COMPLETED, {
                manifest: manifestB,
                narrative: signal.payload.narrative,
                traceId: signal.payload.traceId,
                mitosisGroup: 'B',
            }),
        ]);
    }

    // ══════════════════════════════════════════════════════════
    // Private: 그리드 생성
    // ══════════════════════════════════════════════════════════

    /**
     * 엘리먼트 수 기반 그리드 크기 결정
     */
    private calculateGridSize(elementCount: number): { cols: number; rows: number } {
        if (elementCount <= COMPLEXITY_THRESHOLD.LOW) {
            return { cols: 2, rows: 2 };  // 4구역
        } else if (elementCount <= COMPLEXITY_THRESHOLD.MID) {
            return { cols: 3, rows: 2 };  // 6구역
        } else {
            return { cols: 3, rows: 3 };  // 9구역
        }
    }

    /**
     * Grid 기반 구역 생성
     * Y축(높이)은 전체 높이를 공유, XZ 평면만 분할
     */
    private createGrid(
        dims: ScenarioData['dimensions'],
        cols: number,
        rows: number
    ): Zone[] {
        const zones: Zone[] = [];
        const cellWidth = dims.width / cols;
        const cellDepth = dims.depth / rows;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const zoneIndex = row * cols + col;
                const isCenterZone = this.isCenterZone(col, row, cols, rows);

                zones.push({
                    id: `zone_${zoneIndex}`,
                    bounds: {
                        min: {
                            x: col * cellWidth - dims.width / 2,
                            y: 0,
                            z: row * cellDepth - dims.depth / 2,
                        },
                        max: {
                            x: (col + 1) * cellWidth - dims.width / 2,
                            y: dims.height,
                            z: (row + 1) * cellDepth - dims.depth / 2,
                        },
                    },
                    elements: [],
                    complexity: 0,
                    purpose: isCenterZone ? '중앙 포컬 구역' : '주변 구역',
                });
            }
        }

        return zones;
    }

    /**
     * 중앙 구역 판별 (포컬 오브젝트 우선 배치용)
     */
    private isCenterZone(col: number, row: number, cols: number, rows: number): boolean {
        const centerCol = Math.floor(cols / 2);
        const centerRow = Math.floor(rows / 2);
        return col === centerCol && row === centerRow;
    }

    // ══════════════════════════════════════════════════════════
    // Private: 엘리먼트 할당
    // ══════════════════════════════════════════════════════════

    /**
     * 역할 기반 엘리먼트-구역 할당
     *
     * - focal: 중앙 구역에 집중
     * - structural: 외곽 구역에 배치
     * - support: 가중치 기반 분산
     * - ambient: 전체 구역에 균등 분배
     */
    private assignElements(zones: Zone[], elements: ElementSpec[]): void {
        const centerZones = zones.filter(z => z.purpose === '중앙 포컬 구역');
        const outerZones = zones.filter(z => z.purpose !== '중앙 포컬 구역');

        for (const element of elements) {
            switch (element.role) {
                case 'focal':
                    // 포컬 → 중앙 구역에 집중
                    this.assignToZones(centerZones.length > 0 ? centerZones : zones, element);
                    break;

                case 'structural':
                    // 구조물 → 외곽 구역 우선
                    this.assignToZones(outerZones.length > 0 ? outerZones : zones, element);
                    break;

                case 'support':
                    // 지원 → 가중치 기반 분산 (복잡도 낮은 구역 우선)
                    this.assignToLeastComplex(zones, element);
                    break;

                case 'ambient':
                    // 분위기 → 전체 구역에 균등 분배
                    this.distributeEvenly(zones, element);
                    break;
            }
        }

        // 복잡도 재계산
        for (const zone of zones) {
            zone.complexity = this.calculateZoneComplexity(zone);
        }
    }

    /**
     * 특정 구역 그룹에 엘리먼트 할당 (라운드 로빈)
     */
    private assignToZones(targetZones: Zone[], element: ElementSpec): void {
        if (targetZones.length === 0) return;

        // 포컬은 단일 구역, 나머지는 라운드 로빈
        if (element.role === 'focal') {
            targetZones[0].elements.push(element);
        } else {
            // 가장 여유 있는 구역에 할당
            const least = targetZones.reduce((a, b) =>
                a.elements.length <= b.elements.length ? a : b
            );
            least.elements.push(element);
        }
    }

    /**
     * 복잡도가 가장 낮은 구역에 할당
     */
    private assignToLeastComplex(zones: Zone[], element: ElementSpec): void {
        const least = zones.reduce((a, b) =>
            a.elements.length <= b.elements.length ? a : b
        );
        least.elements.push(element);
    }

    /**
     * ambient 엘리먼트를 전체 구역에 균등 분배
     * quantity에 따라 각 구역에 나눔
     */
    private distributeEvenly(zones: Zone[], element: ElementSpec): void {
        if (element.quantity <= zones.length) {
            // 수량이 적으면 순서대로 1개씩
            for (let i = 0; i < element.quantity && i < zones.length; i++) {
                zones[i].elements.push({
                    ...element,
                    quantity: 1,
                });
            }
        } else {
            // 수량이 많으면 균등 분할
            const perZone = Math.ceil(element.quantity / zones.length);
            let remaining = element.quantity;

            for (const zone of zones) {
                const assign = Math.min(perZone, remaining);
                if (assign > 0) {
                    zone.elements.push({
                        ...element,
                        quantity: assign,
                    });
                    remaining -= assign;
                }
            }
        }
    }

    // ══════════════════════════════════════════════════════════
    // Private: 복잡도 계산
    // ══════════════════════════════════════════════════════════

    /**
     * 씬 전체 복잡도 (0~1)
     */
    private calculateComplexity(elements: ElementSpec[]): number {
        const totalQuantity = elements.reduce((sum, e) => sum + e.quantity, 0);
        const focalCount = elements.filter(e => e.role === 'focal').length;
        const constraintCount = elements.reduce(
            (sum, e) => sum + (e.constraints?.length || 0), 0
        );

        // 정규화: 오브젝트 수 + 포컬 비율 + 제약조건 밀도
        const quantityScore = Math.min(totalQuantity / 30, 1.0);
        const focalScore = Math.min(focalCount / 5, 1.0);
        const constraintScore = Math.min(constraintCount / 20, 1.0);

        return quantityScore * 0.5 + focalScore * 0.3 + constraintScore * 0.2;
    }

    /**
     * 개별 구역 복잡도 (0~1)
     */
    private calculateZoneComplexity(zone: Zone): number {
        const totalQuantity = zone.elements.reduce((sum, e) => sum + e.quantity, 0);
        return Math.min(totalQuantity / 10, 1.0);
    }
}
