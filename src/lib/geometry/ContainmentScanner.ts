/**
 * ContainmentScanner.ts
 * 
 * Phase A: 위상학적 내부 판별 (Point-in-Mesh)
 * 
 * 핵심 기능:
 * 1. Ray Parity Algorithm (홀짝 규칙)
 * 2. 다중 샘플링 다수결 투표
 * 3. 접선 교차 문제 회피
 * 
 * 참조: Phase A 기술 설계 보고서 Section 6
 */

import * as THREE from 'three';

// ============================================
// 타입 정의
// ============================================

/** 내부 판별 결과 */
export interface ContainmentResult {
    isInside: boolean;
    confidence: number;      // 0~1, 판정 신뢰도
    rayResults: boolean[];   // 각 Ray별 결과
}

/** 스캐너 설정 */
export interface ContainmentScannerOptions {
    /** 검사에 사용할 Ray 방향 수 (다다익선, 기본 7) */
    numRays: number;
    /** 신뢰도 임계값 (이 이상이면 확정) */
    confidenceThreshold: number;
    /** 양면 렌더링 강제 여부 */
    forceDoubleSide: boolean;
}

// ============================================
// 기본 설정
// ============================================

const DEFAULT_OPTIONS: ContainmentScannerOptions = {
    numRays: 7,
    confidenceThreshold: 0.7,
    forceDoubleSide: true
};

/** 다양한 검사 방향 (접선 문제 회피용) */
const DEFAULT_DIRECTIONS: THREE.Vector3[] = [
    new THREE.Vector3(1, 0, 0),           // +X
    new THREE.Vector3(-1, 0, 0),          // -X
    new THREE.Vector3(0, 1, 0),           // +Y
    new THREE.Vector3(0, -1, 0),          // -Y
    new THREE.Vector3(0, 0, 1),           // +Z
    new THREE.Vector3(0, 0, -1),          // -Z
    new THREE.Vector3(1, 1, 1).normalize(),     // 대각선 1
    new THREE.Vector3(-1, 1, -1).normalize(),   // 대각선 2
    new THREE.Vector3(1, -1, 1).normalize(),    // 대각선 3
];

// ============================================
// ContainmentScanner 클래스
// ============================================

/**
 * 위상학적 내부 판별 스캐너
 * 
 * Ray Parity Algorithm + Multi-sampling 다수결 투표 방식
 */
export class ContainmentScanner {
    private raycaster: THREE.Raycaster;
    private directions: THREE.Vector3[];
    private options: ContainmentScannerOptions;

    constructor(options: Partial<ContainmentScannerOptions> = {}) {
        this.raycaster = new THREE.Raycaster();
        this.options = { ...DEFAULT_OPTIONS, ...options };

        // 사용할 방향 벡터 설정
        this.directions = DEFAULT_DIRECTIONS.slice(0, this.options.numRays);
    }

    /**
     * 특정 점이 메시 내부에 있는지 판별
     * 
     * 다수결 투표(Majority Vote) 방식 사용
     * 
     * @param point 검사할 점 (월드 좌표)
     * @param mesh 대상 메시
     */
    isPointInside(point: THREE.Vector3, mesh: THREE.Mesh): boolean {
        const result = this.scan(point, mesh);
        return result.isInside;
    }

    /**
     * 상세 스캔 결과 반환
     */
    scan(point: THREE.Vector3, mesh: THREE.Mesh): ContainmentResult {
        let insideCount = 0;
        const rayResults: boolean[] = [];

        // 양면 렌더링 설정 저장 및 변경
        const originalSide = this.getMaterialSide(mesh);
        if (this.options.forceDoubleSide) {
            this.setMaterialSide(mesh, THREE.DoubleSide);
        }

        for (const dir of this.directions) {
            this.raycaster.set(point, dir);
            const intersects = this.raycaster.intersectObject(mesh, false);

            // 교차 횟수가 홀수이면 내부
            const isInside = intersects.length % 2 !== 0;
            rayResults.push(isInside);

            if (isInside) {
                insideCount++;
            }
        }

        // 상태 복구
        if (this.options.forceDoubleSide) {
            this.setMaterialSide(mesh, originalSide);
        }

        // 다수결 판정
        const confidence = insideCount / this.directions.length;
        const isInside = confidence >= this.options.confidenceThreshold;

        return {
            isInside,
            confidence,
            rayResults
        };
    }

    /**
     * 여러 점에 대한 배치 스캔
     */
    scanPoints(points: THREE.Vector3[], mesh: THREE.Mesh): ContainmentResult[] {
        return points.map(p => this.scan(p, mesh));
    }

    /**
     * 메시 그룹(여러 메시로 구성된 공간)에 대한 내부 판별
     */
    isPointInsideGroup(point: THREE.Vector3, meshes: THREE.Mesh[]): boolean {
        // 하나라도 내부이면 내부로 판정
        for (const mesh of meshes) {
            if (this.isPointInside(point, mesh)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 공간의 대략적인 부피 추정 (몬테카를로 샘플링)
     * 
     * @param bounds 샘플링 영역
     * @param mesh 대상 메시
     * @param sampleCount 샘플 수 (많을수록 정확)
     */
    estimateVolume(
        bounds: THREE.Box3,
        mesh: THREE.Mesh,
        sampleCount: number = 1000
    ): number {
        const size = new THREE.Vector3();
        bounds.getSize(size);
        const boundsVolume = size.x * size.y * size.z;

        let insideCount = 0;
        const sample = new THREE.Vector3();

        for (let i = 0; i < sampleCount; i++) {
            // 랜덤 샘플링
            sample.set(
                bounds.min.x + Math.random() * size.x,
                bounds.min.y + Math.random() * size.y,
                bounds.min.z + Math.random() * size.z
            );

            // 빠른 판별 (단일 Ray만 사용)
            this.raycaster.set(sample, this.directions[0]);
            const intersects = this.raycaster.intersectObject(mesh, false);

            if (intersects.length % 2 !== 0) {
                insideCount++;
            }
        }

        return boundsVolume * (insideCount / sampleCount);
    }

    /**
     * 메시가 Watertight(구멍 없는 닫힌 형태)인지 검증
     * 
     * 완벽한 검증은 아니지만 대략적인 추정 가능
     */
    isWatertight(mesh: THREE.Mesh, sampleCount: number = 100): boolean {
        const bounds = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        bounds.getSize(size);

        let consistentResults = 0;
        const sample = new THREE.Vector3();

        for (let i = 0; i < sampleCount; i++) {
            sample.set(
                bounds.min.x + Math.random() * size.x,
                bounds.min.y + Math.random() * size.y,
                bounds.min.z + Math.random() * size.z
            );

            const result = this.scan(sample, mesh);

            // 모든 Ray가 일치하면 일관성 있음
            const allSame = result.rayResults.every(r => r === result.rayResults[0]);
            if (allSame) {
                consistentResults++;
            }
        }

        // 90% 이상 일관성이면 Watertight로 간주
        return (consistentResults / sampleCount) > 0.9;
    }

    // ============================================
    // 유틸리티 메서드
    // ============================================

    private getMaterialSide(mesh: THREE.Mesh): THREE.Side {
        if (mesh.material instanceof THREE.Material) {
            return mesh.material.side;
        }
        return THREE.FrontSide;
    }

    private setMaterialSide(mesh: THREE.Mesh, side: THREE.Side): void {
        if (mesh.material instanceof THREE.Material) {
            mesh.material.side = side;
        } else if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => {
                if (m instanceof THREE.Material) {
                    m.side = side;
                }
            });
        }
    }

    /**
     * 랜덤 방향 벡터 생성 (균일 구면 분포)
     */
    private generateRandomDirection(): THREE.Vector3 {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        return new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi)
        );
    }

    /**
     * 검사 방향 재설정 (랜덤화)
     */
    randomizeDirections(): void {
        this.directions = [];
        for (let i = 0; i < this.options.numRays; i++) {
            this.directions.push(this.generateRandomDirection());
        }
    }
}

// ============================================
// 정적 유틸리티 함수
// ============================================

/**
 * 간단한 내부 판별 (단일 Ray)
 */
export function quickContainmentCheck(
    point: THREE.Vector3,
    mesh: THREE.Mesh,
    direction: THREE.Vector3 = new THREE.Vector3(1, 0, 0)
): boolean {
    const raycaster = new THREE.Raycaster();
    raycaster.set(point, direction.clone().normalize());

    const intersects = raycaster.intersectObject(mesh, false);
    return intersects.length % 2 !== 0;
}

/**
 * Room 배열에서 점이 속한 Room 찾기
 */
export function findContainingRoom(
    point: THREE.Vector3,
    rooms: THREE.Mesh[]
): THREE.Mesh | null {
    const scanner = new ContainmentScanner({ numRays: 3 });

    for (const room of rooms) {
        if (scanner.isPointInside(point, room)) {
            return room;
        }
    }

    return null;
}

// ============================================
// Export
// ============================================

export default ContainmentScanner;
