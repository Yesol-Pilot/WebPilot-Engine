/**
 * SpatialArranger.ts - v4.5 (Intelligent Grouping & Alignment)
 * 
 * 단순 랜덤 배치가 아닌 '관계성'과 '정렬' 중심의 배치 엔진.
 * 
 * 1. Environment: (0,0,0) 고정
 * 2. Anchors: 대형 가구 (테이블 등) -> 중앙/벽면 배치 (정확한 회전)
 * 3. Satellites: 보조 가구 (의자) -> Anchor 주변 배치 + LookAt
 * 4. Props: 소품 -> Anchor 위(Surface) 정확한 적층
 */

import { AssetMetadata } from '@/data/AssetRegistry';

export interface PlacedObject {
    id: string;
    assetId: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    metadata: AssetMetadata;
}

const SCENE_SIZE = 18; // 20에서 약간 여유 둠
const WALL_OFFSET = SCENE_SIZE / 2 - 1.5; // 벽에서 약간 뗌

// 배치 요청 래퍼
interface AssetRequest {
    asset: AssetMetadata;
    id: string;
}

export function arrangeScene(requests: AssetRequest[]): PlacedObject[] {
    const placedObjects: PlacedObject[] = [];
    const remainingRequests = [...requests];

    // --- Pass 1: Environment (무조건 0,0,0) ---
    const envIndex = remainingRequests.findIndex(r => r.asset.category === 'environment');
    if (envIndex !== -1) {
        const req = remainingRequests.splice(envIndex, 1)[0];
        placedObjects.push(createPlacedObject(req, [0, 0, 0], [0, 0, 0]));
    }

    // --- Pass 2: Large Furniture (Anchors) ---
    // 테이블류(중앙)와 책장류(벽면) 분리
    const tables = filterAndExtract(remainingRequests, r =>
        r.asset.category === 'large_furniture' &&
        (r.asset.id.includes('table') || r.asset.id.includes('desk') || r.asset.id.includes('piano'))
    );

    const wallItems = filterAndExtract(remainingRequests, r =>
        r.asset.category === 'large_furniture' || r.asset.category === 'structure' ||
        (r.asset.category === 'small_furniture' && r.asset.placement.zone === 'perimeter')
    );

    // 2-1. 메인 테이블 배치 (정중앙)
    if (tables.length > 0) {
        const mainTable = tables.shift()!;
        // 정중앙 혹은 약간 오프셋
        const pos: [number, number, number] = [0, mainTable.asset.placement.groundOffset, 0];
        // 테이블은 대개 정면(0) 혹은 90도
        const rot: [number, number, number] = [0, Math.random() > 0.5 ? 0 : Math.PI / 2, 0];
        placedObjects.push(createPlacedObject(mainTable, pos, rot));
    }

    // 2-2. 나머지 테이블/가구 배치 (중앙 주변)
    for (const table of tables) {
        // 충돌 피해서 배치
        const pos = findValidPosition(table.asset, placedObjects, 'center');
        if (pos) {
            placedObjects.push(createPlacedObject(table, pos, [0, Math.random() * Math.PI * 2, 0]));
        }
    }

    // 2-3. 벽면 가구 배치 (책장 등) - 정렬 필수
    for (const item of wallItems) {
        const placement = findWallPosition(item.asset, placedObjects);
        if (placement) {
            placedObjects.push(createPlacedObject(item, placement.p, placement.r));
        }
    }

    // --- Pass 3: Satellites (의자 -> 테이블 주변) ---
    const chairs = filterAndExtract(remainingRequests, r =>
        r.asset.category === 'small_furniture' && r.asset.id.includes('chair')
    );

    // 배치된 테이블 찾기
    const placedTables = placedObjects.filter(o =>
        o.metadata.category === 'large_furniture' &&
        (o.metadata.id.includes('table') || o.metadata.id.includes('desk'))
    );

    for (const chair of chairs) {
        let placed = false;
        // 테이블 주변 슬롯 찾기
        for (const table of placedTables) {
            // 테이블 주변 4방향 + 대각선 시도
            const slot = findChairSlot(chair.asset, table, placedObjects);
            if (slot) {
                placedObjects.push(createPlacedObject(chair, slot.p, slot.r));
                placed = true;
                break;
            }
        }
        // 테이블 자리가 없으면 그냥 빈곳에
        if (!placed) {
            const pos = findValidPosition(chair.asset, placedObjects, 'any');
            if (pos) placedObjects.push(createPlacedObject(chair, pos, [0, Math.random() * Math.PI * 2, 0]));
        }
    }

    // --- Pass 4: Props (소품 -> 테이블 위) ---
    const props = filterAndExtract(remainingRequests, r => r.asset.category === 'prop');

    for (const prop of props) {
        // use 'on_surface' logic
        const surface = findSurface(placedObjects);
        if (surface) {
            // 테이블 상판 높이 계산 (y + height) - 약간의 여유값 빼기
            // boundingBox height가 전체 높이라고 가정. surface center y는 바닥(0)일수도 있고 중심일수도 있음.
            // 보통 position y는 바닥 기준 0.
            const surfaceY = surface.position[1] + surface.metadata.boundingBox.height;

            // 테이블 면적 내 랜덤 (margin 20%)
            const w = surface.metadata.boundingBox.width * 0.6;
            const d = surface.metadata.boundingBox.depth * 0.6;

            const px = surface.position[0] + (Math.random() - 0.5) * w;
            const pz = surface.position[2] + (Math.random() - 0.5) * d;

            const pos: [number, number, number] = [px, surfaceY, pz];
            const rot: [number, number, number] = [0, Math.random() * Math.PI * 2, 0];

            placedObjects.push(createPlacedObject(prop, pos, rot));
        } else {
            // 바닥에 배치
            const pos = findValidPosition(prop.asset, placedObjects, 'any');
            if (pos) placedObjects.push(createPlacedObject(prop, pos, [0, Math.random() * Math.PI * 2, 0]));
        }
    }

    // --- Pass 5: Remaining (Fillers) ---
    for (const req of remainingRequests) {
        const pos = findValidPosition(req.asset, placedObjects, 'any');
        if (pos) {
            const rot: [number, number, number] = [0, Math.random() * Math.PI * 2, 0];
            // 캐릭터/유령은 좀 더 높게
            if (req.asset.category === 'character' && req.asset.id === 'ghost') {
                pos[1] += 1.5;
            }
            placedObjects.push(createPlacedObject(req, pos, rot));
        }
    }

    return placedObjects;
}

// === Helpers ===

function createPlacedObject(req: AssetRequest, p: number[], r: number[]): PlacedObject {
    return {
        id: req.id,
        assetId: req.asset.id,
        position: p as [number, number, number],
        rotation: r as [number, number, number],
        scale: [req.asset.normalizedScale, req.asset.normalizedScale, req.asset.normalizedScale],
        metadata: req.asset
    };
}

function filterAndExtract(list: AssetRequest[], predicate: (r: AssetRequest) => boolean): AssetRequest[] {
    const result: AssetRequest[] = [];
    // 역순 순회하여 안전하게 삭제
    for (let i = list.length - 1; i >= 0; i--) {
        if (predicate(list[i])) {
            result.push(list[i]);
            list.splice(i, 1);
        }
    }
    return result;
}

function findValidPosition(
    asset: AssetMetadata,
    others: PlacedObject[],
    zone: 'center' | 'any'
): [number, number, number] | null {
    for (let i = 0; i < 20; i++) {
        const range = zone === 'center' ? SCENE_SIZE * 0.4 : SCENE_SIZE * 0.8;
        const x = (Math.random() - 0.5) * range;
        const z = (Math.random() - 0.5) * range;
        const pos: [number, number, number] = [x, asset.placement.groundOffset, z];

        if (!checkCollision(pos, asset, others)) return pos;
    }
    return null;
}

function findWallPosition(asset: AssetMetadata, others: PlacedObject[]): { p: [number, number, number], r: [number, number, number] } | null {
    // 4면 중 하나 선택 (North, East, South, West)
    const walls = [
        { dir: [0, 0, -1], pos: [0, 0, -WALL_OFFSET], rot: [0, 0, 0] },          // North (Z-)
        { dir: [1, 0, 0], pos: [WALL_OFFSET, 0, 0], rot: [0, -Math.PI / 2, 0] }, // East (X+)
        { dir: [0, 0, 1], pos: [0, 0, WALL_OFFSET], rot: [0, Math.PI, 0] },      // South (Z+)
        { dir: [-1, 0, 0], pos: [-WALL_OFFSET, 0, 0], rot: [0, Math.PI / 2, 0] } // West (X-)
    ];

    // 랜덤 셔플
    walls.sort(() => 0.5 - Math.random());

    for (const wall of walls) {
        // 벽면 라인 상에서 랜덤 위치 (가로 길이 고려)
        // 벽이 Z축에 수직이면 X축으로 이동, X축에 수직이면 Z축으로 이동
        const isZAxis = wall.dir[2] !== 0; // North/South

        for (let i = 0; i < 5; i++) {
            const lateralOffset = (Math.random() - 0.5) * (SCENE_SIZE - 4); // 벽 길이 내
            const p: [number, number, number] = [...wall.pos] as any;

            if (isZAxis) p[0] += lateralOffset;
            else p[2] += lateralOffset;

            // 높이
            p[1] = asset.placement.groundOffset;

            if (!checkCollision(p, asset, others)) {
                return { p, r: wall.rot as any };
            }
        }
    }
    return null;
}

function findChairSlot(
    chair: AssetMetadata,
    table: PlacedObject,
    others: PlacedObject[]
): { p: [number, number, number], r: [number, number, number] } | null {

    // 테이블 주변 8방향 검색
    const tW = table.metadata.boundingBox.width;
    const tD = table.metadata.boundingBox.depth;

    const offset = 0.8; // 테이블에서 약간 띄움

    // 후보 위치들 (테이블 중심 기준)
    const candidates = [
        { x: 0, z: -(tD / 2 + offset), ry: 0 },          // North
        { x: 0, z: (tD / 2 + offset), ry: Math.PI },     // South
        { x: -(tW / 2 + offset), z: 0, ry: Math.PI / 2 },  // West
        { x: (tW / 2 + offset), z: 0, ry: -Math.PI / 2 },  // East
    ];

    // 셔플
    candidates.sort(() => 0.5 - Math.random());

    for (const cand of candidates) {
        const px = table.position[0] + cand.x;
        const pz = table.position[2] + cand.z;
        const p: [number, number, number] = [px, chair.placement.groundOffset, pz];

        if (!checkCollision(p, chair, others)) {
            return { p, r: [0, cand.ry, 0] }; // 테이블을 바라보게
        }
    }
    return null;
}

function findSurface(others: PlacedObject[]): PlacedObject | undefined {
    const surfaces = others.filter(o =>
        o.metadata.category === 'large_furniture' &&
        (o.metadata.id.includes('table') || o.metadata.id.includes('desk'))
    );
    if (!surfaces.length) return undefined;
    return surfaces[Math.floor(Math.random() * surfaces.length)];
}

function checkCollision(
    pos: [number, number, number],
    asset: AssetMetadata,
    others: PlacedObject[]
): boolean {
    const margin = 0.2; // 여유
    const r1 = Math.max(asset.boundingBox.width, asset.boundingBox.depth) / 2;

    for (const obj of others) {
        // 환경은 충돌 무시
        if (obj.metadata.category === 'environment') continue;

        // Prop이 Surface 위에 있을 때는 Surface와 충돌 무시
        if (asset.category === 'prop' && obj.metadata.category === 'large_furniture') {
            const dy = pos[1] - obj.position[1];
            // 대략 위에 있으면 무시 (높이차 > 0.5)
            if (dy > 0.5) continue;
        }

        const r2 = Math.max(obj.metadata.boundingBox.width, obj.metadata.boundingBox.depth) / 2;
        const dist = Math.sqrt(
            Math.pow(pos[0] - obj.position[0], 2) +
            Math.pow(pos[2] - obj.position[2], 2)
        );

        if (dist < (r1 + r2 + margin)) return true;
    }
    return false;
}
