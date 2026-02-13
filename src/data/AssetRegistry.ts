/**
 * AssetRegistry.ts (Auto-Generated via File Scan)
 * 로컬 파일 시스템의 에셋을 기반으로 생성됨.
 */

export interface AssetMetadata {
    id: string;
    path: string;
    category: 'environment' | 'large_furniture' | 'small_furniture' | 'prop' | 'character' | 'structure';
    keywords: string[];
    normalizedScale: number;
    placement: {
        zone: 'center' | 'perimeter' | 'corner' | 'any' | 'floating' | 'on_surface';
        groundOffset: number;
        minSpacing: number;
    };
    boundingBox: {
        width: number;
        height: number;
        depth: number;
    };
}

const ASSETS: AssetMetadata[] = [
    {
        id: 'local_0',
        path: '/models/buildings/both_houses_scene.glb', // both_houses_scene
        category: 'structure',
        keywords: ['both', 'houses', 'scene', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1',
        path: '/models/buildings/car-kit_debris-door-window.glb', // car-kit_debris-door-window
        category: 'structure',
        keywords: ['car', 'kit', 'debris', 'door', 'window', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_2',
        path: '/models/buildings/car-kit_debris-door.glb', // car-kit_debris-door
        category: 'structure',
        keywords: ['car', 'kit', 'debris', 'door', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_3',
        path: '/models/buildings/cellarDoor.glb', // cellarDoor
        category: 'structure',
        keywords: ['cellarDoor', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_4',
        path: '/models/buildings/detailed_realistic_model_houseelf_01.glb', // detailed_realistic_model_houseelf_01
        category: 'structure',
        keywords: ['detailed', 'realistic', 'model', 'houseelf', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_5',
        path: '/models/buildings/detailed_realistic_model_houseelf_02.glb', // detailed_realistic_model_houseelf_02
        category: 'structure',
        keywords: ['detailed', 'realistic', 'model', 'houseelf', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_6',
        path: '/models/buildings/detailed_realistic_model_house_01.glb', // detailed_realistic_model_house_01
        category: 'structure',
        keywords: ['detailed', 'realistic', 'model', 'house', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_7',
        path: '/models/buildings/dumbledores_office.glb', // dumbledores_office
        category: 'structure',
        keywords: ['dumbledores', 'office', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_8',
        path: '/models/buildings/fantasy-town-kit_balcony-wall-fence.glb', // fantasy-town-kit_balcony-wall-fence
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'balcony', 'wall', 'fence', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_9',
        path: '/models/buildings/fantasy-town-kit_balcony-wall.glb', // fantasy-town-kit_balcony-wall
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'balcony', 'wall', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_10',
        path: '/models/buildings/fantasy-town-kit_fence-broken.glb', // fantasy-town-kit_fence-broken
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'fence', 'broken', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_11',
        path: '/models/buildings/fantasy-town-kit_fence-curved.glb', // fantasy-town-kit_fence-curved
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'fence', 'curved', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_12',
        path: '/models/buildings/fantasy-town-kit_fence-gate.glb', // fantasy-town-kit_fence-gate
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'fence', 'gate', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_13',
        path: '/models/buildings/fantasy-town-kit_fence.glb', // fantasy-town-kit_fence
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'fence', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_14',
        path: '/models/buildings/fantasy-town-kit_hedge-gate.glb', // fantasy-town-kit_hedge-gate
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'hedge', 'gate', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_15',
        path: '/models/buildings/fantasy-town-kit_hedge-large-gate.glb', // fantasy-town-kit_hedge-large-gate
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'hedge', 'large', 'gate', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_16',
        path: '/models/buildings/fantasy-town-kit_roof-corner-inner.glb', // fantasy-town-kit_roof-corner-inner
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'corner', 'inner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_17',
        path: '/models/buildings/fantasy-town-kit_roof-corner-round.glb', // fantasy-town-kit_roof-corner-round
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'corner', 'round', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_18',
        path: '/models/buildings/fantasy-town-kit_roof-corner.glb', // fantasy-town-kit_roof-corner
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'corner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_19',
        path: '/models/buildings/fantasy-town-kit_roof-flat.glb', // fantasy-town-kit_roof-flat
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'flat', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_20',
        path: '/models/buildings/fantasy-town-kit_roof-gable-detail.glb', // fantasy-town-kit_roof-gable-detail
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'gable', 'detail', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_21',
        path: '/models/buildings/fantasy-town-kit_roof-gable-end.glb', // fantasy-town-kit_roof-gable-end
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'gable', 'end', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_22',
        path: '/models/buildings/fantasy-town-kit_roof-gable-top.glb', // fantasy-town-kit_roof-gable-top
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'gable', 'top', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_23',
        path: '/models/buildings/fantasy-town-kit_roof-gable.glb', // fantasy-town-kit_roof-gable
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'gable', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_24',
        path: '/models/buildings/fantasy-town-kit_roof-high-corner-round.glb', // fantasy-town-kit_roof-high-corner-round
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'corner', 'round', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_25',
        path: '/models/buildings/fantasy-town-kit_roof-high-corner.glb', // fantasy-town-kit_roof-high-corner
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'corner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_26',
        path: '/models/buildings/fantasy-town-kit_roof-high-cornerinner.glb', // fantasy-town-kit_roof-high-cornerinner
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'cornerinner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_27',
        path: '/models/buildings/fantasy-town-kit_roof-high-flat.glb', // fantasy-town-kit_roof-high-flat
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'flat', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_28',
        path: '/models/buildings/fantasy-town-kit_roof-high-gable-detail.glb', // fantasy-town-kit_roof-high-gable-detail
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'gable', 'detail', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_29',
        path: '/models/buildings/fantasy-town-kit_roof-high-gable-end.glb', // fantasy-town-kit_roof-high-gable-end
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'gable', 'end', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_30',
        path: '/models/buildings/fantasy-town-kit_roof-high-gable-top.glb', // fantasy-town-kit_roof-high-gable-top
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'gable', 'top', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_31',
        path: '/models/buildings/fantasy-town-kit_roof-high-gable.glb', // fantasy-town-kit_roof-high-gable
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'gable', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_32',
        path: '/models/buildings/fantasy-town-kit_roof-high-left.glb', // fantasy-town-kit_roof-high-left
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'left', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_33',
        path: '/models/buildings/fantasy-town-kit_roof-high-point.glb', // fantasy-town-kit_roof-high-point
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'point', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_34',
        path: '/models/buildings/fantasy-town-kit_roof-high-right.glb', // fantasy-town-kit_roof-high-right
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'right', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_35',
        path: '/models/buildings/fantasy-town-kit_roof-high-window.glb', // fantasy-town-kit_roof-high-window
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'window', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_36',
        path: '/models/buildings/fantasy-town-kit_roof-high.glb', // fantasy-town-kit_roof-high
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'high', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_37',
        path: '/models/buildings/fantasy-town-kit_roof-left.glb', // fantasy-town-kit_roof-left
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'left', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_38',
        path: '/models/buildings/fantasy-town-kit_roof-point.glb', // fantasy-town-kit_roof-point
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'point', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_39',
        path: '/models/buildings/fantasy-town-kit_roof-right.glb', // fantasy-town-kit_roof-right
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'right', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_40',
        path: '/models/buildings/fantasy-town-kit_roof-window.glb', // fantasy-town-kit_roof-window
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'window', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_41',
        path: '/models/buildings/fantasy-town-kit_roof.glb', // fantasy-town-kit_roof
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'roof', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_42',
        path: '/models/buildings/fantasy-town-kit_wall-arch-top-detail.glb', // fantasy-town-kit_wall-arch-top-detail
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'arch', 'top', 'detail', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_43',
        path: '/models/buildings/fantasy-town-kit_wall-arch-top.glb', // fantasy-town-kit_wall-arch-top
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'arch', 'top', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_44',
        path: '/models/buildings/fantasy-town-kit_wall-arch.glb', // fantasy-town-kit_wall-arch
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'arch', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_45',
        path: '/models/buildings/fantasy-town-kit_wall-block-half.glb', // fantasy-town-kit_wall-block-half
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'block', 'half', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_46',
        path: '/models/buildings/fantasy-town-kit_wall-block.glb', // fantasy-town-kit_wall-block
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'block', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_47',
        path: '/models/buildings/fantasy-town-kit_wall-broken.glb', // fantasy-town-kit_wall-broken
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'broken', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_48',
        path: '/models/buildings/fantasy-town-kit_wall-corner-detail.glb', // fantasy-town-kit_wall-corner-detail
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'corner', 'detail', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_49',
        path: '/models/buildings/fantasy-town-kit_wall-corner-diagonal-half.glb', // fantasy-town-kit_wall-corner-diagonal-half
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'corner', 'diagonal', 'half', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_50',
        path: '/models/buildings/fantasy-town-kit_wall-corner-diagonal.glb', // fantasy-town-kit_wall-corner-diagonal
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'corner', 'diagonal', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_51',
        path: '/models/buildings/fantasy-town-kit_wall-corner-edge.glb', // fantasy-town-kit_wall-corner-edge
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'corner', 'edge', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_52',
        path: '/models/buildings/fantasy-town-kit_wall-corner.glb', // fantasy-town-kit_wall-corner
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'corner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_53',
        path: '/models/buildings/fantasy-town-kit_wall-curved.glb', // fantasy-town-kit_wall-curved
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'curved', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_54',
        path: '/models/buildings/fantasy-town-kit_wall-detail-cross.glb', // fantasy-town-kit_wall-detail-cross
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'detail', 'cross', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_55',
        path: '/models/buildings/fantasy-town-kit_wall-detail-diagonal.glb', // fantasy-town-kit_wall-detail-diagonal
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'detail', 'diagonal', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_56',
        path: '/models/buildings/fantasy-town-kit_wall-detail-horizontal.glb', // fantasy-town-kit_wall-detail-horizontal
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'detail', 'horizontal', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_57',
        path: '/models/buildings/fantasy-town-kit_wall-diagonal.glb', // fantasy-town-kit_wall-diagonal
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'diagonal', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_58',
        path: '/models/buildings/fantasy-town-kit_wall-door.glb', // fantasy-town-kit_wall-door
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'door', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_59',
        path: '/models/buildings/fantasy-town-kit_wall-doorway-base.glb', // fantasy-town-kit_wall-doorway-base
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'doorway', 'base', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_60',
        path: '/models/buildings/fantasy-town-kit_wall-doorway-round.glb', // fantasy-town-kit_wall-doorway-round
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'doorway', 'round', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_61',
        path: '/models/buildings/fantasy-town-kit_wall-doorway-square-wide-curved.glb', // fantasy-town-kit_wall-doorway-square-wide-curved
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'doorway', 'square', 'wide', 'curved', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_62',
        path: '/models/buildings/fantasy-town-kit_wall-doorway-square-wide.glb', // fantasy-town-kit_wall-doorway-square-wide
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'doorway', 'square', 'wide', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_63',
        path: '/models/buildings/fantasy-town-kit_wall-doorway-square.glb', // fantasy-town-kit_wall-doorway-square
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'doorway', 'square', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_64',
        path: '/models/buildings/fantasy-town-kit_wall-half.glb', // fantasy-town-kit_wall-half
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'half', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_65',
        path: '/models/buildings/fantasy-town-kit_wall-rounded.glb', // fantasy-town-kit_wall-rounded
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'rounded', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_66',
        path: '/models/buildings/fantasy-town-kit_wall-side.glb', // fantasy-town-kit_wall-side
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'side', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_67',
        path: '/models/buildings/fantasy-town-kit_wall-slope.glb', // fantasy-town-kit_wall-slope
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'slope', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_68',
        path: '/models/buildings/fantasy-town-kit_wall-window-glass.glb', // fantasy-town-kit_wall-window-glass
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'window', 'glass', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_69',
        path: '/models/buildings/fantasy-town-kit_wall-window-round.glb', // fantasy-town-kit_wall-window-round
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'window', 'round', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_70',
        path: '/models/buildings/fantasy-town-kit_wall-window-shutters.glb', // fantasy-town-kit_wall-window-shutters
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'window', 'shutters', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_71',
        path: '/models/buildings/fantasy-town-kit_wall-window-small.glb', // fantasy-town-kit_wall-window-small
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'window', 'small', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_72',
        path: '/models/buildings/fantasy-town-kit_wall-wood-arch-top-detail.glb', // fantasy-town-kit_wall-wood-arch-top-detail
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'arch', 'top', 'detail', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_73',
        path: '/models/buildings/fantasy-town-kit_wall-wood-arch-top.glb', // fantasy-town-kit_wall-wood-arch-top
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'arch', 'top', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_74',
        path: '/models/buildings/fantasy-town-kit_wall-wood-arch.glb', // fantasy-town-kit_wall-wood-arch
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'arch', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_75',
        path: '/models/buildings/fantasy-town-kit_wall-wood-block-half.glb', // fantasy-town-kit_wall-wood-block-half
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'block', 'half', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_76',
        path: '/models/buildings/fantasy-town-kit_wall-wood-block.glb', // fantasy-town-kit_wall-wood-block
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'block', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_77',
        path: '/models/buildings/fantasy-town-kit_wall-wood-broken.glb', // fantasy-town-kit_wall-wood-broken
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'broken', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_78',
        path: '/models/buildings/fantasy-town-kit_wall-wood-corner-diagonal-half.glb', // fantasy-town-kit_wall-wood-corner-diagonal-half
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'corner', 'diagonal', 'half', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_79',
        path: '/models/buildings/fantasy-town-kit_wall-wood-corner-diagonal.glb', // fantasy-town-kit_wall-wood-corner-diagonal
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'corner', 'diagonal', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_80',
        path: '/models/buildings/fantasy-town-kit_wall-wood-corner-edge.glb', // fantasy-town-kit_wall-wood-corner-edge
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'corner', 'edge', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_81',
        path: '/models/buildings/fantasy-town-kit_wall-wood-corner.glb', // fantasy-town-kit_wall-wood-corner
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'corner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_82',
        path: '/models/buildings/fantasy-town-kit_wall-wood-curved.glb', // fantasy-town-kit_wall-wood-curved
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'curved', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_83',
        path: '/models/buildings/fantasy-town-kit_wall-wood-detail-cross.glb', // fantasy-town-kit_wall-wood-detail-cross
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'detail', 'cross', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_84',
        path: '/models/buildings/fantasy-town-kit_wall-wood-detail-diagonal.glb', // fantasy-town-kit_wall-wood-detail-diagonal
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'detail', 'diagonal', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_85',
        path: '/models/buildings/fantasy-town-kit_wall-wood-detail-horizontal.glb', // fantasy-town-kit_wall-wood-detail-horizontal
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'detail', 'horizontal', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_86',
        path: '/models/buildings/fantasy-town-kit_wall-wood-diagonal.glb', // fantasy-town-kit_wall-wood-diagonal
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'diagonal', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_87',
        path: '/models/buildings/fantasy-town-kit_wall-wood-door.glb', // fantasy-town-kit_wall-wood-door
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'door', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_88',
        path: '/models/buildings/fantasy-town-kit_wall-wood-doorway-base.glb', // fantasy-town-kit_wall-wood-doorway-base
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'doorway', 'base', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_89',
        path: '/models/buildings/fantasy-town-kit_wall-wood-doorway-round.glb', // fantasy-town-kit_wall-wood-doorway-round
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'doorway', 'round', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_90',
        path: '/models/buildings/fantasy-town-kit_wall-wood-doorway-square-wide-curved.glb', // fantasy-town-kit_wall-wood-doorway-square-wide-curved
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'doorway', 'square', 'wide', 'curved', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_91',
        path: '/models/buildings/fantasy-town-kit_wall-wood-doorway-square-wide.glb', // fantasy-town-kit_wall-wood-doorway-square-wide
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'doorway', 'square', 'wide', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_92',
        path: '/models/buildings/fantasy-town-kit_wall-wood-doorway-square.glb', // fantasy-town-kit_wall-wood-doorway-square
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'doorway', 'square', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_93',
        path: '/models/buildings/fantasy-town-kit_wall-wood-half.glb', // fantasy-town-kit_wall-wood-half
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'half', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_94',
        path: '/models/buildings/fantasy-town-kit_wall-wood-rounded.glb', // fantasy-town-kit_wall-wood-rounded
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'rounded', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_95',
        path: '/models/buildings/fantasy-town-kit_wall-wood-side.glb', // fantasy-town-kit_wall-wood-side
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'side', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_96',
        path: '/models/buildings/fantasy-town-kit_wall-wood-slope.glb', // fantasy-town-kit_wall-wood-slope
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'slope', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_97',
        path: '/models/buildings/fantasy-town-kit_wall-wood-window-glass.glb', // fantasy-town-kit_wall-wood-window-glass
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'window', 'glass', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_98',
        path: '/models/buildings/fantasy-town-kit_wall-wood-window-round.glb', // fantasy-town-kit_wall-wood-window-round
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'window', 'round', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_99',
        path: '/models/buildings/fantasy-town-kit_wall-wood-window-shutters.glb', // fantasy-town-kit_wall-wood-window-shutters
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'window', 'shutters', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_100',
        path: '/models/buildings/fantasy-town-kit_wall-wood-window-small.glb', // fantasy-town-kit_wall-wood-window-small
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'window', 'small', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_101',
        path: '/models/buildings/fantasy-town-kit_wall-wood.glb', // fantasy-town-kit_wall-wood
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_102',
        path: '/models/buildings/fantasy-town-kit_wall.glb', // fantasy-town-kit_wall
        category: 'structure',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_103',
        path: '/models/buildings/fence.glb', // fence
        category: 'structure',
        keywords: ['fence', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_104',
        path: '/models/buildings/fenceACorner1.glb', // fenceACorner1
        category: 'structure',
        keywords: ['fenceACorner1', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_105',
        path: '/models/buildings/fenceACorner2.glb', // fenceACorner2
        category: 'structure',
        keywords: ['fenceACorner2', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_106',
        path: '/models/buildings/fenceACorner3.glb', // fenceACorner3
        category: 'structure',
        keywords: ['fenceACorner3', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_107',
        path: '/models/buildings/fenceACorner4.glb', // fenceACorner4
        category: 'structure',
        keywords: ['fenceACorner4', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_108',
        path: '/models/buildings/fenceAGate.glb', // fenceAGate
        category: 'structure',
        keywords: ['fenceAGate', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_109',
        path: '/models/buildings/fenceAPillar1.glb', // fenceAPillar1
        category: 'structure',
        keywords: ['fenceAPillar1', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_110',
        path: '/models/buildings/fenceAPillar2.glb', // fenceAPillar2
        category: 'structure',
        keywords: ['fenceAPillar2', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_111',
        path: '/models/buildings/fenceAPillar3.glb', // fenceAPillar3
        category: 'structure',
        keywords: ['fenceAPillar3', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_112',
        path: '/models/buildings/fenceAPillar4.glb', // fenceAPillar4
        category: 'structure',
        keywords: ['fenceAPillar4', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_113',
        path: '/models/buildings/fenceAPillar5.glb', // fenceAPillar5
        category: 'structure',
        keywords: ['fenceAPillar5', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_114',
        path: '/models/buildings/fenceAPillar6.glb', // fenceAPillar6
        category: 'structure',
        keywords: ['fenceAPillar6', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_115',
        path: '/models/buildings/fenceAPillar7.glb', // fenceAPillar7
        category: 'structure',
        keywords: ['fenceAPillar7', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_116',
        path: '/models/buildings/fenceAPillar8.glb', // fenceAPillar8
        category: 'structure',
        keywords: ['fenceAPillar8', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_117',
        path: '/models/buildings/fenceASection1.glb', // fenceASection1
        category: 'structure',
        keywords: ['fenceASection1', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_118',
        path: '/models/buildings/fenceASection2.glb', // fenceASection2
        category: 'structure',
        keywords: ['fenceASection2', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_119',
        path: '/models/buildings/fenceASection3.glb', // fenceASection3
        category: 'structure',
        keywords: ['fenceASection3', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_120',
        path: '/models/buildings/fenceASection4.glb', // fenceASection4
        category: 'structure',
        keywords: ['fenceASection4', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_121',
        path: '/models/buildings/fenceASection5.glb', // fenceASection5
        category: 'structure',
        keywords: ['fenceASection5', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_122',
        path: '/models/buildings/fenceBCorner1.glb', // fenceBCorner1
        category: 'structure',
        keywords: ['fenceBCorner1', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_123',
        path: '/models/buildings/fenceBCorner2.glb', // fenceBCorner2
        category: 'structure',
        keywords: ['fenceBCorner2', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_124',
        path: '/models/buildings/fenceBCorner3.glb', // fenceBCorner3
        category: 'structure',
        keywords: ['fenceBCorner3', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_125',
        path: '/models/buildings/fenceBPillar1.glb', // fenceBPillar1
        category: 'structure',
        keywords: ['fenceBPillar1', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_126',
        path: '/models/buildings/fenceBPillar2.glb', // fenceBPillar2
        category: 'structure',
        keywords: ['fenceBPillar2', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_127',
        path: '/models/buildings/fenceBPillar3.glb', // fenceBPillar3
        category: 'structure',
        keywords: ['fenceBPillar3', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_128',
        path: '/models/buildings/fenceBPillar4.glb', // fenceBPillar4
        category: 'structure',
        keywords: ['fenceBPillar4', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_129',
        path: '/models/buildings/fenceBSection1.glb', // fenceBSection1
        category: 'structure',
        keywords: ['fenceBSection1', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_130',
        path: '/models/buildings/fenceBSection2.glb', // fenceBSection2
        category: 'structure',
        keywords: ['fenceBSection2', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_131',
        path: '/models/buildings/fenceBSection3.glb', // fenceBSection3
        category: 'structure',
        keywords: ['fenceBSection3', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_132',
        path: '/models/buildings/fenceBSection4.glb', // fenceBSection4
        category: 'structure',
        keywords: ['fenceBSection4', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_133',
        path: '/models/buildings/fenceC1.glb', // fenceC1
        category: 'structure',
        keywords: ['fenceC1', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_134',
        path: '/models/buildings/fenceC1Skewed.glb', // fenceC1Skewed
        category: 'structure',
        keywords: ['fenceC1Skewed', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_135',
        path: '/models/buildings/fenceC2.glb', // fenceC2
        category: 'structure',
        keywords: ['fenceC2', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_136',
        path: '/models/buildings/fenceC3.glb', // fenceC3
        category: 'structure',
        keywords: ['fenceC3', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_137',
        path: '/models/buildings/GlassBrokenWindow.glb', // GlassBrokenWindow
        category: 'structure',
        keywords: ['GlassBrokenWindow', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_138',
        path: '/models/buildings/graveyard-kit_brick-wall-curve-small.glb', // graveyard-kit_brick-wall-curve-small
        category: 'structure',
        keywords: ['graveyard', 'kit', 'brick', 'wall', 'curve', 'small', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_139',
        path: '/models/buildings/graveyard-kit_brick-wall-curve.glb', // graveyard-kit_brick-wall-curve
        category: 'structure',
        keywords: ['graveyard', 'kit', 'brick', 'wall', 'curve', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_140',
        path: '/models/buildings/graveyard-kit_brick-wall-end.glb', // graveyard-kit_brick-wall-end
        category: 'structure',
        keywords: ['graveyard', 'kit', 'brick', 'wall', 'end', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_141',
        path: '/models/buildings/graveyard-kit_brick-wall.glb', // graveyard-kit_brick-wall
        category: 'structure',
        keywords: ['graveyard', 'kit', 'brick', 'wall', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_142',
        path: '/models/buildings/graveyard-kit_column-large.glb', // graveyard-kit_column-large
        category: 'structure',
        keywords: ['graveyard', 'kit', 'column', 'large', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_143',
        path: '/models/buildings/graveyard-kit_cross-column.glb', // graveyard-kit_cross-column
        category: 'structure',
        keywords: ['graveyard', 'kit', 'cross', 'column', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_144',
        path: '/models/buildings/graveyard-kit_crypt-door.glb', // graveyard-kit_crypt-door
        category: 'structure',
        keywords: ['graveyard', 'kit', 'crypt', 'door', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_145',
        path: '/models/buildings/graveyard-kit_crypt-large-door.glb', // graveyard-kit_crypt-large-door
        category: 'structure',
        keywords: ['graveyard', 'kit', 'crypt', 'large', 'door', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_146',
        path: '/models/buildings/graveyard-kit_crypt-large-roof.glb', // graveyard-kit_crypt-large-roof
        category: 'structure',
        keywords: ['graveyard', 'kit', 'crypt', 'large', 'roof', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_147',
        path: '/models/buildings/graveyard-kit_crypt-small-roof.glb', // graveyard-kit_crypt-small-roof
        category: 'structure',
        keywords: ['graveyard', 'kit', 'crypt', 'small', 'roof', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_148',
        path: '/models/buildings/graveyard-kit_fence-damaged.glb', // graveyard-kit_fence-damaged
        category: 'structure',
        keywords: ['graveyard', 'kit', 'fence', 'damaged', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_149',
        path: '/models/buildings/graveyard-kit_fence-gate.glb', // graveyard-kit_fence-gate
        category: 'structure',
        keywords: ['graveyard', 'kit', 'fence', 'gate', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_150',
        path: '/models/buildings/graveyard-kit_fence.glb', // graveyard-kit_fence
        category: 'structure',
        keywords: ['graveyard', 'kit', 'fence', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_151',
        path: '/models/buildings/graveyard-kit_iron-fence-bar.glb', // graveyard-kit_iron-fence-bar
        category: 'structure',
        keywords: ['graveyard', 'kit', 'iron', 'fence', 'bar', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_152',
        path: '/models/buildings/graveyard-kit_iron-fence-border-column.glb', // graveyard-kit_iron-fence-border-column
        category: 'structure',
        keywords: ['graveyard', 'kit', 'iron', 'fence', 'border', 'column', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_153',
        path: '/models/buildings/graveyard-kit_iron-fence-border-curve.glb', // graveyard-kit_iron-fence-border-curve
        category: 'structure',
        keywords: ['graveyard', 'kit', 'iron', 'fence', 'border', 'curve', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_154',
        path: '/models/buildings/graveyard-kit_iron-fence-border-gate.glb', // graveyard-kit_iron-fence-border-gate
        category: 'structure',
        keywords: ['graveyard', 'kit', 'iron', 'fence', 'border', 'gate', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_155',
        path: '/models/buildings/graveyard-kit_iron-fence-border.glb', // graveyard-kit_iron-fence-border
        category: 'structure',
        keywords: ['graveyard', 'kit', 'iron', 'fence', 'border', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_156',
        path: '/models/buildings/graveyard-kit_iron-fence-curve.glb', // graveyard-kit_iron-fence-curve
        category: 'structure',
        keywords: ['graveyard', 'kit', 'iron', 'fence', 'curve', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_157',
        path: '/models/buildings/graveyard-kit_iron-fence-damaged.glb', // graveyard-kit_iron-fence-damaged
        category: 'structure',
        keywords: ['graveyard', 'kit', 'iron', 'fence', 'damaged', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_158',
        path: '/models/buildings/graveyard-kit_iron-fence.glb', // graveyard-kit_iron-fence
        category: 'structure',
        keywords: ['graveyard', 'kit', 'iron', 'fence', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_159',
        path: '/models/buildings/gryffindor_common_room.glb', // gryffindor_common_room
        category: 'structure',
        keywords: ['gryffindor', 'common', 'room', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_160',
        path: '/models/buildings/haunted_house.glb', // haunted_house
        category: 'structure',
        keywords: ['haunted', 'house', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_161',
        // ⚠️ hogwarts_grand_hall.glb는 외부 텍스처 참조로 사용 불가
        // hogwarts_corridor.glb (35개 텍스처 임베딩됨) 사용
        path: '/models/samples/hogwarts_corridor.glb',
        category: 'structure',
        keywords: ['hogwarts', 'grand', 'hall', 'buildings', '대강당', '마법학교'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_162',
        path: '/models/buildings/honey_dukes_shop.glb', // honey_dukes_shop
        category: 'structure',
        keywords: ['honey', 'dukes', 'shop', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_163',
        path: '/models/buildings/house_scene.glb', // house_scene
        category: 'structure',
        keywords: ['house', 'scene', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_164',
        path: '/models/buildings/modular-dungeon-kit_corridor-corner.glb', // modular-dungeon-kit_corridor-corner
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'corridor', 'corner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_165',
        path: '/models/buildings/modular-dungeon-kit_corridor-end.glb', // modular-dungeon-kit_corridor-end
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'corridor', 'end', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_166',
        path: '/models/buildings/modular-dungeon-kit_corridor-intersection.glb', // modular-dungeon-kit_corridor-intersection
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'corridor', 'intersection', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_167',
        path: '/models/buildings/modular-dungeon-kit_corridor-junction.glb', // modular-dungeon-kit_corridor-junction
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'corridor', 'junction', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_168',
        path: '/models/buildings/modular-dungeon-kit_corridor-transition.glb', // modular-dungeon-kit_corridor-transition
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'corridor', 'transition', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_169',
        path: '/models/buildings/modular-dungeon-kit_corridor-wide-corner.glb', // modular-dungeon-kit_corridor-wide-corner
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'corridor', 'wide', 'corner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_170',
        path: '/models/buildings/modular-dungeon-kit_corridor-wide-end.glb', // modular-dungeon-kit_corridor-wide-end
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'corridor', 'wide', 'end', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_171',
        path: '/models/buildings/modular-dungeon-kit_corridor-wide-intersection.glb', // modular-dungeon-kit_corridor-wide-intersection
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'corridor', 'wide', 'intersection', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_172',
        path: '/models/buildings/modular-dungeon-kit_corridor-wide-junction.glb', // modular-dungeon-kit_corridor-wide-junction
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'corridor', 'wide', 'junction', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_173',
        path: '/models/buildings/modular-dungeon-kit_corridor-wide.glb', // modular-dungeon-kit_corridor-wide
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'corridor', 'wide', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_174',
        path: '/models/buildings/modular-dungeon-kit_corridor.glb', // modular-dungeon-kit_corridor
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'corridor', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_175',
        path: '/models/buildings/modular-dungeon-kit_gate-door-window.glb', // modular-dungeon-kit_gate-door-window
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'gate', 'door', 'window', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_176',
        path: '/models/buildings/modular-dungeon-kit_gate-door.glb', // modular-dungeon-kit_gate-door
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'gate', 'door', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_177',
        path: '/models/buildings/modular-dungeon-kit_gate.glb', // modular-dungeon-kit_gate
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'gate', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_178',
        path: '/models/buildings/modular-dungeon-kit_room-corner.glb', // modular-dungeon-kit_room-corner
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'room', 'corner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_179',
        path: '/models/buildings/modular-dungeon-kit_room-large-variation.glb', // modular-dungeon-kit_room-large-variation
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'room', 'large', 'variation', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_180',
        path: '/models/buildings/modular-dungeon-kit_room-large.glb', // modular-dungeon-kit_room-large
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'room', 'large', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_181',
        path: '/models/buildings/modular-dungeon-kit_room-small-variation.glb', // modular-dungeon-kit_room-small-variation
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'room', 'small', 'variation', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_182',
        path: '/models/buildings/modular-dungeon-kit_room-small.glb', // modular-dungeon-kit_room-small
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'room', 'small', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_183',
        path: '/models/buildings/modular-dungeon-kit_room-wide-variation.glb', // modular-dungeon-kit_room-wide-variation
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'room', 'wide', 'variation', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_184',
        path: '/models/buildings/modular-dungeon-kit_room-wide.glb', // modular-dungeon-kit_room-wide
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'room', 'wide', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_185',
        path: '/models/buildings/modular-dungeon-kit_stairs-wide.glb', // modular-dungeon-kit_stairs-wide
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'stairs', 'wide', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_186',
        path: '/models/buildings/modular-dungeon-kit_stairs.glb', // modular-dungeon-kit_stairs
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'stairs', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_187',
        path: '/models/buildings/modular-dungeon-kit_template-wall-corner.glb', // modular-dungeon-kit_template-wall-corner
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'wall', 'corner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_188',
        path: '/models/buildings/modular-dungeon-kit_template-wall-detail-a.glb', // modular-dungeon-kit_template-wall-detail-a
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'wall', 'detail', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_189',
        path: '/models/buildings/modular-dungeon-kit_template-wall-half.glb', // modular-dungeon-kit_template-wall-half
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'wall', 'half', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_190',
        path: '/models/buildings/modular-dungeon-kit_template-wall-stairs.glb', // modular-dungeon-kit_template-wall-stairs
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'wall', 'stairs', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_191',
        path: '/models/buildings/modular-dungeon-kit_template-wall-top.glb', // modular-dungeon-kit_template-wall-top
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'wall', 'top', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_192',
        path: '/models/buildings/modular-dungeon-kit_template-wall.glb', // modular-dungeon-kit_template-wall
        category: 'structure',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'wall', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_193',
        path: '/models/buildings/ollivanders_wand_shop.glb', // ollivanders_wand_shop
        category: 'structure',
        keywords: ['ollivanders', 'wand', 'shop', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_194',
        path: '/models/buildings/platformer-kit_door-large-open.glb', // platformer-kit_door-large-open
        category: 'structure',
        keywords: ['platformer', 'kit', 'door', 'large', 'open', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_195',
        path: '/models/buildings/platformer-kit_door-open.glb', // platformer-kit_door-open
        category: 'structure',
        keywords: ['platformer', 'kit', 'door', 'open', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_196',
        path: '/models/buildings/platformer-kit_door-rotate-large.glb', // platformer-kit_door-rotate-large
        category: 'structure',
        keywords: ['platformer', 'kit', 'door', 'rotate', 'large', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_197',
        path: '/models/buildings/platformer-kit_door-rotate.glb', // platformer-kit_door-rotate
        category: 'structure',
        keywords: ['platformer', 'kit', 'door', 'rotate', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_198',
        path: '/models/buildings/platformer-kit_fence-broken.glb', // platformer-kit_fence-broken
        category: 'structure',
        keywords: ['platformer', 'kit', 'fence', 'broken', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_199',
        path: '/models/buildings/platformer-kit_fence-corner-curved.glb', // platformer-kit_fence-corner-curved
        category: 'structure',
        keywords: ['platformer', 'kit', 'fence', 'corner', 'curved', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_200',
        path: '/models/buildings/platformer-kit_fence-corner.glb', // platformer-kit_fence-corner
        category: 'structure',
        keywords: ['platformer', 'kit', 'fence', 'corner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_201',
        path: '/models/buildings/platformer-kit_fence-low-broken.glb', // platformer-kit_fence-low-broken
        category: 'structure',
        keywords: ['platformer', 'kit', 'fence', 'low', 'broken', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_202',
        path: '/models/buildings/platformer-kit_fence-low-corner-curved.glb', // platformer-kit_fence-low-corner-curved
        category: 'structure',
        keywords: ['platformer', 'kit', 'fence', 'low', 'corner', 'curved', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_203',
        path: '/models/buildings/platformer-kit_fence-low-corner.glb', // platformer-kit_fence-low-corner
        category: 'structure',
        keywords: ['platformer', 'kit', 'fence', 'low', 'corner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_204',
        path: '/models/buildings/platformer-kit_fence-low-straight.glb', // platformer-kit_fence-low-straight
        category: 'structure',
        keywords: ['platformer', 'kit', 'fence', 'low', 'straight', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_205',
        path: '/models/buildings/platformer-kit_fence-rope.glb', // platformer-kit_fence-rope
        category: 'structure',
        keywords: ['platformer', 'kit', 'fence', 'rope', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_206',
        path: '/models/buildings/platformer-kit_fence-straight.glb', // platformer-kit_fence-straight
        category: 'structure',
        keywords: ['platformer', 'kit', 'fence', 'straight', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_207',
        path: '/models/buildings/potions_classroom.glb', // potions_classroom
        category: 'structure',
        keywords: ['potions', 'classroom', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_208',
        path: '/models/buildings/slytherin_dorm_room.glb', // slytherin_dorm_room
        category: 'structure',
        keywords: ['slytherin', 'dorm', 'room', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_209',
        path: '/models/buildings/slytherin_dorm_room_1769413346242.glb', // slytherin_dorm_room_1769413346242
        category: 'structure',
        keywords: ['slytherin', 'dorm', 'room', '1769413346242', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_210',
        path: '/models/buildings/Slytherin_Dorm_Room_v20260121_135123_MetadataPatched.glb', // Slytherin_Dorm_Room_v20260121_135123_MetadataPatched
        category: 'structure',
        keywords: ['Slytherin', 'Dorm', 'Room', 'v20260121', '135123', 'MetadataPatched', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_211',
        path: '/models/buildings/three.js-examples_dungeon_warkarma.glb', // three.js-examples_dungeon_warkarma
        category: 'structure',
        keywords: ['three.js', 'examples', 'dungeon', 'warkarma', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_212',
        path: '/models/buildings/TransmissionThinwallTestGrid.glb', // TransmissionThinwallTestGrid
        category: 'structure',
        keywords: ['TransmissionThinwallTestGrid', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_213',
        path: '/models/buildings/umbridges_office.glb', // umbridges_office
        category: 'structure',
        keywords: ['umbridges', 'office', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_214',
        path: '/models/buildings/wall.glb', // wall
        category: 'structure',
        keywords: ['wall', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_215',
        path: '/models/buildings/wallArch.glb', // wallArch
        category: 'structure',
        keywords: ['wallArch', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_216',
        path: '/models/buildings/wallCorner.glb', // wallCorner
        category: 'structure',
        keywords: ['wallCorner', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_217',
        path: '/models/buildings/window.glb', // window
        category: 'structure',
        keywords: ['window', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_218',
        path: '/models/buildings/window2.glb', // window2
        category: 'structure',
        keywords: ['window2', 'buildings'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_219',
        path: '/models/characters/babylon-assets_BoxSemantics.glb', // babylon-assets_BoxSemantics
        category: 'prop',
        keywords: ['babylon', 'assets', 'BoxSemantics', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_220',
        path: '/models/characters/babylon-assets_CesiumMan.glb', // babylon-assets_CesiumMan
        category: 'prop',
        keywords: ['babylon', 'assets', 'CesiumMan', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_221',
        path: '/models/characters/CesiumMan.glb', // CesiumMan
        category: 'prop',
        keywords: ['CesiumMan', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_222',
        path: '/models/characters/graveyard-kit_character-ghost.glb', // graveyard-kit_character-ghost
        category: 'prop',
        keywords: ['graveyard', 'kit', 'character', 'ghost', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_223',
        path: '/models/characters/graveyard-kit_character-keeper.glb', // graveyard-kit_character-keeper
        category: 'prop',
        keywords: ['graveyard', 'kit', 'character', 'keeper', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_224',
        path: '/models/characters/graveyard-kit_character-skeleton.glb', // graveyard-kit_character-skeleton
        category: 'prop',
        keywords: ['graveyard', 'kit', 'character', 'skeleton', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_225',
        path: '/models/characters/graveyard-kit_character-vampire.glb', // graveyard-kit_character-vampire
        category: 'prop',
        keywords: ['graveyard', 'kit', 'character', 'vampire', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_226',
        path: '/models/characters/graveyard-kit_character-zombie.glb', // graveyard-kit_character-zombie
        category: 'prop',
        keywords: ['graveyard', 'kit', 'character', 'zombie', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_227',
        path: '/models/characters/HVGirl.glb', // HVGirl
        category: 'prop',
        keywords: ['HVGirl', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_228',
        path: '/models/characters/NodePerformanceTest.glb', // NodePerformanceTest
        category: 'prop',
        keywords: ['NodePerformanceTest', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_229',
        path: '/models/characters/platformer-kit_character-oobi.glb', // platformer-kit_character-oobi
        category: 'prop',
        keywords: ['platformer', 'kit', 'character', 'oobi', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_230',
        path: '/models/characters/platformer-kit_character-oodi.glb', // platformer-kit_character-oodi
        category: 'prop',
        keywords: ['platformer', 'kit', 'character', 'oodi', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_231',
        path: '/models/characters/platformer-kit_character-ooli.glb', // platformer-kit_character-ooli
        category: 'prop',
        keywords: ['platformer', 'kit', 'character', 'ooli', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_232',
        path: '/models/characters/platformer-kit_character-oopi.glb', // platformer-kit_character-oopi
        category: 'prop',
        keywords: ['platformer', 'kit', 'character', 'oopi', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_233',
        path: '/models/characters/platformer-kit_character-oozi.glb', // platformer-kit_character-oozi
        category: 'prop',
        keywords: ['platformer', 'kit', 'character', 'oozi', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_234',
        path: '/models/characters/snowMan.glb', // snowMan
        category: 'prop',
        keywords: ['snowMan', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_235',
        path: '/models/characters/three.js-examples_Soldier.glb', // three.js-examples_Soldier
        category: 'prop',
        keywords: ['three.js', 'examples', 'Soldier', 'characters'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_236',
        path: '/models/creatures/babylon-assets_BarramundiFish.glb', // babylon-assets_BarramundiFish
        category: 'prop',
        keywords: ['babylon', 'assets', 'BarramundiFish', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_237',
        path: '/models/creatures/babylon-assets_Monster.glb', // babylon-assets_Monster
        category: 'prop',
        keywords: ['babylon', 'assets', 'Monster', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_238',
        path: '/models/creatures/babylon-assets_ReciprocatingSaw.glb', // babylon-assets_ReciprocatingSaw
        category: 'prop',
        keywords: ['babylon', 'assets', 'ReciprocatingSaw', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_239',
        path: '/models/creatures/BarramundiFish.glb', // BarramundiFish
        category: 'prop',
        keywords: ['BarramundiFish', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_240',
        path: '/models/creatures/dragon.glb', // dragon
        category: 'prop',
        keywords: ['dragon', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_241',
        path: '/models/creatures/DragonAttenuation.glb', // DragonAttenuation
        category: 'prop',
        keywords: ['DragonAttenuation', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_242',
        path: '/models/creatures/DragonDispersion.glb', // DragonDispersion
        category: 'prop',
        keywords: ['DragonDispersion', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_243',
        path: '/models/creatures/dragonUV.glb', // dragonUV
        category: 'prop',
        keywords: ['dragonUV', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_244',
        path: '/models/creatures/fish.glb', // fish
        category: 'prop',
        keywords: ['fish', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_245',
        path: '/models/creatures/Fox.glb', // Fox
        category: 'prop',
        keywords: ['Fox', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_246',
        path: '/models/creatures/ScatteringSkull.glb', // ScatteringSkull
        category: 'prop',
        keywords: ['ScatteringSkull', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_247',
        path: '/models/creatures/tarisland_dragon_high_poly.glb', // tarisland_dragon_high_poly
        category: 'prop',
        keywords: ['tarisland', 'dragon', 'high', 'poly', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_248',
        path: '/models/creatures/three.js-examples_DragonAttenuation.glb', // three.js-examples_DragonAttenuation
        category: 'prop',
        keywords: ['three.js', 'examples', 'DragonAttenuation', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_249',
        path: '/models/creatures/three.js-examples_Horse.glb', // three.js-examples_Horse
        category: 'prop',
        keywords: ['three.js', 'examples', 'Horse', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_250',
        path: '/models/creatures/underwaterSceneShadowCatcher.glb', // underwaterSceneShadowCatcher
        category: 'prop',
        keywords: ['underwaterSceneShadowCatcher', 'creatures'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_251',
        path: '/models/food/babylon-assets_WaterBottle.glb', // babylon-assets_WaterBottle
        category: 'prop',
        keywords: ['babylon', 'assets', 'WaterBottle', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_252',
        path: '/models/food/DiffuseTransmissionTeacup.glb', // DiffuseTransmissionTeacup
        category: 'prop',
        keywords: ['DiffuseTransmissionTeacup', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_253',
        path: '/models/food/graveyard-kit_detail-plate.glb', // graveyard-kit_detail-plate
        category: 'prop',
        keywords: ['graveyard', 'kit', 'detail', 'plate', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_254',
        path: '/models/food/modular-dungeon-kit_template-corner.glb', // modular-dungeon-kit_template-corner
        category: 'prop',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'corner', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_255',
        path: '/models/food/modular-dungeon-kit_template-detail.glb', // modular-dungeon-kit_template-detail
        category: 'prop',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'detail', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_256',
        path: '/models/food/modular-dungeon-kit_template-floor-big.glb', // modular-dungeon-kit_template-floor-big
        category: 'prop',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'floor', 'big', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_257',
        path: '/models/food/modular-dungeon-kit_template-floor-detail-a.glb', // modular-dungeon-kit_template-floor-detail-a
        category: 'prop',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'floor', 'detail', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_258',
        path: '/models/food/modular-dungeon-kit_template-floor-detail.glb', // modular-dungeon-kit_template-floor-detail
        category: 'prop',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'floor', 'detail', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_259',
        path: '/models/food/modular-dungeon-kit_template-floor-layer-raised.glb', // modular-dungeon-kit_template-floor-layer-raised
        category: 'prop',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'floor', 'layer', 'raised', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_260',
        path: '/models/food/modular-dungeon-kit_template-floor-layer.glb', // modular-dungeon-kit_template-floor-layer
        category: 'prop',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'floor', 'layer', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_261',
        path: '/models/food/modular-dungeon-kit_template-floor.glb', // modular-dungeon-kit_template-floor
        category: 'prop',
        keywords: ['modular', 'dungeon', 'kit', 'template', 'floor', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_262',
        path: '/models/food/mrtk-fluent-backplate.glb', // mrtk-fluent-backplate
        category: 'prop',
        keywords: ['mrtk', 'fluent', 'backplate', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_263',
        path: '/models/food/mrtk-fluent-frontplate.glb', // mrtk-fluent-frontplate
        category: 'prop',
        keywords: ['mrtk', 'fluent', 'frontplate', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_264',
        path: '/models/food/WaterBottle.glb', // WaterBottle
        category: 'prop',
        keywords: ['WaterBottle', 'food'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_265',
        path: '/models/furniture/AnisotropyBarnLamp.glb', // AnisotropyBarnLamp
        category: 'large_furniture',
        keywords: ['AnisotropyBarnLamp', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_266',
        path: '/models/furniture/ChairDamaskPurplegold.glb', // ChairDamaskPurplegold
        category: 'large_furniture',
        keywords: ['ChairDamaskPurplegold', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_267',
        path: '/models/furniture/detailed_realistic_model_ancientbookshelf_01.glb', // detailed_realistic_model_ancientbookshelf_01
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'ancientbookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_268',
        path: '/models/furniture/detailed_realistic_model_ancientbookshelf_02.glb', // detailed_realistic_model_ancientbookshelf_02
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'ancientbookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_269',
        path: '/models/furniture/detailed_realistic_model_ancientbookshelf_03.glb', // detailed_realistic_model_ancientbookshelf_03
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'ancientbookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_270',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_02.glb', // detailed_realistic_model_antiquebookshelf_02
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_271',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_03.glb', // detailed_realistic_model_antiquebookshelf_03
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_272',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_04.glb', // detailed_realistic_model_antiquebookshelf_04
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_273',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_05.glb', // detailed_realistic_model_antiquebookshelf_05
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_274',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_06.glb', // detailed_realistic_model_antiquebookshelf_06
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_275',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_07.glb', // detailed_realistic_model_antiquebookshelf_07
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_276',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_08.glb', // detailed_realistic_model_antiquebookshelf_08
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_277',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_09.glb', // detailed_realistic_model_antiquebookshelf_09
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_278',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_10.glb', // detailed_realistic_model_antiquebookshelf_10
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_279',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_11.glb', // detailed_realistic_model_antiquebookshelf_11
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_280',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_12.glb', // detailed_realistic_model_antiquebookshelf_12
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_281',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_13.glb', // detailed_realistic_model_antiquebookshelf_13
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_282',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_14.glb', // detailed_realistic_model_antiquebookshelf_14
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_283',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_15.glb', // detailed_realistic_model_antiquebookshelf_15
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_284',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_16.glb', // detailed_realistic_model_antiquebookshelf_16
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_285',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_17.glb', // detailed_realistic_model_antiquebookshelf_17
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_286',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_18.glb', // detailed_realistic_model_antiquebookshelf_18
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_287',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_19.glb', // detailed_realistic_model_antiquebookshelf_19
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_288',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_20.glb', // detailed_realistic_model_antiquebookshelf_20
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_289',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_21.glb', // detailed_realistic_model_antiquebookshelf_21
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_290',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_22.glb', // detailed_realistic_model_antiquebookshelf_22
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_291',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_23.glb', // detailed_realistic_model_antiquebookshelf_23
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_292',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_24.glb', // detailed_realistic_model_antiquebookshelf_24
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_293',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_25.glb', // detailed_realistic_model_antiquebookshelf_25
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_294',
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_26.glb', // detailed_realistic_model_antiquebookshelf_26
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antiquebookshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_295',
        path: '/models/furniture/detailed_realistic_model_antique_01.glb', // detailed_realistic_model_antique_01
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'antique', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_296',
        path: '/models/furniture/detailed_realistic_model_bookcase_01.glb', // detailed_realistic_model_bookcase_01
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'bookcase', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_297',
        path: '/models/furniture/detailed_realistic_model_broomstick_01.glb', // detailed_realistic_model_broomstick_01
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'broomstick', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_298',
        path: '/models/furniture/detailed_realistic_model_broomstick_02.glb', // detailed_realistic_model_broomstick_02
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'broomstick', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_299',
        path: '/models/furniture/detailed_realistic_model_castiron_01.glb', // detailed_realistic_model_castiron_01
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'castiron', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_300',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_01.glb', // detailed_realistic_model_grandoaktable_01
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_301',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_02.glb', // detailed_realistic_model_grandoaktable_02
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_302',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_03.glb', // detailed_realistic_model_grandoaktable_03
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_303',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_04.glb', // detailed_realistic_model_grandoaktable_04
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_304',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_05.glb', // detailed_realistic_model_grandoaktable_05
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_305',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_06.glb', // detailed_realistic_model_grandoaktable_06
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_306',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_07.glb', // detailed_realistic_model_grandoaktable_07
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_307',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_08.glb', // detailed_realistic_model_grandoaktable_08
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_308',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_09.glb', // detailed_realistic_model_grandoaktable_09
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_309',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_10.glb', // detailed_realistic_model_grandoaktable_10
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_310',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_11.glb', // detailed_realistic_model_grandoaktable_11
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_311',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_12.glb', // detailed_realistic_model_grandoaktable_12
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_312',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_13.glb', // detailed_realistic_model_grandoaktable_13
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_313',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_14.glb', // detailed_realistic_model_grandoaktable_14
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_314',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_15.glb', // detailed_realistic_model_grandoaktable_15
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_315',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_16.glb', // detailed_realistic_model_grandoaktable_16
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_316',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_17.glb', // detailed_realistic_model_grandoaktable_17
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grandoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_317',
        path: '/models/furniture/detailed_realistic_model_grand_01.glb', // detailed_realistic_model_grand_01
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'grand', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_318',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_01.glb', // detailed_realistic_model_largeoaktable_01
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_319',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_02.glb', // detailed_realistic_model_largeoaktable_02
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_320',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_03.glb', // detailed_realistic_model_largeoaktable_03
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_321',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_04.glb', // detailed_realistic_model_largeoaktable_04
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_322',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_05.glb', // detailed_realistic_model_largeoaktable_05
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_323',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_06.glb', // detailed_realistic_model_largeoaktable_06
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_324',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_07.glb', // detailed_realistic_model_largeoaktable_07
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_325',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_08.glb', // detailed_realistic_model_largeoaktable_08
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_326',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_09.glb', // detailed_realistic_model_largeoaktable_09
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_327',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_10.glb', // detailed_realistic_model_largeoaktable_10
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_328',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_11.glb', // detailed_realistic_model_largeoaktable_11
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_329',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_12.glb', // detailed_realistic_model_largeoaktable_12
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_330',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_13.glb', // detailed_realistic_model_largeoaktable_13
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_331',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_14.glb', // detailed_realistic_model_largeoaktable_14
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'largeoaktable', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_332',
        path: '/models/furniture/detailed_realistic_model_potionshelf_01.glb', // detailed_realistic_model_potionshelf_01
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'potionshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_333',
        path: '/models/furniture/detailed_realistic_model_potionshelf_02.glb', // detailed_realistic_model_potionshelf_02
        category: 'large_furniture',
        keywords: ['detailed', 'realistic', 'model', 'potionshelf', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_334',
        path: '/models/furniture/fantasy-town-kit_stall-bench.glb', // fantasy-town-kit_stall-bench
        category: 'large_furniture',
        keywords: ['fantasy', 'town', 'kit', 'stall', 'bench', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_335',
        path: '/models/furniture/fantasy-town-kit_stall-stool.glb', // fantasy-town-kit_stall-stool
        category: 'large_furniture',
        keywords: ['fantasy', 'town', 'kit', 'stall', 'stool', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_336',
        path: '/models/furniture/GlamVelvetSofa.glb', // GlamVelvetSofa
        category: 'large_furniture',
        keywords: ['GlamVelvetSofa', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_337',
        path: '/models/furniture/graveyard-kit_bench-damaged.glb', // graveyard-kit_bench-damaged
        category: 'large_furniture',
        keywords: ['graveyard', 'kit', 'bench', 'damaged', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_338',
        path: '/models/furniture/graveyard-kit_bench.glb', // graveyard-kit_bench
        category: 'large_furniture',
        keywords: ['graveyard', 'kit', 'bench', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_339',
        path: '/models/furniture/IridescenceLamp.glb', // IridescenceLamp
        category: 'large_furniture',
        keywords: ['IridescenceLamp', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_340',
        path: '/models/furniture/LightsPunctualLamp.glb', // LightsPunctualLamp
        category: 'large_furniture',
        keywords: ['LightsPunctualLamp', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_341',
        path: '/models/furniture/modern_office_chair_padded_01.glb', // modern_office_chair_padded_01
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_342',
        path: '/models/furniture/modern_office_chair_padded_02.glb', // modern_office_chair_padded_02
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_343',
        path: '/models/furniture/modern_office_chair_padded_03.glb', // modern_office_chair_padded_03
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_344',
        path: '/models/furniture/modern_office_chair_padded_04.glb', // modern_office_chair_padded_04
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_345',
        path: '/models/furniture/modern_office_chair_padded_05.glb', // modern_office_chair_padded_05
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_346',
        path: '/models/furniture/modern_office_chair_padded_06.glb', // modern_office_chair_padded_06
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_347',
        path: '/models/furniture/modern_office_chair_padded_07.glb', // modern_office_chair_padded_07
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_348',
        path: '/models/furniture/modern_office_chair_padded_08.glb', // modern_office_chair_padded_08
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_349',
        path: '/models/furniture/modern_office_chair_padded_09.glb', // modern_office_chair_padded_09
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_350',
        path: '/models/furniture/modern_office_chair_padded_10.glb', // modern_office_chair_padded_10
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_351',
        path: '/models/furniture/modern_office_chair_padded_11.glb', // modern_office_chair_padded_11
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_352',
        path: '/models/furniture/modern_office_chair_padded_12.glb', // modern_office_chair_padded_12
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_353',
        path: '/models/furniture/modern_office_chair_padded_13.glb', // modern_office_chair_padded_13
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_354',
        path: '/models/furniture/modern_office_chair_padded_14.glb', // modern_office_chair_padded_14
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_355',
        path: '/models/furniture/modern_office_chair_padded_15.glb', // modern_office_chair_padded_15
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_356',
        path: '/models/furniture/modern_office_chair_padded_16.glb', // modern_office_chair_padded_16
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_357',
        path: '/models/furniture/modern_office_chair_padded_17.glb', // modern_office_chair_padded_17
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_358',
        path: '/models/furniture/modern_office_chair_padded_18.glb', // modern_office_chair_padded_18
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_359',
        path: '/models/furniture/modern_office_chair_padded_19.glb', // modern_office_chair_padded_19
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_360',
        path: '/models/furniture/modern_office_chair_padded_20.glb', // modern_office_chair_padded_20
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_361',
        path: '/models/furniture/modern_office_chair_padded_21.glb', // modern_office_chair_padded_21
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_362',
        path: '/models/furniture/modern_office_chair_padded_22.glb', // modern_office_chair_padded_22
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_363',
        path: '/models/furniture/modern_office_chair_padded_23.glb', // modern_office_chair_padded_23
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_364',
        path: '/models/furniture/modern_office_chair_padded_24.glb', // modern_office_chair_padded_24
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_365',
        path: '/models/furniture/modern_office_chair_padded_25.glb', // modern_office_chair_padded_25
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_366',
        path: '/models/furniture/modern_office_chair_padded_26.glb', // modern_office_chair_padded_26
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_367',
        path: '/models/furniture/modern_office_chair_padded_27.glb', // modern_office_chair_padded_27
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_368',
        path: '/models/furniture/modern_office_chair_padded_28.glb', // modern_office_chair_padded_28
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_369',
        path: '/models/furniture/modern_office_chair_padded_29.glb', // modern_office_chair_padded_29
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_370',
        path: '/models/furniture/modern_office_chair_padded_30.glb', // modern_office_chair_padded_30
        category: 'large_furniture',
        keywords: ['modern', 'office', 'chair', 'padded', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_371',
        path: '/models/furniture/realistic_wooden_office_desk_01.glb', // realistic_wooden_office_desk_01
        category: 'large_furniture',
        keywords: ['realistic', 'wooden', 'office', 'desk', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_372',
        path: '/models/furniture/realistic_wooden_office_desk_02.glb', // realistic_wooden_office_desk_02
        category: 'large_furniture',
        keywords: ['realistic', 'wooden', 'office', 'desk', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_373',
        path: '/models/furniture/realistic_wooden_office_desk_03.glb', // realistic_wooden_office_desk_03
        category: 'large_furniture',
        keywords: ['realistic', 'wooden', 'office', 'desk', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_374',
        path: '/models/furniture/realistic_wooden_office_desk_04.glb', // realistic_wooden_office_desk_04
        category: 'large_furniture',
        keywords: ['realistic', 'wooden', 'office', 'desk', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_375',
        path: '/models/furniture/SheenChair.glb', // SheenChair
        category: 'large_furniture',
        keywords: ['SheenChair', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_376',
        path: '/models/furniture/SheenChair_1769416633174.glb', // SheenChair_1769416633174
        category: 'large_furniture',
        keywords: ['SheenChair', '1769416633174', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_377',
        path: '/models/furniture/SheenWoodLeatherSofa.glb', // SheenWoodLeatherSofa
        category: 'large_furniture',
        keywords: ['SheenWoodLeatherSofa', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_378',
        path: '/models/furniture/three.js-examples_AnisotropyBarnLamp.glb', // three.js-examples_AnisotropyBarnLamp
        category: 'large_furniture',
        keywords: ['three.js', 'examples', 'AnisotropyBarnLamp', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_379',
        path: '/models/furniture/three.js-examples_IridescenceLamp.glb', // three.js-examples_IridescenceLamp
        category: 'large_furniture',
        keywords: ['three.js', 'examples', 'IridescenceLamp', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_380',
        path: '/models/furniture/three.js-examples_minimalistic_modern_bedroom.glb', // three.js-examples_minimalistic_modern_bedroom
        category: 'large_furniture',
        keywords: ['three.js', 'examples', 'minimalistic', 'modern', 'bedroom', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_381',
        path: '/models/furniture/three.js-examples_SheenChair.glb', // three.js-examples_SheenChair
        category: 'large_furniture',
        keywords: ['three.js', 'examples', 'SheenChair', 'furniture'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_382',
        path: '/models/nature/bush1.glb', // bush1
        category: 'environment',
        keywords: ['bush1', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_383',
        path: '/models/nature/bush2.glb', // bush2
        category: 'environment',
        keywords: ['bush2', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_384',
        path: '/models/nature/bush3.glb', // bush3
        category: 'environment',
        keywords: ['bush3', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_385',
        path: '/models/nature/bush4.glb', // bush4
        category: 'environment',
        keywords: ['bush4', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_386',
        path: '/models/nature/bush5.glb', // bush5
        category: 'environment',
        keywords: ['bush5', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_387',
        path: '/models/nature/detailed_realistic_model_crystalball_02.glb', // detailed_realistic_model_crystalball_02
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_388',
        path: '/models/nature/detailed_realistic_model_crystalball_03.glb', // detailed_realistic_model_crystalball_03
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_389',
        path: '/models/nature/detailed_realistic_model_crystalball_04.glb', // detailed_realistic_model_crystalball_04
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_390',
        path: '/models/nature/detailed_realistic_model_crystalball_05.glb', // detailed_realistic_model_crystalball_05
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_391',
        path: '/models/nature/detailed_realistic_model_crystalball_06.glb', // detailed_realistic_model_crystalball_06
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_392',
        path: '/models/nature/detailed_realistic_model_crystalball_07.glb', // detailed_realistic_model_crystalball_07
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_393',
        path: '/models/nature/detailed_realistic_model_crystalball_08.glb', // detailed_realistic_model_crystalball_08
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_394',
        path: '/models/nature/detailed_realistic_model_crystalball_09.glb', // detailed_realistic_model_crystalball_09
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_395',
        path: '/models/nature/detailed_realistic_model_crystalball_10.glb', // detailed_realistic_model_crystalball_10
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_396',
        path: '/models/nature/detailed_realistic_model_crystalball_11.glb', // detailed_realistic_model_crystalball_11
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_397',
        path: '/models/nature/detailed_realistic_model_crystalball_12.glb', // detailed_realistic_model_crystalball_12
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_398',
        path: '/models/nature/detailed_realistic_model_crystalball_13.glb', // detailed_realistic_model_crystalball_13
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_399',
        path: '/models/nature/detailed_realistic_model_crystalball_14.glb', // detailed_realistic_model_crystalball_14
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_400',
        path: '/models/nature/detailed_realistic_model_crystalball_15.glb', // detailed_realistic_model_crystalball_15
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_401',
        path: '/models/nature/detailed_realistic_model_crystalball_16.glb', // detailed_realistic_model_crystalball_16
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_402',
        path: '/models/nature/detailed_realistic_model_crystalball_17.glb', // detailed_realistic_model_crystalball_17
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_403',
        path: '/models/nature/detailed_realistic_model_crystalball_18.glb', // detailed_realistic_model_crystalball_18
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_404',
        path: '/models/nature/detailed_realistic_model_crystalball_19.glb', // detailed_realistic_model_crystalball_19
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_405',
        path: '/models/nature/detailed_realistic_model_crystalball_20.glb', // detailed_realistic_model_crystalball_20
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_406',
        path: '/models/nature/detailed_realistic_model_crystalball_21.glb', // detailed_realistic_model_crystalball_21
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_407',
        path: '/models/nature/detailed_realistic_model_crystalball_22.glb', // detailed_realistic_model_crystalball_22
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_408',
        path: '/models/nature/detailed_realistic_model_crystalball_23.glb', // detailed_realistic_model_crystalball_23
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_409',
        path: '/models/nature/detailed_realistic_model_crystalball_24.glb', // detailed_realistic_model_crystalball_24
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'crystalball', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_410',
        path: '/models/nature/detailed_realistic_model_stone_01.glb', // detailed_realistic_model_stone_01
        category: 'environment',
        keywords: ['detailed', 'realistic', 'model', 'stone', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_411',
        path: '/models/nature/DiffuseTransmissionPlant.glb', // DiffuseTransmissionPlant
        category: 'environment',
        keywords: ['DiffuseTransmissionPlant', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_412',
        path: '/models/nature/fantasy-town-kit_pillar-stone.glb', // fantasy-town-kit_pillar-stone
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'pillar', 'stone', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_413',
        path: '/models/nature/fantasy-town-kit_rock-large.glb', // fantasy-town-kit_rock-large
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'rock', 'large', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_414',
        path: '/models/nature/fantasy-town-kit_rock-small.glb', // fantasy-town-kit_rock-small
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'rock', 'small', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_415',
        path: '/models/nature/fantasy-town-kit_rock-wide.glb', // fantasy-town-kit_rock-wide
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'rock', 'wide', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_416',
        path: '/models/nature/fantasy-town-kit_stairs-stone-corner.glb', // fantasy-town-kit_stairs-stone-corner
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'stone', 'corner', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_417',
        path: '/models/nature/fantasy-town-kit_stairs-stone-handrail.glb', // fantasy-town-kit_stairs-stone-handrail
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'stone', 'handrail', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_418',
        path: '/models/nature/fantasy-town-kit_stairs-stone-round.glb', // fantasy-town-kit_stairs-stone-round
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'stone', 'round', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_419',
        path: '/models/nature/fantasy-town-kit_stairs-stone.glb', // fantasy-town-kit_stairs-stone
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'stone', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_420',
        path: '/models/nature/fantasy-town-kit_stairs-wide-stone-handrail.glb', // fantasy-town-kit_stairs-wide-stone-handrail
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'wide', 'stone', 'handrail', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_421',
        path: '/models/nature/fantasy-town-kit_stairs-wide-stone.glb', // fantasy-town-kit_stairs-wide-stone
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'wide', 'stone', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_422',
        path: '/models/nature/fantasy-town-kit_tree-crooked.glb', // fantasy-town-kit_tree-crooked
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'tree', 'crooked', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_423',
        path: '/models/nature/fantasy-town-kit_tree-high-crooked.glb', // fantasy-town-kit_tree-high-crooked
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'tree', 'high', 'crooked', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_424',
        path: '/models/nature/fantasy-town-kit_tree-high-round.glb', // fantasy-town-kit_tree-high-round
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'tree', 'high', 'round', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_425',
        path: '/models/nature/fantasy-town-kit_tree-high.glb', // fantasy-town-kit_tree-high
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'tree', 'high', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_426',
        path: '/models/nature/fantasy-town-kit_tree.glb', // fantasy-town-kit_tree
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'tree', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_427',
        path: '/models/nature/fantasy-town-kit_wall-window-stone.glb', // fantasy-town-kit_wall-window-stone
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'window', 'stone', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_428',
        path: '/models/nature/fantasy-town-kit_wall-wood-window-stone.glb', // fantasy-town-kit_wall-wood-window-stone
        category: 'environment',
        keywords: ['fantasy', 'town', 'kit', 'wall', 'wood', 'window', 'stone', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_429',
        path: '/models/nature/GlassVaseFlowers.glb', // GlassVaseFlowers
        category: 'environment',
        keywords: ['GlassVaseFlowers', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_430',
        path: '/models/nature/graveyard-kit_altar-stone.glb', // graveyard-kit_altar-stone
        category: 'environment',
        keywords: ['graveyard', 'kit', 'altar', 'stone', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_431',
        path: '/models/nature/graveyard-kit_gravestone-bevel.glb', // graveyard-kit_gravestone-bevel
        category: 'environment',
        keywords: ['graveyard', 'kit', 'gravestone', 'bevel', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_432',
        path: '/models/nature/graveyard-kit_gravestone-broken.glb', // graveyard-kit_gravestone-broken
        category: 'environment',
        keywords: ['graveyard', 'kit', 'gravestone', 'broken', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_433',
        path: '/models/nature/graveyard-kit_gravestone-cross-large.glb', // graveyard-kit_gravestone-cross-large
        category: 'environment',
        keywords: ['graveyard', 'kit', 'gravestone', 'cross', 'large', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_434',
        path: '/models/nature/graveyard-kit_gravestone-cross.glb', // graveyard-kit_gravestone-cross
        category: 'environment',
        keywords: ['graveyard', 'kit', 'gravestone', 'cross', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_435',
        path: '/models/nature/graveyard-kit_gravestone-debris.glb', // graveyard-kit_gravestone-debris
        category: 'environment',
        keywords: ['graveyard', 'kit', 'gravestone', 'debris', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_436',
        path: '/models/nature/graveyard-kit_gravestone-decorative.glb', // graveyard-kit_gravestone-decorative
        category: 'environment',
        keywords: ['graveyard', 'kit', 'gravestone', 'decorative', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_437',
        path: '/models/nature/graveyard-kit_gravestone-roof.glb', // graveyard-kit_gravestone-roof
        category: 'environment',
        keywords: ['graveyard', 'kit', 'gravestone', 'roof', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_438',
        path: '/models/nature/graveyard-kit_gravestone-round.glb', // graveyard-kit_gravestone-round
        category: 'environment',
        keywords: ['graveyard', 'kit', 'gravestone', 'round', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_439',
        path: '/models/nature/graveyard-kit_gravestone-wide.glb', // graveyard-kit_gravestone-wide
        category: 'environment',
        keywords: ['graveyard', 'kit', 'gravestone', 'wide', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_440',
        path: '/models/nature/graveyard-kit_rocks-tall.glb', // graveyard-kit_rocks-tall
        category: 'environment',
        keywords: ['graveyard', 'kit', 'rocks', 'tall', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_441',
        path: '/models/nature/graveyard-kit_rocks.glb', // graveyard-kit_rocks
        category: 'environment',
        keywords: ['graveyard', 'kit', 'rocks', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_442',
        path: '/models/nature/graveyard-kit_stone-wall-column.glb', // graveyard-kit_stone-wall-column
        category: 'environment',
        keywords: ['graveyard', 'kit', 'stone', 'wall', 'column', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_443',
        path: '/models/nature/graveyard-kit_stone-wall-curve.glb', // graveyard-kit_stone-wall-curve
        category: 'environment',
        keywords: ['graveyard', 'kit', 'stone', 'wall', 'curve', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_444',
        path: '/models/nature/graveyard-kit_stone-wall-damaged.glb', // graveyard-kit_stone-wall-damaged
        category: 'environment',
        keywords: ['graveyard', 'kit', 'stone', 'wall', 'damaged', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_445',
        path: '/models/nature/graveyard-kit_stone-wall.glb', // graveyard-kit_stone-wall
        category: 'environment',
        keywords: ['graveyard', 'kit', 'stone', 'wall', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_446',
        path: '/models/nature/platformer-kit_block-grass-corner-low.glb', // platformer-kit_block-grass-corner-low
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'corner', 'low', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_447',
        path: '/models/nature/platformer-kit_block-grass-corner-overhang-low.glb', // platformer-kit_block-grass-corner-overhang-low
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'corner', 'overhang', 'low', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_448',
        path: '/models/nature/platformer-kit_block-grass-corner-overhang.glb', // platformer-kit_block-grass-corner-overhang
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'corner', 'overhang', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_449',
        path: '/models/nature/platformer-kit_block-grass-corner.glb', // platformer-kit_block-grass-corner
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'corner', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_450',
        path: '/models/nature/platformer-kit_block-grass-curve-half.glb', // platformer-kit_block-grass-curve-half
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'curve', 'half', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_451',
        path: '/models/nature/platformer-kit_block-grass-curve-low.glb', // platformer-kit_block-grass-curve-low
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'curve', 'low', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_452',
        path: '/models/nature/platformer-kit_block-grass-curve.glb', // platformer-kit_block-grass-curve
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'curve', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_453',
        path: '/models/nature/platformer-kit_block-grass-edge.glb', // platformer-kit_block-grass-edge
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'edge', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_454',
        path: '/models/nature/platformer-kit_block-grass-hexagon.glb', // platformer-kit_block-grass-hexagon
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'hexagon', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_455',
        path: '/models/nature/platformer-kit_block-grass-large-slope-narrow.glb', // platformer-kit_block-grass-large-slope-narrow
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'large', 'slope', 'narrow', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_456',
        path: '/models/nature/platformer-kit_block-grass-large-slope-steep-narrow.glb', // platformer-kit_block-grass-large-slope-steep-narrow
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'large', 'slope', 'steep', 'narrow', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_457',
        path: '/models/nature/platformer-kit_block-grass-large-slope-steep.glb', // platformer-kit_block-grass-large-slope-steep
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'large', 'slope', 'steep', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_458',
        path: '/models/nature/platformer-kit_block-grass-large-slope.glb', // platformer-kit_block-grass-large-slope
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'large', 'slope', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_459',
        path: '/models/nature/platformer-kit_block-grass-large-tall.glb', // platformer-kit_block-grass-large-tall
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'large', 'tall', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_460',
        path: '/models/nature/platformer-kit_block-grass-large.glb', // platformer-kit_block-grass-large
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'large', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_461',
        path: '/models/nature/platformer-kit_block-grass-long.glb', // platformer-kit_block-grass-long
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'long', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_462',
        path: '/models/nature/platformer-kit_block-grass-low-hexagon.glb', // platformer-kit_block-grass-low-hexagon
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'low', 'hexagon', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_463',
        path: '/models/nature/platformer-kit_block-grass-low-large.glb', // platformer-kit_block-grass-low-large
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'low', 'large', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_464',
        path: '/models/nature/platformer-kit_block-grass-low-long.glb', // platformer-kit_block-grass-low-long
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'low', 'long', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_465',
        path: '/models/nature/platformer-kit_block-grass-low-narrow.glb', // platformer-kit_block-grass-low-narrow
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'low', 'narrow', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_466',
        path: '/models/nature/platformer-kit_block-grass-low.glb', // platformer-kit_block-grass-low
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'low', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_467',
        path: '/models/nature/platformer-kit_block-grass-narrow.glb', // platformer-kit_block-grass-narrow
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'narrow', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_468',
        path: '/models/nature/platformer-kit_block-grass-overhang-corner.glb', // platformer-kit_block-grass-overhang-corner
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'corner', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_469',
        path: '/models/nature/platformer-kit_block-grass-overhang-edge.glb', // platformer-kit_block-grass-overhang-edge
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'edge', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_470',
        path: '/models/nature/platformer-kit_block-grass-overhang-hexagon.glb', // platformer-kit_block-grass-overhang-hexagon
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'hexagon', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_471',
        path: '/models/nature/platformer-kit_block-grass-overhang-large-slope-narrow.glb', // platformer-kit_block-grass-overhang-large-slope-narrow
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'large', 'slope', 'narrow', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_472',
        path: '/models/nature/platformer-kit_block-grass-overhang-large-slope-steep-narrow.glb', // platformer-kit_block-grass-overhang-large-slope-steep-narrow
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'large', 'slope', 'steep', 'narrow', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_473',
        path: '/models/nature/platformer-kit_block-grass-overhang-large-slope-steep.glb', // platformer-kit_block-grass-overhang-large-slope-steep
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'large', 'slope', 'steep', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_474',
        path: '/models/nature/platformer-kit_block-grass-overhang-large-slope.glb', // platformer-kit_block-grass-overhang-large-slope
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'large', 'slope', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_475',
        path: '/models/nature/platformer-kit_block-grass-overhang-large-tall.glb', // platformer-kit_block-grass-overhang-large-tall
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'large', 'tall', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_476',
        path: '/models/nature/platformer-kit_block-grass-overhang-large.glb', // platformer-kit_block-grass-overhang-large
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'large', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_477',
        path: '/models/nature/platformer-kit_block-grass-overhang-long.glb', // platformer-kit_block-grass-overhang-long
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'long', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_478',
        path: '/models/nature/platformer-kit_block-grass-overhang-low-hexagon.glb', // platformer-kit_block-grass-overhang-low-hexagon
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'low', 'hexagon', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_479',
        path: '/models/nature/platformer-kit_block-grass-overhang-low-large.glb', // platformer-kit_block-grass-overhang-low-large
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'low', 'large', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_480',
        path: '/models/nature/platformer-kit_block-grass-overhang-low-long.glb', // platformer-kit_block-grass-overhang-low-long
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'low', 'long', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_481',
        path: '/models/nature/platformer-kit_block-grass-overhang-low-narrow.glb', // platformer-kit_block-grass-overhang-low-narrow
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'low', 'narrow', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_482',
        path: '/models/nature/platformer-kit_block-grass-overhang-low.glb', // platformer-kit_block-grass-overhang-low
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'low', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_483',
        path: '/models/nature/platformer-kit_block-grass-overhang-narrow.glb', // platformer-kit_block-grass-overhang-narrow
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'overhang', 'narrow', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_484',
        path: '/models/nature/platformer-kit_block-grass.glb', // platformer-kit_block-grass
        category: 'environment',
        keywords: ['platformer', 'kit', 'block', 'grass', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_485',
        path: '/models/nature/platformer-kit_flowers-tall.glb', // platformer-kit_flowers-tall
        category: 'environment',
        keywords: ['platformer', 'kit', 'flowers', 'tall', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_486',
        path: '/models/nature/platformer-kit_flowers.glb', // platformer-kit_flowers
        category: 'environment',
        keywords: ['platformer', 'kit', 'flowers', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_487',
        path: '/models/nature/platformer-kit_grass.glb', // platformer-kit_grass
        category: 'environment',
        keywords: ['platformer', 'kit', 'grass', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_488',
        path: '/models/nature/platformer-kit_mushrooms.glb', // platformer-kit_mushrooms
        category: 'environment',
        keywords: ['platformer', 'kit', 'mushrooms', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_489',
        path: '/models/nature/platformer-kit_plant.glb', // platformer-kit_plant
        category: 'environment',
        keywords: ['platformer', 'kit', 'plant', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_490',
        path: '/models/nature/platformer-kit_rocks.glb', // platformer-kit_rocks
        category: 'environment',
        keywords: ['platformer', 'kit', 'rocks', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_491',
        path: '/models/nature/platformer-kit_stones.glb', // platformer-kit_stones
        category: 'environment',
        keywords: ['platformer', 'kit', 'stones', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_492',
        path: '/models/nature/platformer-kit_tree-pine-small.glb', // platformer-kit_tree-pine-small
        category: 'environment',
        keywords: ['platformer', 'kit', 'tree', 'pine', 'small', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_493',
        path: '/models/nature/platformer-kit_tree-pine-snow-small.glb', // platformer-kit_tree-pine-snow-small
        category: 'environment',
        keywords: ['platformer', 'kit', 'tree', 'pine', 'snow', 'small', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_494',
        path: '/models/nature/platformer-kit_tree-pine-snow.glb', // platformer-kit_tree-pine-snow
        category: 'environment',
        keywords: ['platformer', 'kit', 'tree', 'pine', 'snow', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_495',
        path: '/models/nature/platformer-kit_tree-pine.glb', // platformer-kit_tree-pine
        category: 'environment',
        keywords: ['platformer', 'kit', 'tree', 'pine', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_496',
        path: '/models/nature/platformer-kit_tree-snow.glb', // platformer-kit_tree-snow
        category: 'environment',
        keywords: ['platformer', 'kit', 'tree', 'snow', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_497',
        path: '/models/nature/platformer-kit_tree.glb', // platformer-kit_tree
        category: 'environment',
        keywords: ['platformer', 'kit', 'tree', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_498',
        path: '/models/nature/rocks1.glb', // rocks1
        category: 'environment',
        keywords: ['rocks1', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_499',
        path: '/models/nature/rocks2.glb', // rocks2
        category: 'environment',
        keywords: ['rocks2', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_500',
        path: '/models/nature/rocks3.glb', // rocks3
        category: 'environment',
        keywords: ['rocks3', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_501',
        path: '/models/nature/rocks4.glb', // rocks4
        category: 'environment',
        keywords: ['rocks4', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_502',
        path: '/models/nature/three.js-examples_Flower.glb', // three.js-examples_Flower
        category: 'environment',
        keywords: ['three.js', 'examples', 'Flower', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_503',
        path: '/models/nature/three.js-examples_forest_house.glb', // three.js-examples_forest_house
        category: 'environment',
        keywords: ['three.js', 'examples', 'forest', 'house', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_504',
        path: '/models/nature/tombstone1.glb', // tombstone1
        category: 'environment',
        keywords: ['tombstone1', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_505',
        path: '/models/nature/tombstone10.glb', // tombstone10
        category: 'environment',
        keywords: ['tombstone10', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_506',
        path: '/models/nature/tombstone11.glb', // tombstone11
        category: 'environment',
        keywords: ['tombstone11', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_507',
        path: '/models/nature/tombstone1Weathered.glb', // tombstone1Weathered
        category: 'environment',
        keywords: ['tombstone1Weathered', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_508',
        path: '/models/nature/tombstone2.glb', // tombstone2
        category: 'environment',
        keywords: ['tombstone2', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_509',
        path: '/models/nature/tombstone2Weathered.glb', // tombstone2Weathered
        category: 'environment',
        keywords: ['tombstone2Weathered', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_510',
        path: '/models/nature/tombstone3.glb', // tombstone3
        category: 'environment',
        keywords: ['tombstone3', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_511',
        path: '/models/nature/tombstone4.glb', // tombstone4
        category: 'environment',
        keywords: ['tombstone4', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_512',
        path: '/models/nature/tombstone5.glb', // tombstone5
        category: 'environment',
        keywords: ['tombstone5', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_513',
        path: '/models/nature/tombstone5Weathered.glb', // tombstone5Weathered
        category: 'environment',
        keywords: ['tombstone5Weathered', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_514',
        path: '/models/nature/tombstone6.glb', // tombstone6
        category: 'environment',
        keywords: ['tombstone6', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_515',
        path: '/models/nature/tombstone7.glb', // tombstone7
        category: 'environment',
        keywords: ['tombstone7', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_516',
        path: '/models/nature/tombstone8.glb', // tombstone8
        category: 'environment',
        keywords: ['tombstone8', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_517',
        path: '/models/nature/tombstone9.glb', // tombstone9
        category: 'environment',
        keywords: ['tombstone9', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_518',
        path: '/models/nature/tree1.glb', // tree1
        category: 'environment',
        keywords: ['tree1', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_519',
        path: '/models/nature/tree2.glb', // tree2
        category: 'environment',
        keywords: ['tree2', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_520',
        path: '/models/nature/tree3.glb', // tree3
        category: 'environment',
        keywords: ['tree3', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_521',
        path: '/models/nature/tree4.glb', // tree4
        category: 'environment',
        keywords: ['tree4', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_522',
        path: '/models/nature/tree5.glb', // tree5
        category: 'environment',
        keywords: ['tree5', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_523',
        path: '/models/nature/tree6.glb', // tree6
        category: 'environment',
        keywords: ['tree6', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_524',
        path: '/models/nature/tree7.glb', // tree7
        category: 'environment',
        keywords: ['tree7', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_525',
        path: '/models/nature/tree8.glb', // tree8
        category: 'environment',
        keywords: ['tree8', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_526',
        path: '/models/nature/underwaterSceneRocksBarnaclesMussels.glb', // underwaterSceneRocksBarnaclesMussels
        category: 'environment',
        keywords: ['underwaterSceneRocksBarnaclesMussels', 'nature'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_527',
        path: '/models/props/babylon-assets_BoomBox.glb', // babylon-assets_BoomBox
        category: 'prop',
        keywords: ['babylon', 'assets', 'BoomBox', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_528',
        path: '/models/props/babylon-assets_Box.glb', // babylon-assets_Box
        category: 'prop',
        keywords: ['babylon', 'assets', 'Box', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_529',
        path: '/models/props/babylon-assets_BoxAnimated.glb', // babylon-assets_BoxAnimated
        category: 'prop',
        keywords: ['babylon', 'assets', 'BoxAnimated', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_530',
        path: '/models/props/babylon-assets_BoxInterleaved.glb', // babylon-assets_BoxInterleaved
        category: 'prop',
        keywords: ['babylon', 'assets', 'BoxInterleaved', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_531',
        path: '/models/props/babylon-assets_BoxTextured.glb', // babylon-assets_BoxTextured
        category: 'prop',
        keywords: ['babylon', 'assets', 'BoxTextured', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_532',
        path: '/models/props/babylon-assets_BoxVertexColors.glb', // babylon-assets_BoxVertexColors
        category: 'prop',
        keywords: ['babylon', 'assets', 'BoxVertexColors', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_533',
        path: '/models/props/babylon-assets_BoxWithoutIndices.glb', // babylon-assets_BoxWithoutIndices
        category: 'prop',
        keywords: ['babylon', 'assets', 'BoxWithoutIndices', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_534',
        path: '/models/props/babylon-assets_GearboxAssy.glb', // babylon-assets_GearboxAssy
        category: 'prop',
        keywords: ['babylon', 'assets', 'GearboxAssy', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_535',
        path: '/models/props/barrel.glb', // barrel
        category: 'prop',
        keywords: ['barrel', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_536',
        path: '/models/props/BoomBox.glb', // BoomBox
        category: 'prop',
        keywords: ['BoomBox', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_537',
        path: '/models/props/BoomBox_1769416633018.glb', // BoomBox_1769416633018
        category: 'prop',
        keywords: ['BoomBox', '1769416633018', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_538',
        path: '/models/props/Box-draco.glb', // Box-draco
        category: 'prop',
        keywords: ['Box', 'draco', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_539',
        path: '/models/props/Box.glb', // Box
        category: 'prop',
        keywords: ['Box', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_540',
        path: '/models/props/BoxAnimated.glb', // BoxAnimated
        category: 'prop',
        keywords: ['BoxAnimated', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_541',
        path: '/models/props/BoxInterleaved.glb', // BoxInterleaved
        category: 'prop',
        keywords: ['BoxInterleaved', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_542',
        path: '/models/props/BoxTextured.glb', // BoxTextured
        category: 'prop',
        keywords: ['BoxTextured', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_543',
        path: '/models/props/BoxTexturedNonPowerOfTwo.glb', // BoxTexturedNonPowerOfTwo
        category: 'prop',
        keywords: ['BoxTexturedNonPowerOfTwo', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_544',
        path: '/models/props/BoxVertexColors.glb', // BoxVertexColors
        category: 'prop',
        keywords: ['BoxVertexColors', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_545',
        path: '/models/props/box_1769416633021.glb', // box_1769416633021
        category: 'prop',
        keywords: ['box', '1769416633021', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_546',
        path: '/models/props/cornellBox.glb', // cornellBox
        category: 'prop',
        keywords: ['cornellBox', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_547',
        path: '/models/props/crate1.glb', // crate1
        category: 'prop',
        keywords: ['crate1', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_548',
        path: '/models/props/crate2.glb', // crate2
        category: 'prop',
        keywords: ['crate2', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_549',
        path: '/models/props/crateStack.glb', // crateStack
        category: 'prop',
        keywords: ['crateStack', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_550',
        path: '/models/props/detailed_realistic_model_albusdumbledore_02.glb', // detailed_realistic_model_albusdumbledore_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_551',
        path: '/models/props/detailed_realistic_model_albusdumbledore_03.glb', // detailed_realistic_model_albusdumbledore_03
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_552',
        path: '/models/props/detailed_realistic_model_albusdumbledore_04.glb', // detailed_realistic_model_albusdumbledore_04
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_553',
        path: '/models/props/detailed_realistic_model_albusdumbledore_05.glb', // detailed_realistic_model_albusdumbledore_05
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_554',
        path: '/models/props/detailed_realistic_model_albusdumbledore_06.glb', // detailed_realistic_model_albusdumbledore_06
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_555',
        path: '/models/props/detailed_realistic_model_albusdumbledore_07.glb', // detailed_realistic_model_albusdumbledore_07
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_556',
        path: '/models/props/detailed_realistic_model_albusdumbledore_08.glb', // detailed_realistic_model_albusdumbledore_08
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_557',
        path: '/models/props/detailed_realistic_model_albusdumbledore_09.glb', // detailed_realistic_model_albusdumbledore_09
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_558',
        path: '/models/props/detailed_realistic_model_albusdumbledore_10.glb', // detailed_realistic_model_albusdumbledore_10
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_559',
        path: '/models/props/detailed_realistic_model_albusdumbledore_11.glb', // detailed_realistic_model_albusdumbledore_11
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_560',
        path: '/models/props/detailed_realistic_model_albusdumbledore_12.glb', // detailed_realistic_model_albusdumbledore_12
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_561',
        path: '/models/props/detailed_realistic_model_albusdumbledore_13.glb', // detailed_realistic_model_albusdumbledore_13
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_562',
        path: '/models/props/detailed_realistic_model_albusdumbledore_14.glb', // detailed_realistic_model_albusdumbledore_14
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_563',
        path: '/models/props/detailed_realistic_model_albusdumbledore_15.glb', // detailed_realistic_model_albusdumbledore_15
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_564',
        path: '/models/props/detailed_realistic_model_albusdumbledore_16.glb', // detailed_realistic_model_albusdumbledore_16
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_565',
        path: '/models/props/detailed_realistic_model_albusdumbledore_17.glb', // detailed_realistic_model_albusdumbledore_17
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_566',
        path: '/models/props/detailed_realistic_model_albusdumbledore_18.glb', // detailed_realistic_model_albusdumbledore_18
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_567',
        path: '/models/props/detailed_realistic_model_albusdumbledore_19.glb', // detailed_realistic_model_albusdumbledore_19
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_568',
        path: '/models/props/detailed_realistic_model_albusdumbledore_20.glb', // detailed_realistic_model_albusdumbledore_20
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_569',
        path: '/models/props/detailed_realistic_model_albusdumbledore_21.glb', // detailed_realistic_model_albusdumbledore_21
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_570',
        path: '/models/props/detailed_realistic_model_albusdumbledore_22.glb', // detailed_realistic_model_albusdumbledore_22
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_571',
        path: '/models/props/detailed_realistic_model_albusdumbledore_23.glb', // detailed_realistic_model_albusdumbledore_23
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_572',
        path: '/models/props/detailed_realistic_model_albusdumbledore_24.glb', // detailed_realistic_model_albusdumbledore_24
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_573',
        path: '/models/props/detailed_realistic_model_albusdumbledore_25.glb', // detailed_realistic_model_albusdumbledore_25
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_574',
        path: '/models/props/detailed_realistic_model_albusdumbledore_26.glb', // detailed_realistic_model_albusdumbledore_26
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_575',
        path: '/models/props/detailed_realistic_model_albusdumbledore_27.glb', // detailed_realistic_model_albusdumbledore_27
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_576',
        path: '/models/props/detailed_realistic_model_albusdumbledore_28.glb', // detailed_realistic_model_albusdumbledore_28
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'albusdumbledore', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_577',
        path: '/models/props/detailed_realistic_model_dark_01.glb', // detailed_realistic_model_dark_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'dark', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_578',
        path: '/models/props/detailed_realistic_model_default_01.glb', // detailed_realistic_model_default_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'default', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_579',
        path: '/models/props/detailed_realistic_model_default_02.glb', // detailed_realistic_model_default_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'default', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_580',
        path: '/models/props/detailed_realistic_model_default_03.glb', // detailed_realistic_model_default_03
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'default', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_581',
        path: '/models/props/detailed_realistic_model_default_04.glb', // detailed_realistic_model_default_04
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'default', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_582',
        path: '/models/props/detailed_realistic_model_default_05.glb', // detailed_realistic_model_default_05
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'default', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_583',
        path: '/models/props/detailed_realistic_model_floatingcandles_02.glb', // detailed_realistic_model_floatingcandles_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_584',
        path: '/models/props/detailed_realistic_model_floatingcandles_03.glb', // detailed_realistic_model_floatingcandles_03
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_585',
        path: '/models/props/detailed_realistic_model_floatingcandles_04.glb', // detailed_realistic_model_floatingcandles_04
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_586',
        path: '/models/props/detailed_realistic_model_floatingcandles_05.glb', // detailed_realistic_model_floatingcandles_05
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_587',
        path: '/models/props/detailed_realistic_model_floatingcandles_06.glb', // detailed_realistic_model_floatingcandles_06
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_588',
        path: '/models/props/detailed_realistic_model_floatingcandles_07.glb', // detailed_realistic_model_floatingcandles_07
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_589',
        path: '/models/props/detailed_realistic_model_floatingcandles_08.glb', // detailed_realistic_model_floatingcandles_08
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_590',
        path: '/models/props/detailed_realistic_model_floatingcandles_09.glb', // detailed_realistic_model_floatingcandles_09
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_591',
        path: '/models/props/detailed_realistic_model_floatingcandles_10.glb', // detailed_realistic_model_floatingcandles_10
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_592',
        path: '/models/props/detailed_realistic_model_floatingcandles_11.glb', // detailed_realistic_model_floatingcandles_11
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_593',
        path: '/models/props/detailed_realistic_model_floatingcandles_12.glb', // detailed_realistic_model_floatingcandles_12
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_594',
        path: '/models/props/detailed_realistic_model_floatingcandles_13.glb', // detailed_realistic_model_floatingcandles_13
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_595',
        path: '/models/props/detailed_realistic_model_floatingcandles_14.glb', // detailed_realistic_model_floatingcandles_14
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_596',
        path: '/models/props/detailed_realistic_model_floatingcandles_15.glb', // detailed_realistic_model_floatingcandles_15
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_597',
        path: '/models/props/detailed_realistic_model_floatingcandles_16.glb', // detailed_realistic_model_floatingcandles_16
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_598',
        path: '/models/props/detailed_realistic_model_floatingcandles_17.glb', // detailed_realistic_model_floatingcandles_17
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_599',
        path: '/models/props/detailed_realistic_model_floatingcandles_18.glb', // detailed_realistic_model_floatingcandles_18
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_600',
        path: '/models/props/detailed_realistic_model_floatingcandles_19.glb', // detailed_realistic_model_floatingcandles_19
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_601',
        path: '/models/props/detailed_realistic_model_floatingcandles_20.glb', // detailed_realistic_model_floatingcandles_20
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_602',
        path: '/models/props/detailed_realistic_model_floatingcandles_21.glb', // detailed_realistic_model_floatingcandles_21
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_603',
        path: '/models/props/detailed_realistic_model_floatingcandles_22.glb', // detailed_realistic_model_floatingcandles_22
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_604',
        path: '/models/props/detailed_realistic_model_floatingcandles_23.glb', // detailed_realistic_model_floatingcandles_23
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_605',
        path: '/models/props/detailed_realistic_model_floatingcandles_24.glb', // detailed_realistic_model_floatingcandles_24
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_606',
        path: '/models/props/detailed_realistic_model_floatingcandles_25.glb', // detailed_realistic_model_floatingcandles_25
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_607',
        path: '/models/props/detailed_realistic_model_floatingcandles_26.glb', // detailed_realistic_model_floatingcandles_26
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_608',
        path: '/models/props/detailed_realistic_model_floatingcandles_27.glb', // detailed_realistic_model_floatingcandles_27
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_609',
        path: '/models/props/detailed_realistic_model_floatingcandles_28.glb', // detailed_realistic_model_floatingcandles_28
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_610',
        path: '/models/props/detailed_realistic_model_floatingcandles_29.glb', // detailed_realistic_model_floatingcandles_29
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_611',
        path: '/models/props/detailed_realistic_model_floatingcandles_30.glb', // detailed_realistic_model_floatingcandles_30
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floatingcandles', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_612',
        path: '/models/props/detailed_realistic_model_floating_01.glb', // detailed_realistic_model_floating_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floating', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_613',
        path: '/models/props/detailed_realistic_model_floating_02.glb', // detailed_realistic_model_floating_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'floating', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_614',
        path: '/models/props/detailed_realistic_model_ghostly_01.glb', // detailed_realistic_model_ghostly_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'ghostly', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_615',
        path: '/models/props/detailed_realistic_model_glass_01.glb', // detailed_realistic_model_glass_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'glass', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_616',
        path: '/models/props/detailed_realistic_model_glass_02.glb', // detailed_realistic_model_glass_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'glass', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_617',
        path: '/models/props/detailed_realistic_model_goldensnitch_01.glb', // detailed_realistic_model_goldensnitch_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'goldensnitch', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_618',
        path: '/models/props/detailed_realistic_model_goldensnitch_02.glb', // detailed_realistic_model_goldensnitch_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'goldensnitch', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_619',
        path: '/models/props/detailed_realistic_model_hogwarts_01.glb', // detailed_realistic_model_hogwarts_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'hogwarts', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_620',
        path: '/models/props/detailed_realistic_model_leatherbound_01.glb', // detailed_realistic_model_leatherbound_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'leatherbound', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_621',
        path: '/models/props/detailed_realistic_model_leatherbound_02.glb', // detailed_realistic_model_leatherbound_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'leatherbound', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_622',
        path: '/models/props/detailed_realistic_model_magic_01.glb', // detailed_realistic_model_magic_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'magic', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_623',
        path: '/models/props/detailed_realistic_model_portrait_01.glb', // detailed_realistic_model_portrait_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'portrait', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_624',
        path: '/models/props/detailed_realistic_model_portrait_02.glb', // detailed_realistic_model_portrait_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'portrait', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_625',
        path: '/models/props/detailed_realistic_model_potions_01.glb', // detailed_realistic_model_potions_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'potions', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_626',
        path: '/models/props/detailed_realistic_model_potions_02.glb', // detailed_realistic_model_potions_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'potions', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_627',
        path: '/models/props/detailed_realistic_model_sleeping_01.glb', // detailed_realistic_model_sleeping_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sleeping', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_628',
        path: '/models/props/detailed_realistic_model_solid_01.glb', // detailed_realistic_model_solid_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_629',
        path: '/models/props/detailed_realistic_model_solid_02.glb', // detailed_realistic_model_solid_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_630',
        path: '/models/props/detailed_realistic_model_solid_03.glb', // detailed_realistic_model_solid_03
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_631',
        path: '/models/props/detailed_realistic_model_solid_04.glb', // detailed_realistic_model_solid_04
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_632',
        path: '/models/props/detailed_realistic_model_solid_05.glb', // detailed_realistic_model_solid_05
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_633',
        path: '/models/props/detailed_realistic_model_solid_06.glb', // detailed_realistic_model_solid_06
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_634',
        path: '/models/props/detailed_realistic_model_solid_07.glb', // detailed_realistic_model_solid_07
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_635',
        path: '/models/props/detailed_realistic_model_solid_08.glb', // detailed_realistic_model_solid_08
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_636',
        path: '/models/props/detailed_realistic_model_solid_09.glb', // detailed_realistic_model_solid_09
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_637',
        path: '/models/props/detailed_realistic_model_solid_10.glb', // detailed_realistic_model_solid_10
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_638',
        path: '/models/props/detailed_realistic_model_solid_11.glb', // detailed_realistic_model_solid_11
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_639',
        path: '/models/props/detailed_realistic_model_solid_12.glb', // detailed_realistic_model_solid_12
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_640',
        path: '/models/props/detailed_realistic_model_solid_13.glb', // detailed_realistic_model_solid_13
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_641',
        path: '/models/props/detailed_realistic_model_solid_14.glb', // detailed_realistic_model_solid_14
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_642',
        path: '/models/props/detailed_realistic_model_solid_15.glb', // detailed_realistic_model_solid_15
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_643',
        path: '/models/props/detailed_realistic_model_solid_16.glb', // detailed_realistic_model_solid_16
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_644',
        path: '/models/props/detailed_realistic_model_solid_17.glb', // detailed_realistic_model_solid_17
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_645',
        path: '/models/props/detailed_realistic_model_solid_18.glb', // detailed_realistic_model_solid_18
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'solid', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_646',
        path: '/models/props/detailed_realistic_model_sortinghat_01.glb', // detailed_realistic_model_sortinghat_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_647',
        path: '/models/props/detailed_realistic_model_sortinghat_02.glb', // detailed_realistic_model_sortinghat_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_648',
        path: '/models/props/detailed_realistic_model_sortinghat_03.glb', // detailed_realistic_model_sortinghat_03
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_649',
        path: '/models/props/detailed_realistic_model_sortinghat_04.glb', // detailed_realistic_model_sortinghat_04
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_650',
        path: '/models/props/detailed_realistic_model_sortinghat_05.glb', // detailed_realistic_model_sortinghat_05
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_651',
        path: '/models/props/detailed_realistic_model_sortinghat_06.glb', // detailed_realistic_model_sortinghat_06
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_652',
        path: '/models/props/detailed_realistic_model_sortinghat_07.glb', // detailed_realistic_model_sortinghat_07
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_653',
        path: '/models/props/detailed_realistic_model_sortinghat_08.glb', // detailed_realistic_model_sortinghat_08
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_654',
        path: '/models/props/detailed_realistic_model_sortinghat_09.glb', // detailed_realistic_model_sortinghat_09
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_655',
        path: '/models/props/detailed_realistic_model_sortinghat_10.glb', // detailed_realistic_model_sortinghat_10
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_656',
        path: '/models/props/detailed_realistic_model_sortinghat_11.glb', // detailed_realistic_model_sortinghat_11
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_657',
        path: '/models/props/detailed_realistic_model_sortinghat_12.glb', // detailed_realistic_model_sortinghat_12
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_658',
        path: '/models/props/detailed_realistic_model_sortinghat_13.glb', // detailed_realistic_model_sortinghat_13
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_659',
        path: '/models/props/detailed_realistic_model_sortinghat_14.glb', // detailed_realistic_model_sortinghat_14
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_660',
        path: '/models/props/detailed_realistic_model_sortinghat_15.glb', // detailed_realistic_model_sortinghat_15
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_661',
        path: '/models/props/detailed_realistic_model_sortinghat_16.glb', // detailed_realistic_model_sortinghat_16
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sortinghat', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_662',
        path: '/models/props/detailed_realistic_model_sorting_01.glb', // detailed_realistic_model_sorting_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sorting', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_663',
        path: '/models/props/detailed_realistic_model_sorting_01_1769413346495.glb', // detailed_realistic_model_sorting_01_1769413346495
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sorting', '1769413346495', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_664',
        path: '/models/props/detailed_realistic_model_sorting_02.glb', // detailed_realistic_model_sorting_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'sorting', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_665',
        path: '/models/props/detailed_realistic_model_stack_01.glb', // detailed_realistic_model_stack_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'stack', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_666',
        path: '/models/props/detailed_realistic_model_stack_02.glb', // detailed_realistic_model_stack_02
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'stack', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_667',
        path: '/models/props/detailed_realistic_model_test_01.glb', // detailed_realistic_model_test_01
        category: 'prop',
        keywords: ['detailed', 'realistic', 'model', 'test', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_668',
        path: '/models/props/ExplodingBarrel.glb', // ExplodingBarrel
        category: 'prop',
        keywords: ['ExplodingBarrel', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_669',
        path: '/models/props/gemOnly.glb', // gemOnly
        category: 'prop',
        keywords: ['gemOnly', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_670',
        path: '/models/props/GlassHurricaneCandleHolder.glb', // GlassHurricaneCandleHolder
        category: 'prop',
        keywords: ['GlassHurricaneCandleHolder', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_671',
        path: '/models/props/graveyard-kit_candle-multiple.glb', // graveyard-kit_candle-multiple
        category: 'prop',
        keywords: ['graveyard', 'kit', 'candle', 'multiple', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_672',
        path: '/models/props/graveyard-kit_candle.glb', // graveyard-kit_candle
        category: 'prop',
        keywords: ['graveyard', 'kit', 'candle', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_673',
        path: '/models/props/graveyard-kit_lantern-candle.glb', // graveyard-kit_lantern-candle
        category: 'prop',
        keywords: ['graveyard', 'kit', 'lantern', 'candle', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_674',
        path: '/models/props/platformer-kit_barrel.glb', // platformer-kit_barrel
        category: 'prop',
        keywords: ['platformer', 'kit', 'barrel', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_675',
        path: '/models/props/platformer-kit_chest.glb', // platformer-kit_chest
        category: 'prop',
        keywords: ['platformer', 'kit', 'chest', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_676',
        path: '/models/props/platformer-kit_coin-bronze.glb', // platformer-kit_coin-bronze
        category: 'prop',
        keywords: ['platformer', 'kit', 'coin', 'bronze', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_677',
        path: '/models/props/platformer-kit_coin-gold.glb', // platformer-kit_coin-gold
        category: 'prop',
        keywords: ['platformer', 'kit', 'coin', 'gold', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_678',
        path: '/models/props/platformer-kit_coin-silver.glb', // platformer-kit_coin-silver
        category: 'prop',
        keywords: ['platformer', 'kit', 'coin', 'silver', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_679',
        path: '/models/props/platformer-kit_crate-item-strong.glb', // platformer-kit_crate-item-strong
        category: 'prop',
        keywords: ['platformer', 'kit', 'crate', 'item', 'strong', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_680',
        path: '/models/props/platformer-kit_crate-item.glb', // platformer-kit_crate-item
        category: 'prop',
        keywords: ['platformer', 'kit', 'crate', 'item', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_681',
        path: '/models/props/platformer-kit_crate-strong.glb', // platformer-kit_crate-strong
        category: 'prop',
        keywords: ['platformer', 'kit', 'crate', 'strong', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_682',
        path: '/models/props/platformer-kit_crate.glb', // platformer-kit_crate
        category: 'prop',
        keywords: ['platformer', 'kit', 'crate', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_683',
        path: '/models/props/platformer-kit_flag.glb', // platformer-kit_flag
        category: 'prop',
        keywords: ['platformer', 'kit', 'flag', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_684',
        path: '/models/props/platformer-kit_key.glb', // platformer-kit_key
        category: 'prop',
        keywords: ['platformer', 'kit', 'key', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_685',
        path: '/models/props/three.js-examples_BoomBox.glb', // three.js-examples_BoomBox
        category: 'prop',
        keywords: ['three.js', 'examples', 'BoomBox', 'props'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_686',
        path: '/models/samples/ABeautifulGame.glb', // ABeautifulGame
        category: 'prop',
        keywords: ['ABeautifulGame', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_687',
        path: '/models/samples/alien.glb', // alien
        category: 'prop',
        keywords: ['alien', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_688',
        path: '/models/samples/AnimatedColorsCube.glb', // AnimatedColorsCube
        category: 'prop',
        keywords: ['AnimatedColorsCube', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_689',
        path: '/models/samples/AnimationPointerUVs.glb', // AnimationPointerUVs
        category: 'prop',
        keywords: ['AnimationPointerUVs', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_690',
        path: '/models/samples/AntiqueCamera.glb', // AntiqueCamera
        category: 'prop',
        keywords: ['AntiqueCamera', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_691',
        path: '/models/samples/Avocado.glb', // Avocado
        category: 'prop',
        keywords: ['Avocado', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_692',
        path: '/models/samples/babylon-assets_2CylinderEngine.glb', // babylon-assets_2CylinderEngine
        category: 'prop',
        keywords: ['babylon', 'assets', '2CylinderEngine', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_693',
        path: '/models/samples/babylon-assets_Avocado.glb', // babylon-assets_Avocado
        category: 'prop',
        keywords: ['babylon', 'assets', 'Avocado', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_694',
        path: '/models/samples/babylon-assets_BrainStem.glb', // babylon-assets_BrainStem
        category: 'prop',
        keywords: ['babylon', 'assets', 'BrainStem', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_695',
        path: '/models/samples/babylon-assets_Corset.glb', // babylon-assets_Corset
        category: 'prop',
        keywords: ['babylon', 'assets', 'Corset', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_696',
        path: '/models/samples/babylon-assets_Duck.glb', // babylon-assets_Duck
        category: 'prop',
        keywords: ['babylon', 'assets', 'Duck', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_697',
        path: '/models/samples/babylon-assets_Lantern.glb', // babylon-assets_Lantern
        category: 'prop',
        keywords: ['babylon', 'assets', 'Lantern', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_698',
        path: '/models/samples/babylon-assets_MetalRoughSpheres.glb', // babylon-assets_MetalRoughSpheres
        category: 'prop',
        keywords: ['babylon', 'assets', 'MetalRoughSpheres', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_699',
        path: '/models/samples/babylon-assets_RiggedFigure.glb', // babylon-assets_RiggedFigure
        category: 'prop',
        keywords: ['babylon', 'assets', 'RiggedFigure', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_700',
        path: '/models/samples/babylon-assets_RiggedSimple.glb', // babylon-assets_RiggedSimple
        category: 'prop',
        keywords: ['babylon', 'assets', 'RiggedSimple', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_701',
        path: '/models/samples/babylon-assets_SmilingFace.glb', // babylon-assets_SmilingFace
        category: 'prop',
        keywords: ['babylon', 'assets', 'SmilingFace', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_702',
        path: '/models/samples/babylon-assets_TextureSettingsTest.glb', // babylon-assets_TextureSettingsTest
        category: 'prop',
        keywords: ['babylon', 'assets', 'TextureSettingsTest', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_703',
        path: '/models/samples/babylon-assets_VC.glb', // babylon-assets_VC
        category: 'prop',
        keywords: ['babylon', 'assets', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_704',
        path: '/models/samples/babylon-assets_WalkingLady.glb', // babylon-assets_WalkingLady
        category: 'prop',
        keywords: ['babylon', 'assets', 'WalkingLady', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_705',
        path: '/models/samples/babylonBuoy.glb', // babylonBuoy
        category: 'prop',
        keywords: ['babylonBuoy', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_706',
        path: '/models/samples/BabylonShaderBall_Simple.glb', // BabylonShaderBall_Simple
        category: 'prop',
        keywords: ['BabylonShaderBall', 'Simple', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_707',
        path: '/models/samples/ballMesh.glb', // ballMesh
        category: 'prop',
        keywords: ['ballMesh', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_708',
        path: '/models/samples/bars.glb', // bars
        category: 'prop',
        keywords: ['bars', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_709',
        path: '/models/samples/Bee.glb', // Bee
        category: 'prop',
        keywords: ['Bee', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_710',
        path: '/models/samples/blackPearl.glb', // blackPearl
        category: 'prop',
        keywords: ['blackPearl', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_711',
        path: '/models/samples/BrainStem.glb', // BrainStem
        category: 'prop',
        keywords: ['BrainStem', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_712',
        path: '/models/samples/cannon.glb', // cannon
        category: 'prop',
        keywords: ['cannon', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_713',
        path: '/models/samples/ceiling corner.glb', // ceiling corner
        category: 'prop',
        keywords: ['ceiling', 'corner', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_714',
        path: '/models/samples/ceiling straight.glb', // ceiling straight
        category: 'prop',
        keywords: ['ceiling', 'straight', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_715',
        path: '/models/samples/ceiling.glb', // ceiling
        category: 'prop',
        keywords: ['ceiling', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_716',
        path: '/models/samples/ChronographWatch.glb', // ChronographWatch
        category: 'prop',
        keywords: ['ChronographWatch', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_717',
        path: '/models/samples/clothFolds.glb', // clothFolds
        category: 'prop',
        keywords: ['clothFolds', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_718',
        path: '/models/samples/cloth_meshV1.glb', // cloth_meshV1
        category: 'prop',
        keywords: ['cloth', 'meshV1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_719',
        path: '/models/samples/cloth_meshV2.glb', // cloth_meshV2
        category: 'prop',
        keywords: ['cloth', 'meshV2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_720',
        path: '/models/samples/cloth_meshV3.glb', // cloth_meshV3
        category: 'prop',
        keywords: ['cloth', 'meshV3', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_721',
        path: '/models/samples/cloth_meshV4.glb', // cloth_meshV4
        category: 'prop',
        keywords: ['cloth', 'meshV4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_722',
        path: '/models/samples/cloth_meshV5.glb', // cloth_meshV5
        category: 'prop',
        keywords: ['cloth', 'meshV5', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_723',
        path: '/models/samples/cloth_meshV6.glb', // cloth_meshV6
        category: 'prop',
        keywords: ['cloth', 'meshV6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_724',
        path: '/models/samples/cloth_meshV7.glb', // cloth_meshV7
        category: 'prop',
        keywords: ['cloth', 'meshV7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_725',
        path: '/models/samples/cloth_meshV8.glb', // cloth_meshV8
        category: 'prop',
        keywords: ['cloth', 'meshV8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_726',
        path: '/models/samples/cloth_meshV9.glb', // cloth_meshV9
        category: 'prop',
        keywords: ['cloth', 'meshV9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_727',
        path: '/models/samples/coffin.glb', // coffin
        category: 'prop',
        keywords: ['coffin', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_728',
        path: '/models/samples/coffinOpen.glb', // coffinOpen
        category: 'prop',
        keywords: ['coffinOpen', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_729',
        path: '/models/samples/CommercialRefrigerator.glb', // CommercialRefrigerator
        category: 'prop',
        keywords: ['CommercialRefrigerator', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_730',
        path: '/models/samples/corner.glb', // corner
        category: 'prop',
        keywords: ['corner', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_731',
        path: '/models/samples/corner2.glb', // corner2
        category: 'prop',
        keywords: ['corner2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_732',
        path: '/models/samples/Corset.glb', // Corset
        category: 'prop',
        keywords: ['Corset', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_733',
        path: '/models/samples/cottage.glb', // cottage
        category: 'prop',
        keywords: ['cottage', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_734',
        path: '/models/samples/D20_Animation.glb', // D20_Animation
        category: 'prop',
        keywords: ['D20', 'Animation', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_735',
        path: '/models/samples/DirectionalLight.glb', // DirectionalLight
        category: 'prop',
        keywords: ['DirectionalLight', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_736',
        path: '/models/samples/Duck.glb', // Duck
        category: 'prop',
        keywords: ['Duck', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_737',
        path: '/models/samples/emoji_heart.glb', // emoji_heart
        category: 'prop',
        keywords: ['emoji', 'heart', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_738',
        path: '/models/samples/fantasy-town-kit_blade.glb', // fantasy-town-kit_blade
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'blade', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_739',
        path: '/models/samples/fantasy-town-kit_fountain-corner-inner.glb', // fantasy-town-kit_fountain-corner-inner
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'fountain', 'corner', 'inner', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_740',
        path: '/models/samples/fantasy-town-kit_fountain-curved.glb', // fantasy-town-kit_fountain-curved
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'fountain', 'curved', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_741',
        path: '/models/samples/fantasy-town-kit_fountain-round-detail.glb', // fantasy-town-kit_fountain-round-detail
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'fountain', 'round', 'detail', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_742',
        path: '/models/samples/fantasy-town-kit_fountain-round.glb', // fantasy-town-kit_fountain-round
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'fountain', 'round', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_743',
        path: '/models/samples/fantasy-town-kit_fountain-square-detail.glb', // fantasy-town-kit_fountain-square-detail
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'fountain', 'square', 'detail', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_744',
        path: '/models/samples/fantasy-town-kit_fountain-square.glb', // fantasy-town-kit_fountain-square
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'fountain', 'square', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_745',
        path: '/models/samples/fantasy-town-kit_hedge-curved.glb', // fantasy-town-kit_hedge-curved
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'hedge', 'curved', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_746',
        path: '/models/samples/fantasy-town-kit_hedge-large-curved.glb', // fantasy-town-kit_hedge-large-curved
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'hedge', 'large', 'curved', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_747',
        path: '/models/samples/fantasy-town-kit_lantern.glb', // fantasy-town-kit_lantern
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'lantern', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_748',
        path: '/models/samples/fantasy-town-kit_planks-opening.glb', // fantasy-town-kit_planks-opening
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'planks', 'opening', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_749',
        path: '/models/samples/fantasy-town-kit_planks.glb', // fantasy-town-kit_planks
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'planks', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_750',
        path: '/models/samples/fantasy-town-kit_road-bend.glb', // fantasy-town-kit_road-bend
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'road', 'bend', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_751',
        path: '/models/samples/fantasy-town-kit_road-corner-inner.glb', // fantasy-town-kit_road-corner-inner
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'road', 'corner', 'inner', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_752',
        path: '/models/samples/fantasy-town-kit_road-corner.glb', // fantasy-town-kit_road-corner
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'road', 'corner', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_753',
        path: '/models/samples/fantasy-town-kit_stairs-wide-wood-handrail.glb', // fantasy-town-kit_stairs-wide-wood-handrail
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'wide', 'wood', 'handrail', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_754',
        path: '/models/samples/fantasy-town-kit_stairs-wide-wood.glb', // fantasy-town-kit_stairs-wide-wood
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'wide', 'wood', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_755',
        path: '/models/samples/fantasy-town-kit_stairs-wood-handrail.glb', // fantasy-town-kit_stairs-wood-handrail
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'wood', 'handrail', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_756',
        path: '/models/samples/fantasy-town-kit_stairs-wood.glb', // fantasy-town-kit_stairs-wood
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'wood', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_757',
        path: '/models/samples/fantasy-town-kit_stall-green.glb', // fantasy-town-kit_stall-green
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'stall', 'green', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_758',
        path: '/models/samples/fantasy-town-kit_stall-red.glb', // fantasy-town-kit_stall-red
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'stall', 'red', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_759',
        path: '/models/samples/fantasy-town-kit_stall.glb', // fantasy-town-kit_stall
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'stall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_760',
        path: '/models/samples/fantasy-town-kit_watermill-wide.glb', // fantasy-town-kit_watermill-wide
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'watermill', 'wide', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_761',
        path: '/models/samples/fantasy-town-kit_watermill.glb', // fantasy-town-kit_watermill
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'watermill', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_762',
        path: '/models/samples/fantasy-town-kit_wheel.glb', // fantasy-town-kit_wheel
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'wheel', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_763',
        path: '/models/samples/fantasy-town-kit_windmill.glb', // fantasy-town-kit_windmill
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'windmill', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_764',
        path: '/models/samples/Gap.glb', // Gap
        category: 'prop',
        keywords: ['Gap', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_765',
        path: '/models/samples/gothic_cloister_corner.glb', // gothic_cloister_corner
        category: 'prop',
        keywords: ['gothic', 'cloister', 'corner', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_766',
        path: '/models/samples/graveyard-kit_altar-wood.glb', // graveyard-kit_altar-wood
        category: 'prop',
        keywords: ['graveyard', 'kit', 'altar', 'wood', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_767',
        path: '/models/samples/graveyard-kit_border-pillar.glb', // graveyard-kit_border-pillar
        category: 'prop',
        keywords: ['graveyard', 'kit', 'border', 'pillar', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_768',
        path: '/models/samples/graveyard-kit_coffin-old.glb', // graveyard-kit_coffin-old
        category: 'prop',
        keywords: ['graveyard', 'kit', 'coffin', 'old', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_769',
        path: '/models/samples/graveyard-kit_coffin.glb', // graveyard-kit_coffin
        category: 'prop',
        keywords: ['graveyard', 'kit', 'coffin', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_770',
        path: '/models/samples/graveyard-kit_cross-wood.glb', // graveyard-kit_cross-wood
        category: 'prop',
        keywords: ['graveyard', 'kit', 'cross', 'wood', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_771',
        path: '/models/samples/graveyard-kit_cross.glb', // graveyard-kit_cross
        category: 'prop',
        keywords: ['graveyard', 'kit', 'cross', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_772',
        path: '/models/samples/graveyard-kit_crypt-a.glb', // graveyard-kit_crypt-a
        category: 'prop',
        keywords: ['graveyard', 'kit', 'crypt', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_773',
        path: '/models/samples/graveyard-kit_crypt-b.glb', // graveyard-kit_crypt-b
        category: 'prop',
        keywords: ['graveyard', 'kit', 'crypt', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_774',
        path: '/models/samples/graveyard-kit_crypt-large.glb', // graveyard-kit_crypt-large
        category: 'prop',
        keywords: ['graveyard', 'kit', 'crypt', 'large', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_775',
        path: '/models/samples/graveyard-kit_crypt-small.glb', // graveyard-kit_crypt-small
        category: 'prop',
        keywords: ['graveyard', 'kit', 'crypt', 'small', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_776',
        path: '/models/samples/graveyard-kit_crypt.glb', // graveyard-kit_crypt
        category: 'prop',
        keywords: ['graveyard', 'kit', 'crypt', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_777',
        path: '/models/samples/graveyard-kit_debris-wood.glb', // graveyard-kit_debris-wood
        category: 'prop',
        keywords: ['graveyard', 'kit', 'debris', 'wood', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_778',
        path: '/models/samples/graveyard-kit_debris.glb', // graveyard-kit_debris
        category: 'prop',
        keywords: ['graveyard', 'kit', 'debris', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_779',
        path: '/models/samples/graveyard-kit_detail-chalice.glb', // graveyard-kit_detail-chalice
        category: 'prop',
        keywords: ['graveyard', 'kit', 'detail', 'chalice', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_780',
        path: '/models/samples/graveyard-kit_fire-basket.glb', // graveyard-kit_fire-basket
        category: 'prop',
        keywords: ['graveyard', 'kit', 'fire', 'basket', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_781',
        path: '/models/samples/graveyard-kit_grave-border.glb', // graveyard-kit_grave-border
        category: 'prop',
        keywords: ['graveyard', 'kit', 'grave', 'border', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_782',
        path: '/models/samples/graveyard-kit_grave.glb', // graveyard-kit_grave
        category: 'prop',
        keywords: ['graveyard', 'kit', 'grave', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_783',
        path: '/models/samples/graveyard-kit_hay-bale-bundled.glb', // graveyard-kit_hay-bale-bundled
        category: 'prop',
        keywords: ['graveyard', 'kit', 'hay', 'bale', 'bundled', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_784',
        path: '/models/samples/graveyard-kit_hay-bale.glb', // graveyard-kit_hay-bale
        category: 'prop',
        keywords: ['graveyard', 'kit', 'hay', 'bale', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_785',
        path: '/models/samples/graveyard-kit_lantern-glass.glb', // graveyard-kit_lantern-glass
        category: 'prop',
        keywords: ['graveyard', 'kit', 'lantern', 'glass', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_786',
        path: '/models/samples/graveyard-kit_lightpost-all.glb', // graveyard-kit_lightpost-all
        category: 'prop',
        keywords: ['graveyard', 'kit', 'lightpost', 'all', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_787',
        path: '/models/samples/graveyard-kit_lightpost-double.glb', // graveyard-kit_lightpost-double
        category: 'prop',
        keywords: ['graveyard', 'kit', 'lightpost', 'double', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_788',
        path: '/models/samples/graveyard-kit_lightpost-single.glb', // graveyard-kit_lightpost-single
        category: 'prop',
        keywords: ['graveyard', 'kit', 'lightpost', 'single', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_789',
        path: '/models/samples/graveyard-kit_pillar-large.glb', // graveyard-kit_pillar-large
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pillar', 'large', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_790',
        path: '/models/samples/graveyard-kit_pillar-small.glb', // graveyard-kit_pillar-small
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pillar', 'small', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_791',
        path: '/models/samples/graveyard-kit_pillar-square.glb', // graveyard-kit_pillar-square
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pillar', 'square', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_792',
        path: '/models/samples/graveyard-kit_pine-crooked.glb', // graveyard-kit_pine-crooked
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pine', 'crooked', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_793',
        path: '/models/samples/graveyard-kit_pine-fall-crooked.glb', // graveyard-kit_pine-fall-crooked
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pine', 'fall', 'crooked', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_794',
        path: '/models/samples/graveyard-kit_pine-fall.glb', // graveyard-kit_pine-fall
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pine', 'fall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_795',
        path: '/models/samples/graveyard-kit_pine.glb', // graveyard-kit_pine
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pine', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_796',
        path: '/models/samples/graveyard-kit_pumpkin-tall.glb', // graveyard-kit_pumpkin-tall
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pumpkin', 'tall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_797',
        path: '/models/samples/graveyard-kit_pumpkin.glb', // graveyard-kit_pumpkin
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pumpkin', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_798',
        path: '/models/samples/graveyard-kit_road.glb', // graveyard-kit_road
        category: 'prop',
        keywords: ['graveyard', 'kit', 'road', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_799',
        path: '/models/samples/graveyard-kit_shovel-dirt.glb', // graveyard-kit_shovel-dirt
        category: 'prop',
        keywords: ['graveyard', 'kit', 'shovel', 'dirt', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_800',
        path: '/models/samples/graveyard-kit_shovel.glb', // graveyard-kit_shovel
        category: 'prop',
        keywords: ['graveyard', 'kit', 'shovel', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_801',
        path: '/models/samples/graveyard-kit_trunk-long.glb', // graveyard-kit_trunk-long
        category: 'prop',
        keywords: ['graveyard', 'kit', 'trunk', 'long', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_802',
        path: '/models/samples/graveyard-kit_trunk.glb', // graveyard-kit_trunk
        category: 'prop',
        keywords: ['graveyard', 'kit', 'trunk', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_803',
        path: '/models/samples/graveyard-kit_urn-round.glb', // graveyard-kit_urn-round
        category: 'prop',
        keywords: ['graveyard', 'kit', 'urn', 'round', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_804',
        path: '/models/samples/graveyard-kit_urn-square.glb', // graveyard-kit_urn-square
        category: 'prop',
        keywords: ['graveyard', 'kit', 'urn', 'square', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_805',
        path: '/models/samples/graveyardScene.glb', // graveyardScene
        category: 'prop',
        keywords: ['graveyardScene', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_806',
        path: '/models/samples/greenEnergyBall.glb', // greenEnergyBall
        category: 'prop',
        keywords: ['greenEnergyBall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_807',
        path: '/models/samples/greySnapper_vertColor.glb', // greySnapper_vertColor
        category: 'prop',
        keywords: ['greySnapper', 'vertColor', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_808',
        path: '/models/samples/HarryPotter_Hat_Test.glb', // HarryPotter_Hat_Test
        category: 'prop',
        keywords: ['HarryPotter', 'Hat', 'Test', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_809',
        path: '/models/samples/head.glb', // head
        category: 'prop',
        keywords: ['head', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_810',
        path: '/models/samples/hexTile.glb', // hexTile
        category: 'prop',
        keywords: ['hexTile', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_811',
        path: '/models/samples/hogwarts_corridor.glb', // hogwarts_corridor
        category: 'prop',
        keywords: ['hogwarts', 'corridor', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_812',
        path: '/models/samples/holiday2021.glb', // holiday2021
        category: 'prop',
        keywords: ['holiday2021', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_813',
        path: '/models/samples/hollowLog.glb', // hollowLog
        category: 'prop',
        keywords: ['hollowLog', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_814',
        path: '/models/samples/inn.glb', // inn
        category: 'prop',
        keywords: ['inn', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_815',
        path: '/models/samples/IridescentDishWithOlives.glb', // IridescentDishWithOlives
        category: 'prop',
        keywords: ['IridescentDishWithOlives', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_816',
        path: '/models/samples/iridescentSphere.glb', // iridescentSphere
        category: 'prop',
        keywords: ['iridescentSphere', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_817',
        path: '/models/samples/KHR_materials_volume_testing.glb', // KHR_materials_volume_testing
        category: 'prop',
        keywords: ['KHR', 'materials', 'volume', 'testing', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_818',
        path: '/models/samples/Lantern.glb', // Lantern
        category: 'prop',
        keywords: ['Lantern', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_819',
        path: '/models/samples/left.glb', // left
        category: 'prop',
        keywords: ['left', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_820',
        path: '/models/samples/lightFixture.glb', // lightFixture
        category: 'prop',
        keywords: ['lightFixture', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_821',
        path: '/models/samples/lightPaddle.glb', // lightPaddle
        category: 'prop',
        keywords: ['lightPaddle', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_822',
        path: '/models/samples/lightPost1.glb', // lightPost1
        category: 'prop',
        keywords: ['lightPost1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_823',
        path: '/models/samples/lightPost2.glb', // lightPost2
        category: 'prop',
        keywords: ['lightPost2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_824',
        path: '/models/samples/lightPost3.glb', // lightPost3
        category: 'prop',
        keywords: ['lightPost3', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_825',
        path: '/models/samples/logSaw.glb', // logSaw
        category: 'prop',
        keywords: ['logSaw', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_826',
        path: '/models/samples/l_hand_lhs.glb', // l_hand_lhs
        category: 'prop',
        keywords: ['hand', 'lhs', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_827',
        path: '/models/samples/l_hand_rhs.glb', // l_hand_rhs
        category: 'prop',
        keywords: ['hand', 'rhs', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_828',
        path: '/models/samples/marineGround.glb', // marineGround
        category: 'prop',
        keywords: ['marineGround', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_829',
        path: '/models/samples/mausoleumLarge.glb', // mausoleumLarge
        category: 'prop',
        keywords: ['mausoleumLarge', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_830',
        path: '/models/samples/mausoleumLargeSkewed.glb', // mausoleumLargeSkewed
        category: 'prop',
        keywords: ['mausoleumLargeSkewed', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_831',
        path: '/models/samples/mausoleumSmall.glb', // mausoleumSmall
        category: 'prop',
        keywords: ['mausoleumSmall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_832',
        path: '/models/samples/mausoleumSmallSkewed.glb', // mausoleumSmallSkewed
        category: 'prop',
        keywords: ['mausoleumSmallSkewed', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_833',
        path: '/models/samples/MetalRoughSpheres.glb', // MetalRoughSpheres
        category: 'prop',
        keywords: ['MetalRoughSpheres', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_834',
        path: '/models/samples/MetalRoughSpheresNoTextures.glb', // MetalRoughSpheresNoTextures
        category: 'prop',
        keywords: ['MetalRoughSpheresNoTextures', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_835',
        path: '/models/samples/miniBar2.glb', // miniBar2
        category: 'prop',
        keywords: ['miniBar2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_836',
        path: '/models/samples/model_0093b022-794.glb', // model_0093b022-794
        category: 'prop',
        keywords: ['model', '0093b022', '794', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_837',
        path: '/models/samples/model_00f59c8c-52a.glb', // model_00f59c8c-52a
        category: 'prop',
        keywords: ['model', '00f59c8c', '52a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_838',
        path: '/models/samples/model_01510687-984.glb', // model_01510687-984
        category: 'prop',
        keywords: ['model', '01510687', '984', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_839',
        path: '/models/samples/model_016a52a6-dce.glb', // model_016a52a6-dce
        category: 'prop',
        keywords: ['model', '016a52a6', 'dce', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_840',
        path: '/models/samples/model_01843fe1-0d8.glb', // model_01843fe1-0d8
        category: 'prop',
        keywords: ['model', '01843fe1', '0d8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_841',
        path: '/models/samples/model_018e3909-86a.glb', // model_018e3909-86a
        category: 'prop',
        keywords: ['model', '018e3909', '86a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_842',
        path: '/models/samples/model_01d40f41-443.glb', // model_01d40f41-443
        category: 'prop',
        keywords: ['model', '01d40f41', '443', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_843',
        path: '/models/samples/model_03ce66cf-2cb.glb', // model_03ce66cf-2cb
        category: 'prop',
        keywords: ['model', '03ce66cf', '2cb', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_844',
        path: '/models/samples/model_04055cca-aa4.glb', // model_04055cca-aa4
        category: 'prop',
        keywords: ['model', '04055cca', 'aa4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_845',
        path: '/models/samples/model_0453ed65-f52.glb', // model_0453ed65-f52
        category: 'prop',
        keywords: ['model', '0453ed65', 'f52', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_846',
        path: '/models/samples/model_04c0a68c-4d3.glb', // model_04c0a68c-4d3
        category: 'prop',
        keywords: ['model', '04c0a68c', '4d3', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_847',
        path: '/models/samples/model_0528de32-356.glb', // model_0528de32-356
        category: 'prop',
        keywords: ['model', '0528de32', '356', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_848',
        path: '/models/samples/model_0551ca36-061.glb', // model_0551ca36-061
        category: 'prop',
        keywords: ['model', '0551ca36', '061', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_849',
        path: '/models/samples/model_05a53f67-4b9.glb', // model_05a53f67-4b9
        category: 'prop',
        keywords: ['model', '05a53f67', '4b9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_850',
        path: '/models/samples/model_07860247-cc1.glb', // model_07860247-cc1
        category: 'prop',
        keywords: ['model', '07860247', 'cc1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_851',
        path: '/models/samples/model_07e883b3-2e4.glb', // model_07e883b3-2e4
        category: 'prop',
        keywords: ['model', '07e883b3', '2e4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_852',
        path: '/models/samples/model_087513b0-788.glb', // model_087513b0-788
        category: 'prop',
        keywords: ['model', '087513b0', '788', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_853',
        path: '/models/samples/model_08d8ba2b-37f.glb', // model_08d8ba2b-37f
        category: 'prop',
        keywords: ['model', '08d8ba2b', '37f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_854',
        path: '/models/samples/model_09507cba-d6a.glb', // model_09507cba-d6a
        category: 'prop',
        keywords: ['model', '09507cba', 'd6a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_855',
        path: '/models/samples/model_0970fa42-4ab.glb', // model_0970fa42-4ab
        category: 'prop',
        keywords: ['model', '0970fa42', '4ab', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_856',
        path: '/models/samples/model_098364b0-485.glb', // model_098364b0-485
        category: 'prop',
        keywords: ['model', '098364b0', '485', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_857',
        path: '/models/samples/model_0a81f502-144.glb', // model_0a81f502-144
        category: 'prop',
        keywords: ['model', '0a81f502', '144', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_858',
        path: '/models/samples/model_0af6ef40-5d9.glb', // model_0af6ef40-5d9
        category: 'prop',
        keywords: ['model', '0af6ef40', '5d9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_859',
        path: '/models/samples/model_0b5e780a-7fd.glb', // model_0b5e780a-7fd
        category: 'prop',
        keywords: ['model', '0b5e780a', '7fd', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_860',
        path: '/models/samples/model_0c8f0256-480.glb', // model_0c8f0256-480
        category: 'prop',
        keywords: ['model', '0c8f0256', '480', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_861',
        path: '/models/samples/model_0d126e35-a18.glb', // model_0d126e35-a18
        category: 'prop',
        keywords: ['model', '0d126e35', 'a18', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_862',
        path: '/models/samples/model_0d5aa4c9-f28.glb', // model_0d5aa4c9-f28
        category: 'prop',
        keywords: ['model', '0d5aa4c9', 'f28', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_863',
        path: '/models/samples/model_0da49c1d-aad.glb', // model_0da49c1d-aad
        category: 'prop',
        keywords: ['model', '0da49c1d', 'aad', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_864',
        path: '/models/samples/model_0e689817-18d.glb', // model_0e689817-18d
        category: 'prop',
        keywords: ['model', '0e689817', '18d', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_865',
        path: '/models/samples/model_1058e0f3-ca5.glb', // model_1058e0f3-ca5
        category: 'prop',
        keywords: ['model', '1058e0f3', 'ca5', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_866',
        path: '/models/samples/model_11aba94f-2a2.glb', // model_11aba94f-2a2
        category: 'prop',
        keywords: ['model', '11aba94f', '2a2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_867',
        path: '/models/samples/model_12363a91-7c2.glb', // model_12363a91-7c2
        category: 'prop',
        keywords: ['model', '12363a91', '7c2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_868',
        path: '/models/samples/model_12487f1b-e31.glb', // model_12487f1b-e31
        category: 'prop',
        keywords: ['model', '12487f1b', 'e31', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_869',
        path: '/models/samples/model_135ccf25-173.glb', // model_135ccf25-173
        category: 'prop',
        keywords: ['model', '135ccf25', '173', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_870',
        path: '/models/samples/model_142eb426-331.glb', // model_142eb426-331
        category: 'prop',
        keywords: ['model', '142eb426', '331', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_871',
        path: '/models/samples/model_154c5dbd-c67.glb', // model_154c5dbd-c67
        category: 'prop',
        keywords: ['model', '154c5dbd', 'c67', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_872',
        path: '/models/samples/model_155077a0-2bf.glb', // model_155077a0-2bf
        category: 'prop',
        keywords: ['model', '155077a0', '2bf', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_873',
        path: '/models/samples/model_16938d74-b1b.glb', // model_16938d74-b1b
        category: 'prop',
        keywords: ['model', '16938d74', 'b1b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_874',
        path: '/models/samples/model_16d8adee-41d.glb', // model_16d8adee-41d
        category: 'prop',
        keywords: ['model', '16d8adee', '41d', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_875',
        path: '/models/samples/model_174e6c87-f89.glb', // model_174e6c87-f89
        category: 'prop',
        keywords: ['model', '174e6c87', 'f89', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_876',
        path: '/models/samples/model_1755311d-a94.glb', // model_1755311d-a94
        category: 'prop',
        keywords: ['model', '1755311d', 'a94', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_877',
        path: '/models/samples/model_178bcd33-dde.glb', // model_178bcd33-dde
        category: 'prop',
        keywords: ['model', '178bcd33', 'dde', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_878',
        path: '/models/samples/model_1821afe6-4c6.glb', // model_1821afe6-4c6
        category: 'prop',
        keywords: ['model', '1821afe6', '4c6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_879',
        path: '/models/samples/model_18d93646-1b6.glb', // model_18d93646-1b6
        category: 'prop',
        keywords: ['model', '18d93646', '1b6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_880',
        path: '/models/samples/model_1946522f-f26.glb', // model_1946522f-f26
        category: 'prop',
        keywords: ['model', '1946522f', 'f26', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_881',
        path: '/models/samples/model_1a2b827d-ca0.glb', // model_1a2b827d-ca0
        category: 'prop',
        keywords: ['model', '1a2b827d', 'ca0', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_882',
        path: '/models/samples/model_1be984cb-ce8.glb', // model_1be984cb-ce8
        category: 'prop',
        keywords: ['model', '1be984cb', 'ce8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_883',
        path: '/models/samples/model_1c8af2e7-e0e.glb', // model_1c8af2e7-e0e
        category: 'prop',
        keywords: ['model', '1c8af2e7', 'e0e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_884',
        path: '/models/samples/model_1cd08e71-e60.glb', // model_1cd08e71-e60
        category: 'prop',
        keywords: ['model', '1cd08e71', 'e60', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_885',
        path: '/models/samples/model_1d34d1bb-fa4.glb', // model_1d34d1bb-fa4
        category: 'prop',
        keywords: ['model', '1d34d1bb', 'fa4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_886',
        path: '/models/samples/model_1ebaca74-ea4.glb', // model_1ebaca74-ea4
        category: 'prop',
        keywords: ['model', '1ebaca74', 'ea4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_887',
        path: '/models/samples/model_1ebf3984-395.glb', // model_1ebf3984-395
        category: 'prop',
        keywords: ['model', '1ebf3984', '395', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_888',
        path: '/models/samples/model_1f6de2b1-6a8.glb', // model_1f6de2b1-6a8
        category: 'prop',
        keywords: ['model', '1f6de2b1', '6a8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_889',
        path: '/models/samples/model_1fec001e-606.glb', // model_1fec001e-606
        category: 'prop',
        keywords: ['model', '1fec001e', '606', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_890',
        path: '/models/samples/model_200b163b-fb2.glb', // model_200b163b-fb2
        category: 'prop',
        keywords: ['model', '200b163b', 'fb2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_891',
        path: '/models/samples/model_202ac3e3-c96.glb', // model_202ac3e3-c96
        category: 'prop',
        keywords: ['model', '202ac3e3', 'c96', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_892',
        path: '/models/samples/model_20d6b88d-840.glb', // model_20d6b88d-840
        category: 'prop',
        keywords: ['model', '20d6b88d', '840', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_893',
        path: '/models/samples/model_21a2c8fa-3bd.glb', // model_21a2c8fa-3bd
        category: 'prop',
        keywords: ['model', '21a2c8fa', '3bd', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_894',
        path: '/models/samples/model_21aa0d34-46b.glb', // model_21aa0d34-46b
        category: 'prop',
        keywords: ['model', '21aa0d34', '46b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_895',
        path: '/models/samples/model_21c2cbf9-0c1.glb', // model_21c2cbf9-0c1
        category: 'prop',
        keywords: ['model', '21c2cbf9', '0c1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_896',
        path: '/models/samples/model_21cc9c37-d86.glb', // model_21cc9c37-d86
        category: 'prop',
        keywords: ['model', '21cc9c37', 'd86', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_897',
        path: '/models/samples/model_21fdb9e5-1ad.glb', // model_21fdb9e5-1ad
        category: 'prop',
        keywords: ['model', '21fdb9e5', '1ad', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_898',
        path: '/models/samples/model_2445097b-bdf.glb', // model_2445097b-bdf
        category: 'prop',
        keywords: ['model', '2445097b', 'bdf', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_899',
        path: '/models/samples/model_24769937-ced.glb', // model_24769937-ced
        category: 'prop',
        keywords: ['model', '24769937', 'ced', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_900',
        path: '/models/samples/model_24cb8a6e-a2f.glb', // model_24cb8a6e-a2f
        category: 'prop',
        keywords: ['model', '24cb8a6e', 'a2f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_901',
        path: '/models/samples/model_24ee6619-f7f.glb', // model_24ee6619-f7f
        category: 'prop',
        keywords: ['model', '24ee6619', 'f7f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_902',
        path: '/models/samples/model_251a10e8-bf6.glb', // model_251a10e8-bf6
        category: 'prop',
        keywords: ['model', '251a10e8', 'bf6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_903',
        path: '/models/samples/model_252c5cbe-f20.glb', // model_252c5cbe-f20
        category: 'prop',
        keywords: ['model', '252c5cbe', 'f20', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_904',
        path: '/models/samples/model_2544e0ef-078.glb', // model_2544e0ef-078
        category: 'prop',
        keywords: ['model', '2544e0ef', '078', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_905',
        path: '/models/samples/model_2568a43c-da7.glb', // model_2568a43c-da7
        category: 'prop',
        keywords: ['model', '2568a43c', 'da7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_906',
        path: '/models/samples/model_2572bd61-6c2.glb', // model_2572bd61-6c2
        category: 'prop',
        keywords: ['model', '2572bd61', '6c2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_907',
        path: '/models/samples/model_259a3789-b8f.glb', // model_259a3789-b8f
        category: 'prop',
        keywords: ['model', '259a3789', 'b8f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_908',
        path: '/models/samples/model_2612a456-9d8.glb', // model_2612a456-9d8
        category: 'prop',
        keywords: ['model', '2612a456', '9d8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_909',
        path: '/models/samples/model_263f2bfa-789.glb', // model_263f2bfa-789
        category: 'prop',
        keywords: ['model', '263f2bfa', '789', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_910',
        path: '/models/samples/model_26f30e42-e08.glb', // model_26f30e42-e08
        category: 'prop',
        keywords: ['model', '26f30e42', 'e08', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_911',
        path: '/models/samples/model_27d6327d-780.glb', // model_27d6327d-780
        category: 'prop',
        keywords: ['model', '27d6327d', '780', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_912',
        path: '/models/samples/model_285c3534-738.glb', // model_285c3534-738
        category: 'prop',
        keywords: ['model', '285c3534', '738', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_913',
        path: '/models/samples/model_29b2b8b8-376.glb', // model_29b2b8b8-376
        category: 'prop',
        keywords: ['model', '29b2b8b8', '376', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_914',
        path: '/models/samples/model_29f8c09b-7b5.glb', // model_29f8c09b-7b5
        category: 'prop',
        keywords: ['model', '29f8c09b', '7b5', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_915',
        path: '/models/samples/model_29fa4c1d-039.glb', // model_29fa4c1d-039
        category: 'prop',
        keywords: ['model', '29fa4c1d', '039', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_916',
        path: '/models/samples/model_2ae6b5f8-6b7.glb', // model_2ae6b5f8-6b7
        category: 'prop',
        keywords: ['model', '2ae6b5f8', '6b7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_917',
        path: '/models/samples/model_2aeae9e8-f67.glb', // model_2aeae9e8-f67
        category: 'prop',
        keywords: ['model', '2aeae9e8', 'f67', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_918',
        path: '/models/samples/model_2b5e3201-eab.glb', // model_2b5e3201-eab
        category: 'prop',
        keywords: ['model', '2b5e3201', 'eab', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_919',
        path: '/models/samples/model_2c0c2b1e-d04.glb', // model_2c0c2b1e-d04
        category: 'prop',
        keywords: ['model', '2c0c2b1e', 'd04', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_920',
        path: '/models/samples/model_2c397d2d-152.glb', // model_2c397d2d-152
        category: 'prop',
        keywords: ['model', '2c397d2d', '152', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_921',
        path: '/models/samples/model_2ecdf33c-7b9.glb', // model_2ecdf33c-7b9
        category: 'prop',
        keywords: ['model', '2ecdf33c', '7b9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_922',
        path: '/models/samples/model_2ef9fc2d-996.glb', // model_2ef9fc2d-996
        category: 'prop',
        keywords: ['model', '2ef9fc2d', '996', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_923',
        path: '/models/samples/model_2f2c50e9-b59.glb', // model_2f2c50e9-b59
        category: 'prop',
        keywords: ['model', '2f2c50e9', 'b59', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_924',
        path: '/models/samples/model_302cec82-856.glb', // model_302cec82-856
        category: 'prop',
        keywords: ['model', '302cec82', '856', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_925',
        path: '/models/samples/model_30b31ef3-3a0.glb', // model_30b31ef3-3a0
        category: 'prop',
        keywords: ['model', '30b31ef3', '3a0', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_926',
        path: '/models/samples/model_320a18cb-ccd.glb', // model_320a18cb-ccd
        category: 'prop',
        keywords: ['model', '320a18cb', 'ccd', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_927',
        path: '/models/samples/model_325e7a86-3c4.glb', // model_325e7a86-3c4
        category: 'prop',
        keywords: ['model', '325e7a86', '3c4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_928',
        path: '/models/samples/model_32f1b9ae-541.glb', // model_32f1b9ae-541
        category: 'prop',
        keywords: ['model', '32f1b9ae', '541', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_929',
        path: '/models/samples/model_33f2ac81-de9.glb', // model_33f2ac81-de9
        category: 'prop',
        keywords: ['model', '33f2ac81', 'de9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_930',
        path: '/models/samples/model_348d1f0e-886.glb', // model_348d1f0e-886
        category: 'prop',
        keywords: ['model', '348d1f0e', '886', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_931',
        path: '/models/samples/model_3545490d-1fe.glb', // model_3545490d-1fe
        category: 'prop',
        keywords: ['model', '3545490d', '1fe', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_932',
        path: '/models/samples/model_3570068e-f79.glb', // model_3570068e-f79
        category: 'prop',
        keywords: ['model', '3570068e', 'f79', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_933',
        path: '/models/samples/model_35c76694-fce.glb', // model_35c76694-fce
        category: 'prop',
        keywords: ['model', '35c76694', 'fce', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_934',
        path: '/models/samples/model_36d09061-0ee.glb', // model_36d09061-0ee
        category: 'prop',
        keywords: ['model', '36d09061', '0ee', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_935',
        path: '/models/samples/model_370372ec-666.glb', // model_370372ec-666
        category: 'prop',
        keywords: ['model', '370372ec', '666', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_936',
        path: '/models/samples/model_37ad51fd-fb2.glb', // model_37ad51fd-fb2
        category: 'prop',
        keywords: ['model', '37ad51fd', 'fb2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_937',
        path: '/models/samples/model_3841d2a9-390.glb', // model_3841d2a9-390
        category: 'prop',
        keywords: ['model', '3841d2a9', '390', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_938',
        path: '/models/samples/model_38b81926-4a1.glb', // model_38b81926-4a1
        category: 'prop',
        keywords: ['model', '38b81926', '4a1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_939',
        path: '/models/samples/model_38ee5af8-ae1.glb', // model_38ee5af8-ae1
        category: 'prop',
        keywords: ['model', '38ee5af8', 'ae1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_940',
        path: '/models/samples/model_398b2073-135.glb', // model_398b2073-135
        category: 'prop',
        keywords: ['model', '398b2073', '135', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_941',
        path: '/models/samples/model_3a9e1495-750.glb', // model_3a9e1495-750
        category: 'prop',
        keywords: ['model', '3a9e1495', '750', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_942',
        path: '/models/samples/model_3e16d14d-c88.glb', // model_3e16d14d-c88
        category: 'prop',
        keywords: ['model', '3e16d14d', 'c88', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_943',
        path: '/models/samples/model_3ecf8f2f-db6.glb', // model_3ecf8f2f-db6
        category: 'prop',
        keywords: ['model', '3ecf8f2f', 'db6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_944',
        path: '/models/samples/model_404c439e-090.glb', // model_404c439e-090
        category: 'prop',
        keywords: ['model', '404c439e', '090', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_945',
        path: '/models/samples/model_419f7c52-ba1.glb', // model_419f7c52-ba1
        category: 'prop',
        keywords: ['model', '419f7c52', 'ba1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_946',
        path: '/models/samples/model_41a64de3-78b.glb', // model_41a64de3-78b
        category: 'prop',
        keywords: ['model', '41a64de3', '78b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_947',
        path: '/models/samples/model_41d4e503-3fe.glb', // model_41d4e503-3fe
        category: 'prop',
        keywords: ['model', '41d4e503', '3fe', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_948',
        path: '/models/samples/model_41fd6727-c30.glb', // model_41fd6727-c30
        category: 'prop',
        keywords: ['model', '41fd6727', 'c30', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_949',
        path: '/models/samples/model_420be263-a32.glb', // model_420be263-a32
        category: 'prop',
        keywords: ['model', '420be263', 'a32', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_950',
        path: '/models/samples/model_427fe638-14f.glb', // model_427fe638-14f
        category: 'prop',
        keywords: ['model', '427fe638', '14f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_951',
        path: '/models/samples/model_441d42f0-070.glb', // model_441d42f0-070
        category: 'prop',
        keywords: ['model', '441d42f0', '070', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_952',
        path: '/models/samples/model_45ae3e7a-bf6.glb', // model_45ae3e7a-bf6
        category: 'prop',
        keywords: ['model', '45ae3e7a', 'bf6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_953',
        path: '/models/samples/model_45b034f5-5ab.glb', // model_45b034f5-5ab
        category: 'prop',
        keywords: ['model', '45b034f5', '5ab', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_954',
        path: '/models/samples/model_45ca27ef-75c.glb', // model_45ca27ef-75c
        category: 'prop',
        keywords: ['model', '45ca27ef', '75c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_955',
        path: '/models/samples/model_45db5c7e-bd0.glb', // model_45db5c7e-bd0
        category: 'prop',
        keywords: ['model', '45db5c7e', 'bd0', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_956',
        path: '/models/samples/model_4647952e-a6b.glb', // model_4647952e-a6b
        category: 'prop',
        keywords: ['model', '4647952e', 'a6b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_957',
        path: '/models/samples/model_46ae6877-d71.glb', // model_46ae6877-d71
        category: 'prop',
        keywords: ['model', '46ae6877', 'd71', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_958',
        path: '/models/samples/model_480f46bd-06c.glb', // model_480f46bd-06c
        category: 'prop',
        keywords: ['model', '480f46bd', '06c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_959',
        path: '/models/samples/model_481f5d0e-822.glb', // model_481f5d0e-822
        category: 'prop',
        keywords: ['model', '481f5d0e', '822', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_960',
        path: '/models/samples/model_48697b19-ebd.glb', // model_48697b19-ebd
        category: 'prop',
        keywords: ['model', '48697b19', 'ebd', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_961',
        path: '/models/samples/model_48ab7121-570.glb', // model_48ab7121-570
        category: 'prop',
        keywords: ['model', '48ab7121', '570', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_962',
        path: '/models/samples/model_48ca45ab-5bb.glb', // model_48ca45ab-5bb
        category: 'prop',
        keywords: ['model', '48ca45ab', '5bb', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_963',
        path: '/models/samples/model_493cf84c-05a.glb', // model_493cf84c-05a
        category: 'prop',
        keywords: ['model', '493cf84c', '05a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_964',
        path: '/models/samples/model_4b7a5f2d-508.glb', // model_4b7a5f2d-508
        category: 'prop',
        keywords: ['model', '4b7a5f2d', '508', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_965',
        path: '/models/samples/model_4b9310cf-647.glb', // model_4b9310cf-647
        category: 'prop',
        keywords: ['model', '4b9310cf', '647', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_966',
        path: '/models/samples/model_4c0a3ec9-bd7.glb', // model_4c0a3ec9-bd7
        category: 'prop',
        keywords: ['model', '4c0a3ec9', 'bd7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_967',
        path: '/models/samples/model_4d36d320-19f.glb', // model_4d36d320-19f
        category: 'prop',
        keywords: ['model', '4d36d320', '19f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_968',
        path: '/models/samples/model_4dda6fc2-86e.glb', // model_4dda6fc2-86e
        category: 'prop',
        keywords: ['model', '4dda6fc2', '86e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_969',
        path: '/models/samples/model_4f2640bd-7ca.glb', // model_4f2640bd-7ca
        category: 'prop',
        keywords: ['model', '4f2640bd', '7ca', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_970',
        path: '/models/samples/model_500544e5-54b.glb', // model_500544e5-54b
        category: 'prop',
        keywords: ['model', '500544e5', '54b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_971',
        path: '/models/samples/model_50087d98-87e.glb', // model_50087d98-87e
        category: 'prop',
        keywords: ['model', '50087d98', '87e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_972',
        path: '/models/samples/model_51d0846a-cf4.glb', // model_51d0846a-cf4
        category: 'prop',
        keywords: ['model', '51d0846a', 'cf4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_973',
        path: '/models/samples/model_51eca8bd-2b8.glb', // model_51eca8bd-2b8
        category: 'prop',
        keywords: ['model', '51eca8bd', '2b8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_974',
        path: '/models/samples/model_51ef0b07-49c.glb', // model_51ef0b07-49c
        category: 'prop',
        keywords: ['model', '51ef0b07', '49c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_975',
        path: '/models/samples/model_521a8d84-6bb.glb', // model_521a8d84-6bb
        category: 'prop',
        keywords: ['model', '521a8d84', '6bb', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_976',
        path: '/models/samples/model_529019ee-4bd.glb', // model_529019ee-4bd
        category: 'prop',
        keywords: ['model', '529019ee', '4bd', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_977',
        path: '/models/samples/model_52e6920e-889.glb', // model_52e6920e-889
        category: 'prop',
        keywords: ['model', '52e6920e', '889', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_978',
        path: '/models/samples/model_532b4eca-396.glb', // model_532b4eca-396
        category: 'prop',
        keywords: ['model', '532b4eca', '396', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_979',
        path: '/models/samples/model_53fa9973-756.glb', // model_53fa9973-756
        category: 'prop',
        keywords: ['model', '53fa9973', '756', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_980',
        path: '/models/samples/model_544c368c-c07.glb', // model_544c368c-c07
        category: 'prop',
        keywords: ['model', '544c368c', 'c07', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_981',
        path: '/models/samples/model_54db6bb7-87e.glb', // model_54db6bb7-87e
        category: 'prop',
        keywords: ['model', '54db6bb7', '87e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_982',
        path: '/models/samples/model_55c86f23-52a.glb', // model_55c86f23-52a
        category: 'prop',
        keywords: ['model', '55c86f23', '52a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_983',
        path: '/models/samples/model_55ef63a7-ffd.glb', // model_55ef63a7-ffd
        category: 'prop',
        keywords: ['model', '55ef63a7', 'ffd', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_984',
        path: '/models/samples/model_562d9272-9e4.glb', // model_562d9272-9e4
        category: 'prop',
        keywords: ['model', '562d9272', '9e4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_985',
        path: '/models/samples/model_562f668f-4e6.glb', // model_562f668f-4e6
        category: 'prop',
        keywords: ['model', '562f668f', '4e6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_986',
        path: '/models/samples/model_567d607b-d3e.glb', // model_567d607b-d3e
        category: 'prop',
        keywords: ['model', '567d607b', 'd3e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_987',
        path: '/models/samples/model_5693c3cb-ead.glb', // model_5693c3cb-ead
        category: 'prop',
        keywords: ['model', '5693c3cb', 'ead', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_988',
        path: '/models/samples/model_575e6920-829.glb', // model_575e6920-829
        category: 'prop',
        keywords: ['model', '575e6920', '829', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_989',
        path: '/models/samples/model_5760d90d-3aa.glb', // model_5760d90d-3aa
        category: 'prop',
        keywords: ['model', '5760d90d', '3aa', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_990',
        path: '/models/samples/model_58cead34-52d.glb', // model_58cead34-52d
        category: 'prop',
        keywords: ['model', '58cead34', '52d', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_991',
        path: '/models/samples/model_58d94a98-dfa.glb', // model_58d94a98-dfa
        category: 'prop',
        keywords: ['model', '58d94a98', 'dfa', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_992',
        path: '/models/samples/model_58e02f30-f04.glb', // model_58e02f30-f04
        category: 'prop',
        keywords: ['model', '58e02f30', 'f04', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_993',
        path: '/models/samples/model_5943824c-1ee.glb', // model_5943824c-1ee
        category: 'prop',
        keywords: ['model', '5943824c', '1ee', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_994',
        path: '/models/samples/model_59ac0621-3d2.glb', // model_59ac0621-3d2
        category: 'prop',
        keywords: ['model', '59ac0621', '3d2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_995',
        path: '/models/samples/model_59fbfef8-3f6.glb', // model_59fbfef8-3f6
        category: 'prop',
        keywords: ['model', '59fbfef8', '3f6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_996',
        path: '/models/samples/model_5aeb6ff7-56c.glb', // model_5aeb6ff7-56c
        category: 'prop',
        keywords: ['model', '5aeb6ff7', '56c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_997',
        path: '/models/samples/model_5af663c3-c23.glb', // model_5af663c3-c23
        category: 'prop',
        keywords: ['model', '5af663c3', 'c23', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_998',
        path: '/models/samples/model_5b05b336-1f5.glb', // model_5b05b336-1f5
        category: 'prop',
        keywords: ['model', '5b05b336', '1f5', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_999',
        path: '/models/samples/model_5ba62572-f9e.glb', // model_5ba62572-f9e
        category: 'prop',
        keywords: ['model', '5ba62572', 'f9e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1000',
        path: '/models/samples/model_5c3443c6-f86.glb', // model_5c3443c6-f86
        category: 'prop',
        keywords: ['model', '5c3443c6', 'f86', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1001',
        path: '/models/samples/model_5d1b5201-0ed.glb', // model_5d1b5201-0ed
        category: 'prop',
        keywords: ['model', '5d1b5201', '0ed', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1002',
        path: '/models/samples/model_5d9f92bb-a69.glb', // model_5d9f92bb-a69
        category: 'prop',
        keywords: ['model', '5d9f92bb', 'a69', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1003',
        path: '/models/samples/model_5f3495ea-981.glb', // model_5f3495ea-981
        category: 'prop',
        keywords: ['model', '5f3495ea', '981', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1004',
        path: '/models/samples/model_6108e984-64b.glb', // model_6108e984-64b
        category: 'prop',
        keywords: ['model', '6108e984', '64b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1005',
        path: '/models/samples/model_61d1f35c-9f4.glb', // model_61d1f35c-9f4
        category: 'prop',
        keywords: ['model', '61d1f35c', '9f4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1006',
        path: '/models/samples/model_62eee14a-030.glb', // model_62eee14a-030
        category: 'prop',
        keywords: ['model', '62eee14a', '030', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1007',
        path: '/models/samples/model_630dda53-95a.glb', // model_630dda53-95a
        category: 'prop',
        keywords: ['model', '630dda53', '95a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1008',
        path: '/models/samples/model_63789130-f81.glb', // model_63789130-f81
        category: 'prop',
        keywords: ['model', '63789130', 'f81', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1009',
        path: '/models/samples/model_63e35ef7-f63.glb', // model_63e35ef7-f63
        category: 'prop',
        keywords: ['model', '63e35ef7', 'f63', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1010',
        path: '/models/samples/model_64466ea0-e65.glb', // model_64466ea0-e65
        category: 'prop',
        keywords: ['model', '64466ea0', 'e65', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1011',
        path: '/models/samples/model_64604dc8-e3f.glb', // model_64604dc8-e3f
        category: 'prop',
        keywords: ['model', '64604dc8', 'e3f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1012',
        path: '/models/samples/model_64809de3-3c5.glb', // model_64809de3-3c5
        category: 'prop',
        keywords: ['model', '64809de3', '3c5', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1013',
        path: '/models/samples/model_64f8b4c5-3ec.glb', // model_64f8b4c5-3ec
        category: 'prop',
        keywords: ['model', '64f8b4c5', '3ec', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1014',
        path: '/models/samples/model_677a7ddb-579.glb', // model_677a7ddb-579
        category: 'prop',
        keywords: ['model', '677a7ddb', '579', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1015',
        path: '/models/samples/model_67a706e9-022.glb', // model_67a706e9-022
        category: 'prop',
        keywords: ['model', '67a706e9', '022', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1016',
        path: '/models/samples/model_67d2ec8e-f3c.glb', // model_67d2ec8e-f3c
        category: 'prop',
        keywords: ['model', '67d2ec8e', 'f3c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1017',
        path: '/models/samples/model_67f85603-aec.glb', // model_67f85603-aec
        category: 'prop',
        keywords: ['model', '67f85603', 'aec', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1018',
        path: '/models/samples/model_6821c653-ab1.glb', // model_6821c653-ab1
        category: 'prop',
        keywords: ['model', '6821c653', 'ab1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1019',
        path: '/models/samples/model_68ad57d3-a67.glb', // model_68ad57d3-a67
        category: 'prop',
        keywords: ['model', '68ad57d3', 'a67', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1020',
        path: '/models/samples/model_68d94dec-206.glb', // model_68d94dec-206
        category: 'prop',
        keywords: ['model', '68d94dec', '206', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1021',
        path: '/models/samples/model_68fe46d0-625.glb', // model_68fe46d0-625
        category: 'prop',
        keywords: ['model', '68fe46d0', '625', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1022',
        path: '/models/samples/model_6a1191df-f09.glb', // model_6a1191df-f09
        category: 'prop',
        keywords: ['model', '6a1191df', 'f09', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1023',
        path: '/models/samples/model_6abeb22e-6d0.glb', // model_6abeb22e-6d0
        category: 'prop',
        keywords: ['model', '6abeb22e', '6d0', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1024',
        path: '/models/samples/model_6b2bc098-b3e.glb', // model_6b2bc098-b3e
        category: 'prop',
        keywords: ['model', '6b2bc098', 'b3e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1025',
        path: '/models/samples/model_6b40811b-09b.glb', // model_6b40811b-09b
        category: 'prop',
        keywords: ['model', '6b40811b', '09b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1026',
        path: '/models/samples/model_6b50b5e9-75b.glb', // model_6b50b5e9-75b
        category: 'prop',
        keywords: ['model', '6b50b5e9', '75b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1027',
        path: '/models/samples/model_6b8cf82f-0a5.glb', // model_6b8cf82f-0a5
        category: 'prop',
        keywords: ['model', '6b8cf82f', '0a5', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1028',
        path: '/models/samples/model_6b91b218-950.glb', // model_6b91b218-950
        category: 'prop',
        keywords: ['model', '6b91b218', '950', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1029',
        path: '/models/samples/model_6bb02cd7-319.glb', // model_6bb02cd7-319
        category: 'prop',
        keywords: ['model', '6bb02cd7', '319', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1030',
        path: '/models/samples/model_6dc05ca3-8da.glb', // model_6dc05ca3-8da
        category: 'prop',
        keywords: ['model', '6dc05ca3', '8da', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1031',
        path: '/models/samples/model_6df40d45-207.glb', // model_6df40d45-207
        category: 'prop',
        keywords: ['model', '6df40d45', '207', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1032',
        path: '/models/samples/model_6e5aa4cf-0ac.glb', // model_6e5aa4cf-0ac
        category: 'prop',
        keywords: ['model', '6e5aa4cf', '0ac', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1033',
        path: '/models/samples/model_6f2d8423-3d1.glb', // model_6f2d8423-3d1
        category: 'prop',
        keywords: ['model', '6f2d8423', '3d1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1034',
        path: '/models/samples/model_7089e8e3-3f8.glb', // model_7089e8e3-3f8
        category: 'prop',
        keywords: ['model', '7089e8e3', '3f8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1035',
        path: '/models/samples/model_71a81dcc-ca5.glb', // model_71a81dcc-ca5
        category: 'prop',
        keywords: ['model', '71a81dcc', 'ca5', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1036',
        path: '/models/samples/model_71ea87eb-93e.glb', // model_71ea87eb-93e
        category: 'prop',
        keywords: ['model', '71ea87eb', '93e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1037',
        path: '/models/samples/model_7239c899-1a2.glb', // model_7239c899-1a2
        category: 'prop',
        keywords: ['model', '7239c899', '1a2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1038',
        path: '/models/samples/model_72503a6f-b90.glb', // model_72503a6f-b90
        category: 'prop',
        keywords: ['model', '72503a6f', 'b90', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1039',
        path: '/models/samples/model_7259b4e9-5c7.glb', // model_7259b4e9-5c7
        category: 'prop',
        keywords: ['model', '7259b4e9', '5c7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1040',
        path: '/models/samples/model_738688be-9d4.glb', // model_738688be-9d4
        category: 'prop',
        keywords: ['model', '738688be', '9d4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1041',
        path: '/models/samples/model_739d2b34-f1b.glb', // model_739d2b34-f1b
        category: 'prop',
        keywords: ['model', '739d2b34', 'f1b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1042',
        path: '/models/samples/model_73aac0fd-d6c.glb', // model_73aac0fd-d6c
        category: 'prop',
        keywords: ['model', '73aac0fd', 'd6c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1043',
        path: '/models/samples/model_74a1ed00-855.glb', // model_74a1ed00-855
        category: 'prop',
        keywords: ['model', '74a1ed00', '855', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1044',
        path: '/models/samples/model_751f546a-c93.glb', // model_751f546a-c93
        category: 'prop',
        keywords: ['model', '751f546a', 'c93', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1045',
        path: '/models/samples/model_752de33a-ec8.glb', // model_752de33a-ec8
        category: 'prop',
        keywords: ['model', '752de33a', 'ec8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1046',
        path: '/models/samples/model_756a01ff-5ff.glb', // model_756a01ff-5ff
        category: 'prop',
        keywords: ['model', '756a01ff', '5ff', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1047',
        path: '/models/samples/model_75986358-ed1.glb', // model_75986358-ed1
        category: 'prop',
        keywords: ['model', '75986358', 'ed1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1048',
        path: '/models/samples/model_75cb3c5e-85a.glb', // model_75cb3c5e-85a
        category: 'prop',
        keywords: ['model', '75cb3c5e', '85a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1049',
        path: '/models/samples/model_76d45824-c8e.glb', // model_76d45824-c8e
        category: 'prop',
        keywords: ['model', '76d45824', 'c8e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1050',
        path: '/models/samples/model_76daba86-cb1.glb', // model_76daba86-cb1
        category: 'prop',
        keywords: ['model', '76daba86', 'cb1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1051',
        path: '/models/samples/model_770b16ec-204.glb', // model_770b16ec-204
        category: 'prop',
        keywords: ['model', '770b16ec', '204', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1052',
        path: '/models/samples/model_7718b337-b9a.glb', // model_7718b337-b9a
        category: 'prop',
        keywords: ['model', '7718b337', 'b9a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1053',
        path: '/models/samples/model_77861599-217.glb', // model_77861599-217
        category: 'prop',
        keywords: ['model', '77861599', '217', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1054',
        path: '/models/samples/model_7838f3a5-a74.glb', // model_7838f3a5-a74
        category: 'prop',
        keywords: ['model', '7838f3a5', 'a74', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1055',
        path: '/models/samples/model_798dca47-818.glb', // model_798dca47-818
        category: 'prop',
        keywords: ['model', '798dca47', '818', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1056',
        path: '/models/samples/model_7a73c075-097.glb', // model_7a73c075-097
        category: 'prop',
        keywords: ['model', '7a73c075', '097', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1057',
        path: '/models/samples/model_7ab90fb6-577.glb', // model_7ab90fb6-577
        category: 'prop',
        keywords: ['model', '7ab90fb6', '577', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1058',
        path: '/models/samples/model_7c224626-641.glb', // model_7c224626-641
        category: 'prop',
        keywords: ['model', '7c224626', '641', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1059',
        path: '/models/samples/model_7c844771-055.glb', // model_7c844771-055
        category: 'prop',
        keywords: ['model', '7c844771', '055', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1060',
        path: '/models/samples/model_7cb88781-50b.glb', // model_7cb88781-50b
        category: 'prop',
        keywords: ['model', '7cb88781', '50b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1061',
        path: '/models/samples/model_7cd3e5d3-73b.glb', // model_7cd3e5d3-73b
        category: 'prop',
        keywords: ['model', '7cd3e5d3', '73b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1062',
        path: '/models/samples/model_7dd071e2-42f.glb', // model_7dd071e2-42f
        category: 'prop',
        keywords: ['model', '7dd071e2', '42f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1063',
        path: '/models/samples/model_7e270461-09f.glb', // model_7e270461-09f
        category: 'prop',
        keywords: ['model', '7e270461', '09f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1064',
        path: '/models/samples/model_7e2f9384-a39.glb', // model_7e2f9384-a39
        category: 'prop',
        keywords: ['model', '7e2f9384', 'a39', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1065',
        path: '/models/samples/model_7f99d291-4b4.glb', // model_7f99d291-4b4
        category: 'prop',
        keywords: ['model', '7f99d291', '4b4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1066',
        path: '/models/samples/model_7fcf1b2e-9cc.glb', // model_7fcf1b2e-9cc
        category: 'prop',
        keywords: ['model', '7fcf1b2e', '9cc', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1067',
        path: '/models/samples/model_81502a49-a76.glb', // model_81502a49-a76
        category: 'prop',
        keywords: ['model', '81502a49', 'a76', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1068',
        path: '/models/samples/model_818c6699-100.glb', // model_818c6699-100
        category: 'prop',
        keywords: ['model', '818c6699', '100', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1069',
        path: '/models/samples/model_820c5597-d6c.glb', // model_820c5597-d6c
        category: 'prop',
        keywords: ['model', '820c5597', 'd6c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1070',
        path: '/models/samples/model_821d7ef7-46d.glb', // model_821d7ef7-46d
        category: 'prop',
        keywords: ['model', '821d7ef7', '46d', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1071',
        path: '/models/samples/model_826ab42e-146.glb', // model_826ab42e-146
        category: 'prop',
        keywords: ['model', '826ab42e', '146', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1072',
        path: '/models/samples/model_83590595-f7b.glb', // model_83590595-f7b
        category: 'prop',
        keywords: ['model', '83590595', 'f7b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1073',
        path: '/models/samples/model_848e2c98-2a9.glb', // model_848e2c98-2a9
        category: 'prop',
        keywords: ['model', '848e2c98', '2a9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1074',
        path: '/models/samples/model_8506b1a5-5b5.glb', // model_8506b1a5-5b5
        category: 'prop',
        keywords: ['model', '8506b1a5', '5b5', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1075',
        path: '/models/samples/model_85903796-a0b.glb', // model_85903796-a0b
        category: 'prop',
        keywords: ['model', '85903796', 'a0b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1076',
        path: '/models/samples/model_861b6368-f12.glb', // model_861b6368-f12
        category: 'prop',
        keywords: ['model', '861b6368', 'f12', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1077',
        path: '/models/samples/model_865cf0ba-2c1.glb', // model_865cf0ba-2c1
        category: 'prop',
        keywords: ['model', '865cf0ba', '2c1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1078',
        path: '/models/samples/model_872cead7-b2a.glb', // model_872cead7-b2a
        category: 'prop',
        keywords: ['model', '872cead7', 'b2a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1079',
        path: '/models/samples/model_8758563e-6d0.glb', // model_8758563e-6d0
        category: 'prop',
        keywords: ['model', '8758563e', '6d0', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1080',
        path: '/models/samples/model_8953543a-9fc.glb', // model_8953543a-9fc
        category: 'prop',
        keywords: ['model', '8953543a', '9fc', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1081',
        path: '/models/samples/model_8a5bb11a-f24.glb', // model_8a5bb11a-f24
        category: 'prop',
        keywords: ['model', '8a5bb11a', 'f24', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1082',
        path: '/models/samples/model_8a6839a3-0d9.glb', // model_8a6839a3-0d9
        category: 'prop',
        keywords: ['model', '8a6839a3', '0d9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1083',
        path: '/models/samples/model_8a79e0ff-4b9.glb', // model_8a79e0ff-4b9
        category: 'prop',
        keywords: ['model', '8a79e0ff', '4b9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1084',
        path: '/models/samples/model_8a7bdbf3-34a.glb', // model_8a7bdbf3-34a
        category: 'prop',
        keywords: ['model', '8a7bdbf3', '34a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1085',
        path: '/models/samples/model_8a94fad3-036.glb', // model_8a94fad3-036
        category: 'prop',
        keywords: ['model', '8a94fad3', '036', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1086',
        path: '/models/samples/model_8ad79961-226.glb', // model_8ad79961-226
        category: 'prop',
        keywords: ['model', '8ad79961', '226', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1087',
        path: '/models/samples/model_8b212824-f1f.glb', // model_8b212824-f1f
        category: 'prop',
        keywords: ['model', '8b212824', 'f1f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1088',
        path: '/models/samples/model_8c134eec-a13.glb', // model_8c134eec-a13
        category: 'prop',
        keywords: ['model', '8c134eec', 'a13', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1089',
        path: '/models/samples/model_8c4fe65f-7aa.glb', // model_8c4fe65f-7aa
        category: 'prop',
        keywords: ['model', '8c4fe65f', '7aa', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1090',
        path: '/models/samples/model_8ce8a9cf-1fd.glb', // model_8ce8a9cf-1fd
        category: 'prop',
        keywords: ['model', '8ce8a9cf', '1fd', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1091',
        path: '/models/samples/model_8d0593a2-c73.glb', // model_8d0593a2-c73
        category: 'prop',
        keywords: ['model', '8d0593a2', 'c73', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1092',
        path: '/models/samples/model_8d7b8b87-2c7.glb', // model_8d7b8b87-2c7
        category: 'prop',
        keywords: ['model', '8d7b8b87', '2c7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1093',
        path: '/models/samples/model_8db63546-ac4.glb', // model_8db63546-ac4
        category: 'prop',
        keywords: ['model', '8db63546', 'ac4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1094',
        path: '/models/samples/model_8e1d8db1-b39.glb', // model_8e1d8db1-b39
        category: 'prop',
        keywords: ['model', '8e1d8db1', 'b39', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1095',
        path: '/models/samples/model_8e455f37-a76.glb', // model_8e455f37-a76
        category: 'prop',
        keywords: ['model', '8e455f37', 'a76', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1096',
        path: '/models/samples/model_8e6f6c4e-dba.glb', // model_8e6f6c4e-dba
        category: 'prop',
        keywords: ['model', '8e6f6c4e', 'dba', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1097',
        path: '/models/samples/model_8ecff261-650.glb', // model_8ecff261-650
        category: 'prop',
        keywords: ['model', '8ecff261', '650', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1098',
        path: '/models/samples/model_8f0c1d57-f7f.glb', // model_8f0c1d57-f7f
        category: 'prop',
        keywords: ['model', '8f0c1d57', 'f7f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1099',
        path: '/models/samples/model_903416f8-79e.glb', // model_903416f8-79e
        category: 'prop',
        keywords: ['model', '903416f8', '79e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1100',
        path: '/models/samples/model_90c7020d-1f1.glb', // model_90c7020d-1f1
        category: 'prop',
        keywords: ['model', '90c7020d', '1f1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1101',
        path: '/models/samples/model_914760d4-256.glb', // model_914760d4-256
        category: 'prop',
        keywords: ['model', '914760d4', '256', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1102',
        path: '/models/samples/model_91b0924d-be0.glb', // model_91b0924d-be0
        category: 'prop',
        keywords: ['model', '91b0924d', 'be0', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1103',
        path: '/models/samples/model_931f2e35-0ab.glb', // model_931f2e35-0ab
        category: 'prop',
        keywords: ['model', '931f2e35', '0ab', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1104',
        path: '/models/samples/model_93217842-b43.glb', // model_93217842-b43
        category: 'prop',
        keywords: ['model', '93217842', 'b43', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1105',
        path: '/models/samples/model_939669db-d08.glb', // model_939669db-d08
        category: 'prop',
        keywords: ['model', '939669db', 'd08', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1106',
        path: '/models/samples/model_94641a3c-4a7.glb', // model_94641a3c-4a7
        category: 'prop',
        keywords: ['model', '94641a3c', '4a7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1107',
        path: '/models/samples/model_951a4c89-b28.glb', // model_951a4c89-b28
        category: 'prop',
        keywords: ['model', '951a4c89', 'b28', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1108',
        path: '/models/samples/model_9591d704-da7.glb', // model_9591d704-da7
        category: 'prop',
        keywords: ['model', '9591d704', 'da7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1109',
        path: '/models/samples/model_9708f413-455.glb', // model_9708f413-455
        category: 'prop',
        keywords: ['model', '9708f413', '455', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1110',
        path: '/models/samples/model_973795c2-755.glb', // model_973795c2-755
        category: 'prop',
        keywords: ['model', '973795c2', '755', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1111',
        path: '/models/samples/model_977734fe-afc.glb', // model_977734fe-afc
        category: 'prop',
        keywords: ['model', '977734fe', 'afc', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1112',
        path: '/models/samples/model_97902287-589.glb', // model_97902287-589
        category: 'prop',
        keywords: ['model', '97902287', '589', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1113',
        path: '/models/samples/model_97a9c001-9a3.glb', // model_97a9c001-9a3
        category: 'prop',
        keywords: ['model', '97a9c001', '9a3', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1114',
        path: '/models/samples/model_9943a455-106.glb', // model_9943a455-106
        category: 'prop',
        keywords: ['model', '9943a455', '106', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1115',
        path: '/models/samples/model_9b4ff57d-c87.glb', // model_9b4ff57d-c87
        category: 'prop',
        keywords: ['model', '9b4ff57d', 'c87', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1116',
        path: '/models/samples/model_9b5085b5-5e1.glb', // model_9b5085b5-5e1
        category: 'prop',
        keywords: ['model', '9b5085b5', '5e1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1117',
        path: '/models/samples/model_9ba49c74-2ed.glb', // model_9ba49c74-2ed
        category: 'prop',
        keywords: ['model', '9ba49c74', '2ed', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1118',
        path: '/models/samples/model_9d4bd2ba-06e.glb', // model_9d4bd2ba-06e
        category: 'prop',
        keywords: ['model', '9d4bd2ba', '06e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1119',
        path: '/models/samples/model_9db0be83-2cc.glb', // model_9db0be83-2cc
        category: 'prop',
        keywords: ['model', '9db0be83', '2cc', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1120',
        path: '/models/samples/model_9dc11d33-f01.glb', // model_9dc11d33-f01
        category: 'prop',
        keywords: ['model', '9dc11d33', 'f01', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1121',
        path: '/models/samples/model_9dd20045-aee.glb', // model_9dd20045-aee
        category: 'prop',
        keywords: ['model', '9dd20045', 'aee', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1122',
        path: '/models/samples/model_9dd918cd-f18.glb', // model_9dd918cd-f18
        category: 'prop',
        keywords: ['model', '9dd918cd', 'f18', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1123',
        path: '/models/samples/model_9df4ab5f-2ec.glb', // model_9df4ab5f-2ec
        category: 'prop',
        keywords: ['model', '9df4ab5f', '2ec', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1124',
        path: '/models/samples/model_9dfa6387-4f1.glb', // model_9dfa6387-4f1
        category: 'prop',
        keywords: ['model', '9dfa6387', '4f1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1125',
        path: '/models/samples/model_9f14603b-9ef.glb', // model_9f14603b-9ef
        category: 'prop',
        keywords: ['model', '9f14603b', '9ef', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1126',
        path: '/models/samples/model_a0745221-f6c.glb', // model_a0745221-f6c
        category: 'prop',
        keywords: ['model', 'a0745221', 'f6c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1127',
        path: '/models/samples/model_a077bff9-d75.glb', // model_a077bff9-d75
        category: 'prop',
        keywords: ['model', 'a077bff9', 'd75', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1128',
        path: '/models/samples/model_a07969d3-6d3.glb', // model_a07969d3-6d3
        category: 'prop',
        keywords: ['model', 'a07969d3', '6d3', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1129',
        path: '/models/samples/model_a15ed272-471.glb', // model_a15ed272-471
        category: 'prop',
        keywords: ['model', 'a15ed272', '471', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1130',
        path: '/models/samples/model_a1898185-ed1.glb', // model_a1898185-ed1
        category: 'prop',
        keywords: ['model', 'a1898185', 'ed1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1131',
        path: '/models/samples/model_a1e26ab5-fb7.glb', // model_a1e26ab5-fb7
        category: 'prop',
        keywords: ['model', 'a1e26ab5', 'fb7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1132',
        path: '/models/samples/model_a3276f54-2ef.glb', // model_a3276f54-2ef
        category: 'prop',
        keywords: ['model', 'a3276f54', '2ef', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1133',
        path: '/models/samples/model_a3db3629-211.glb', // model_a3db3629-211
        category: 'prop',
        keywords: ['model', 'a3db3629', '211', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1134',
        path: '/models/samples/model_a5b149eb-fce.glb', // model_a5b149eb-fce
        category: 'prop',
        keywords: ['model', 'a5b149eb', 'fce', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1135',
        path: '/models/samples/model_a60c6ac0-396.glb', // model_a60c6ac0-396
        category: 'prop',
        keywords: ['model', 'a60c6ac0', '396', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1136',
        path: '/models/samples/model_a6205e59-c16.glb', // model_a6205e59-c16
        category: 'prop',
        keywords: ['model', 'a6205e59', 'c16', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1137',
        path: '/models/samples/model_a62a0689-a8f.glb', // model_a62a0689-a8f
        category: 'prop',
        keywords: ['model', 'a62a0689', 'a8f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1138',
        path: '/models/samples/model_a6702109-209.glb', // model_a6702109-209
        category: 'prop',
        keywords: ['model', 'a6702109', '209', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1139',
        path: '/models/samples/model_a6ca5e4b-5b3.glb', // model_a6ca5e4b-5b3
        category: 'prop',
        keywords: ['model', 'a6ca5e4b', '5b3', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1140',
        path: '/models/samples/model_a7900c23-d17.glb', // model_a7900c23-d17
        category: 'prop',
        keywords: ['model', 'a7900c23', 'd17', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1141',
        path: '/models/samples/model_a8fee894-aa2.glb', // model_a8fee894-aa2
        category: 'prop',
        keywords: ['model', 'a8fee894', 'aa2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1142',
        path: '/models/samples/model_a9100a65-b11.glb', // model_a9100a65-b11
        category: 'prop',
        keywords: ['model', 'a9100a65', 'b11', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1143',
        path: '/models/samples/model_a9203561-e20.glb', // model_a9203561-e20
        category: 'prop',
        keywords: ['model', 'a9203561', 'e20', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1144',
        path: '/models/samples/model_a93a2cec-b8e.glb', // model_a93a2cec-b8e
        category: 'prop',
        keywords: ['model', 'a93a2cec', 'b8e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1145',
        path: '/models/samples/model_a956e9db-07a.glb', // model_a956e9db-07a
        category: 'prop',
        keywords: ['model', 'a956e9db', '07a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1146',
        path: '/models/samples/model_aa014453-648.glb', // model_aa014453-648
        category: 'prop',
        keywords: ['model', 'aa014453', '648', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1147',
        path: '/models/samples/model_aa498820-63c.glb', // model_aa498820-63c
        category: 'prop',
        keywords: ['model', 'aa498820', '63c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1148',
        path: '/models/samples/model_aa82fb6a-126.glb', // model_aa82fb6a-126
        category: 'prop',
        keywords: ['model', 'aa82fb6a', '126', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1149',
        path: '/models/samples/model_ac1d0a8c-109.glb', // model_ac1d0a8c-109
        category: 'prop',
        keywords: ['model', 'ac1d0a8c', '109', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1150',
        path: '/models/samples/model_ad0c1afa-f8f.glb', // model_ad0c1afa-f8f
        category: 'prop',
        keywords: ['model', 'ad0c1afa', 'f8f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1151',
        path: '/models/samples/model_ad92253f-0a8.glb', // model_ad92253f-0a8
        category: 'prop',
        keywords: ['model', 'ad92253f', '0a8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1152',
        path: '/models/samples/model_aed9682f-9f8.glb', // model_aed9682f-9f8
        category: 'prop',
        keywords: ['model', 'aed9682f', '9f8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1153',
        path: '/models/samples/model_aef47f78-1ea.glb', // model_aef47f78-1ea
        category: 'prop',
        keywords: ['model', 'aef47f78', '1ea', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1154',
        path: '/models/samples/model_afc28cad-022.glb', // model_afc28cad-022
        category: 'prop',
        keywords: ['model', 'afc28cad', '022', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1155',
        path: '/models/samples/model_afd3a410-a7e.glb', // model_afd3a410-a7e
        category: 'prop',
        keywords: ['model', 'afd3a410', 'a7e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1156',
        path: '/models/samples/model_afd71af1-468.glb', // model_afd71af1-468
        category: 'prop',
        keywords: ['model', 'afd71af1', '468', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1157',
        path: '/models/samples/model_afebe841-ac8.glb', // model_afebe841-ac8
        category: 'prop',
        keywords: ['model', 'afebe841', 'ac8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1158',
        path: '/models/samples/model_b0208a3a-9cf.glb', // model_b0208a3a-9cf
        category: 'prop',
        keywords: ['model', 'b0208a3a', '9cf', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1159',
        path: '/models/samples/model_b0d1266f-9f9.glb', // model_b0d1266f-9f9
        category: 'prop',
        keywords: ['model', 'b0d1266f', '9f9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1160',
        path: '/models/samples/model_b0f9eebc-639.glb', // model_b0f9eebc-639
        category: 'prop',
        keywords: ['model', 'b0f9eebc', '639', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1161',
        path: '/models/samples/model_b1bc954e-134.glb', // model_b1bc954e-134
        category: 'prop',
        keywords: ['model', 'b1bc954e', '134', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1162',
        path: '/models/samples/model_b2246c95-22f.glb', // model_b2246c95-22f
        category: 'prop',
        keywords: ['model', 'b2246c95', '22f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1163',
        path: '/models/samples/model_b33125ef-435.glb', // model_b33125ef-435
        category: 'prop',
        keywords: ['model', 'b33125ef', '435', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1164',
        path: '/models/samples/model_b38493ef-56f.glb', // model_b38493ef-56f
        category: 'prop',
        keywords: ['model', 'b38493ef', '56f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1165',
        path: '/models/samples/model_b3f56e38-960.glb', // model_b3f56e38-960
        category: 'prop',
        keywords: ['model', 'b3f56e38', '960', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1166',
        path: '/models/samples/model_b4546734-fe6.glb', // model_b4546734-fe6
        category: 'prop',
        keywords: ['model', 'b4546734', 'fe6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1167',
        path: '/models/samples/model_b4669237-a52.glb', // model_b4669237-a52
        category: 'prop',
        keywords: ['model', 'b4669237', 'a52', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1168',
        path: '/models/samples/model_b4c079c9-676.glb', // model_b4c079c9-676
        category: 'prop',
        keywords: ['model', 'b4c079c9', '676', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1169',
        path: '/models/samples/model_b530c034-560.glb', // model_b530c034-560
        category: 'prop',
        keywords: ['model', 'b530c034', '560', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1170',
        path: '/models/samples/model_b5f2d03a-8cd.glb', // model_b5f2d03a-8cd
        category: 'prop',
        keywords: ['model', 'b5f2d03a', '8cd', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1171',
        path: '/models/samples/model_b69687b6-927.glb', // model_b69687b6-927
        category: 'prop',
        keywords: ['model', 'b69687b6', '927', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1172',
        path: '/models/samples/model_b712b2b3-1ac.glb', // model_b712b2b3-1ac
        category: 'prop',
        keywords: ['model', 'b712b2b3', '1ac', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1173',
        path: '/models/samples/model_b73e0b81-e5b.glb', // model_b73e0b81-e5b
        category: 'prop',
        keywords: ['model', 'b73e0b81', 'e5b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1174',
        path: '/models/samples/model_b7b52f23-c6f.glb', // model_b7b52f23-c6f
        category: 'prop',
        keywords: ['model', 'b7b52f23', 'c6f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1175',
        path: '/models/samples/model_b7bf1970-2b8.glb', // model_b7bf1970-2b8
        category: 'prop',
        keywords: ['model', 'b7bf1970', '2b8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1176',
        path: '/models/samples/model_b839d245-7a3.glb', // model_b839d245-7a3
        category: 'prop',
        keywords: ['model', 'b839d245', '7a3', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1177',
        path: '/models/samples/model_b841b2db-d53.glb', // model_b841b2db-d53
        category: 'prop',
        keywords: ['model', 'b841b2db', 'd53', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1178',
        path: '/models/samples/model_b85eecc5-b0c.glb', // model_b85eecc5-b0c
        category: 'prop',
        keywords: ['model', 'b85eecc5', 'b0c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1179',
        path: '/models/samples/model_b9908061-8b4.glb', // model_b9908061-8b4
        category: 'prop',
        keywords: ['model', 'b9908061', '8b4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1180',
        path: '/models/samples/model_ba094f95-fd6.glb', // model_ba094f95-fd6
        category: 'prop',
        keywords: ['model', 'ba094f95', 'fd6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1181',
        path: '/models/samples/model_bb1e31be-8e3.glb', // model_bb1e31be-8e3
        category: 'prop',
        keywords: ['model', 'bb1e31be', '8e3', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1182',
        path: '/models/samples/model_bb650703-a20.glb', // model_bb650703-a20
        category: 'prop',
        keywords: ['model', 'bb650703', 'a20', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1183',
        path: '/models/samples/model_bb8eccc2-1a0.glb', // model_bb8eccc2-1a0
        category: 'prop',
        keywords: ['model', 'bb8eccc2', '1a0', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1184',
        path: '/models/samples/model_bbba8700-cc8.glb', // model_bbba8700-cc8
        category: 'prop',
        keywords: ['model', 'bbba8700', 'cc8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1185',
        path: '/models/samples/model_bbfd9a36-4ae.glb', // model_bbfd9a36-4ae
        category: 'prop',
        keywords: ['model', 'bbfd9a36', '4ae', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1186',
        path: '/models/samples/model_bc5c053b-6b8.glb', // model_bc5c053b-6b8
        category: 'prop',
        keywords: ['model', 'bc5c053b', '6b8', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1187',
        path: '/models/samples/model_bc8407a3-861.glb', // model_bc8407a3-861
        category: 'prop',
        keywords: ['model', 'bc8407a3', '861', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1188',
        path: '/models/samples/model_bc8aee66-020.glb', // model_bc8aee66-020
        category: 'prop',
        keywords: ['model', 'bc8aee66', '020', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1189',
        path: '/models/samples/model_bcaf6746-de1.glb', // model_bcaf6746-de1
        category: 'prop',
        keywords: ['model', 'bcaf6746', 'de1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1190',
        path: '/models/samples/model_be4bda23-1c7.glb', // model_be4bda23-1c7
        category: 'prop',
        keywords: ['model', 'be4bda23', '1c7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1191',
        path: '/models/samples/model_be8924d5-c65.glb', // model_be8924d5-c65
        category: 'prop',
        keywords: ['model', 'be8924d5', 'c65', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1192',
        path: '/models/samples/model_c1d60b5f-82a.glb', // model_c1d60b5f-82a
        category: 'prop',
        keywords: ['model', 'c1d60b5f', '82a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1193',
        path: '/models/samples/model_c29e1da8-b8b.glb', // model_c29e1da8-b8b
        category: 'prop',
        keywords: ['model', 'c29e1da8', 'b8b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1194',
        path: '/models/samples/model_c3987744-ec5.glb', // model_c3987744-ec5
        category: 'prop',
        keywords: ['model', 'c3987744', 'ec5', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1195',
        path: '/models/samples/model_c423ab76-e31.glb', // model_c423ab76-e31
        category: 'prop',
        keywords: ['model', 'c423ab76', 'e31', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1196',
        path: '/models/samples/model_c444ba25-97e.glb', // model_c444ba25-97e
        category: 'prop',
        keywords: ['model', 'c444ba25', '97e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1197',
        path: '/models/samples/model_c4c118aa-bfa.glb', // model_c4c118aa-bfa
        category: 'prop',
        keywords: ['model', 'c4c118aa', 'bfa', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1198',
        path: '/models/samples/model_c4e4b8aa-a8d.glb', // model_c4e4b8aa-a8d
        category: 'prop',
        keywords: ['model', 'c4e4b8aa', 'a8d', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1199',
        path: '/models/samples/model_c5ebde8e-590.glb', // model_c5ebde8e-590
        category: 'prop',
        keywords: ['model', 'c5ebde8e', '590', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1200',
        path: '/models/samples/model_c6475352-ab0.glb', // model_c6475352-ab0
        category: 'prop',
        keywords: ['model', 'c6475352', 'ab0', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1201',
        path: '/models/samples/model_c7399ba0-576.glb', // model_c7399ba0-576
        category: 'prop',
        keywords: ['model', 'c7399ba0', '576', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1202',
        path: '/models/samples/model_c7aaa41e-d88.glb', // model_c7aaa41e-d88
        category: 'prop',
        keywords: ['model', 'c7aaa41e', 'd88', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1203',
        path: '/models/samples/model_c8f214ff-5da.glb', // model_c8f214ff-5da
        category: 'prop',
        keywords: ['model', 'c8f214ff', '5da', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1204',
        path: '/models/samples/model_c97d0688-9d7.glb', // model_c97d0688-9d7
        category: 'prop',
        keywords: ['model', 'c97d0688', '9d7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1205',
        path: '/models/samples/model_cbaf22e0-241.glb', // model_cbaf22e0-241
        category: 'prop',
        keywords: ['model', 'cbaf22e0', '241', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1206',
        path: '/models/samples/model_cbb1f63e-909.glb', // model_cbb1f63e-909
        category: 'prop',
        keywords: ['model', 'cbb1f63e', '909', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1207',
        path: '/models/samples/model_cbd86306-ab3.glb', // model_cbd86306-ab3
        category: 'prop',
        keywords: ['model', 'cbd86306', 'ab3', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1208',
        path: '/models/samples/model_cc83da49-17e.glb', // model_cc83da49-17e
        category: 'prop',
        keywords: ['model', 'cc83da49', '17e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1209',
        path: '/models/samples/model_ccae3ba8-412.glb', // model_ccae3ba8-412
        category: 'prop',
        keywords: ['model', 'ccae3ba8', '412', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1210',
        path: '/models/samples/model_ccd0e302-53c.glb', // model_ccd0e302-53c
        category: 'prop',
        keywords: ['model', 'ccd0e302', '53c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1211',
        path: '/models/samples/model_cdaf8464-0df.glb', // model_cdaf8464-0df
        category: 'prop',
        keywords: ['model', 'cdaf8464', '0df', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1212',
        path: '/models/samples/model_cdc0585e-37d.glb', // model_cdc0585e-37d
        category: 'prop',
        keywords: ['model', 'cdc0585e', '37d', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1213',
        path: '/models/samples/model_cdf6df67-fe9.glb', // model_cdf6df67-fe9
        category: 'prop',
        keywords: ['model', 'cdf6df67', 'fe9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1214',
        path: '/models/samples/model_cdfeb29b-b5e.glb', // model_cdfeb29b-b5e
        category: 'prop',
        keywords: ['model', 'cdfeb29b', 'b5e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1215',
        path: '/models/samples/model_ce74927a-c3f.glb', // model_ce74927a-c3f
        category: 'prop',
        keywords: ['model', 'ce74927a', 'c3f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1216',
        path: '/models/samples/model_cec6713a-e4c.glb', // model_cec6713a-e4c
        category: 'prop',
        keywords: ['model', 'cec6713a', 'e4c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1217',
        path: '/models/samples/model_cff80aa0-ab6.glb', // model_cff80aa0-ab6
        category: 'prop',
        keywords: ['model', 'cff80aa0', 'ab6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1218',
        path: '/models/samples/model_d027a82e-1cd.glb', // model_d027a82e-1cd
        category: 'prop',
        keywords: ['model', 'd027a82e', '1cd', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1219',
        path: '/models/samples/model_d0a14d35-a9a.glb', // model_d0a14d35-a9a
        category: 'prop',
        keywords: ['model', 'd0a14d35', 'a9a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1220',
        path: '/models/samples/model_d0c029e9-5ff.glb', // model_d0c029e9-5ff
        category: 'prop',
        keywords: ['model', 'd0c029e9', '5ff', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1221',
        path: '/models/samples/model_d0d4c8ef-251.glb', // model_d0d4c8ef-251
        category: 'prop',
        keywords: ['model', 'd0d4c8ef', '251', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1222',
        path: '/models/samples/model_d1140ab6-6f7.glb', // model_d1140ab6-6f7
        category: 'prop',
        keywords: ['model', 'd1140ab6', '6f7', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1223',
        path: '/models/samples/model_d1b6ae44-8ac.glb', // model_d1b6ae44-8ac
        category: 'prop',
        keywords: ['model', 'd1b6ae44', '8ac', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1224',
        path: '/models/samples/model_d2279ea8-74c.glb', // model_d2279ea8-74c
        category: 'prop',
        keywords: ['model', 'd2279ea8', '74c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1225',
        path: '/models/samples/model_d2620506-13d.glb', // model_d2620506-13d
        category: 'prop',
        keywords: ['model', 'd2620506', '13d', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1226',
        path: '/models/samples/model_d2c30b63-4f4.glb', // model_d2c30b63-4f4
        category: 'prop',
        keywords: ['model', 'd2c30b63', '4f4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1227',
        path: '/models/samples/model_d2faa1df-81a.glb', // model_d2faa1df-81a
        category: 'prop',
        keywords: ['model', 'd2faa1df', '81a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1228',
        path: '/models/samples/model_d32d552a-117.glb', // model_d32d552a-117
        category: 'prop',
        keywords: ['model', 'd32d552a', '117', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1229',
        path: '/models/samples/model_d4b3b231-38a.glb', // model_d4b3b231-38a
        category: 'prop',
        keywords: ['model', 'd4b3b231', '38a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1230',
        path: '/models/samples/model_d4d9d53a-f4c.glb', // model_d4d9d53a-f4c
        category: 'prop',
        keywords: ['model', 'd4d9d53a', 'f4c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1231',
        path: '/models/samples/model_d4e325c0-ca2.glb', // model_d4e325c0-ca2
        category: 'prop',
        keywords: ['model', 'd4e325c0', 'ca2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1232',
        path: '/models/samples/model_d4eca46e-5c1.glb', // model_d4eca46e-5c1
        category: 'prop',
        keywords: ['model', 'd4eca46e', '5c1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1233',
        path: '/models/samples/model_d4fe17dd-4fd.glb', // model_d4fe17dd-4fd
        category: 'prop',
        keywords: ['model', 'd4fe17dd', '4fd', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1234',
        path: '/models/samples/model_d693b39d-538.glb', // model_d693b39d-538
        category: 'prop',
        keywords: ['model', 'd693b39d', '538', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1235',
        path: '/models/samples/model_d7386ebe-3c0.glb', // model_d7386ebe-3c0
        category: 'prop',
        keywords: ['model', 'd7386ebe', '3c0', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1236',
        path: '/models/samples/model_d8e2ebd4-49c.glb', // model_d8e2ebd4-49c
        category: 'prop',
        keywords: ['model', 'd8e2ebd4', '49c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1237',
        path: '/models/samples/model_d93158e9-522.glb', // model_d93158e9-522
        category: 'prop',
        keywords: ['model', 'd93158e9', '522', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1238',
        path: '/models/samples/model_d97bc02e-d9c.glb', // model_d97bc02e-d9c
        category: 'prop',
        keywords: ['model', 'd97bc02e', 'd9c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1239',
        path: '/models/samples/model_d9c612bd-31f.glb', // model_d9c612bd-31f
        category: 'prop',
        keywords: ['model', 'd9c612bd', '31f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1240',
        path: '/models/samples/model_da163e91-586.glb', // model_da163e91-586
        category: 'prop',
        keywords: ['model', 'da163e91', '586', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1241',
        path: '/models/samples/model_db13e457-827.glb', // model_db13e457-827
        category: 'prop',
        keywords: ['model', 'db13e457', '827', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1242',
        path: '/models/samples/model_db2321c0-133.glb', // model_db2321c0-133
        category: 'prop',
        keywords: ['model', 'db2321c0', '133', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1243',
        path: '/models/samples/model_dbd88b8a-f2a.glb', // model_dbd88b8a-f2a
        category: 'prop',
        keywords: ['model', 'dbd88b8a', 'f2a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1244',
        path: '/models/samples/model_dd0823c9-59c.glb', // model_dd0823c9-59c
        category: 'prop',
        keywords: ['model', 'dd0823c9', '59c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1245',
        path: '/models/samples/model_dd087f76-5df.glb', // model_dd087f76-5df
        category: 'prop',
        keywords: ['model', 'dd087f76', '5df', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1246',
        path: '/models/samples/model_dd55e3c2-fe1.glb', // model_dd55e3c2-fe1
        category: 'prop',
        keywords: ['model', 'dd55e3c2', 'fe1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1247',
        path: '/models/samples/model_dda9071f-016.glb', // model_dda9071f-016
        category: 'prop',
        keywords: ['model', 'dda9071f', '016', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1248',
        path: '/models/samples/model_ddc5d7d2-e7b.glb', // model_ddc5d7d2-e7b
        category: 'prop',
        keywords: ['model', 'ddc5d7d2', 'e7b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1249',
        path: '/models/samples/model_ddebaec6-dbf.glb', // model_ddebaec6-dbf
        category: 'prop',
        keywords: ['model', 'ddebaec6', 'dbf', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1250',
        path: '/models/samples/model_df977e78-571.glb', // model_df977e78-571
        category: 'prop',
        keywords: ['model', 'df977e78', '571', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1251',
        path: '/models/samples/model_dfd35b24-20d.glb', // model_dfd35b24-20d
        category: 'prop',
        keywords: ['model', 'dfd35b24', '20d', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1252',
        path: '/models/samples/model_e0f28728-2e2.glb', // model_e0f28728-2e2
        category: 'prop',
        keywords: ['model', 'e0f28728', '2e2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1253',
        path: '/models/samples/model_e1cc5d2b-8ce.glb', // model_e1cc5d2b-8ce
        category: 'prop',
        keywords: ['model', 'e1cc5d2b', '8ce', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1254',
        path: '/models/samples/model_e1e29c43-5eb.glb', // model_e1e29c43-5eb
        category: 'prop',
        keywords: ['model', 'e1e29c43', '5eb', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1255',
        path: '/models/samples/model_e2920a39-48a.glb', // model_e2920a39-48a
        category: 'prop',
        keywords: ['model', 'e2920a39', '48a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1256',
        path: '/models/samples/model_e32c88b3-0be.glb', // model_e32c88b3-0be
        category: 'prop',
        keywords: ['model', 'e32c88b3', '0be', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1257',
        path: '/models/samples/model_e34a018d-ca9.glb', // model_e34a018d-ca9
        category: 'prop',
        keywords: ['model', 'e34a018d', 'ca9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1258',
        path: '/models/samples/model_e3f82d01-354.glb', // model_e3f82d01-354
        category: 'prop',
        keywords: ['model', 'e3f82d01', '354', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1259',
        path: '/models/samples/model_e4bcb83c-18c.glb', // model_e4bcb83c-18c
        category: 'prop',
        keywords: ['model', 'e4bcb83c', '18c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1260',
        path: '/models/samples/model_e62c71bd-144.glb', // model_e62c71bd-144
        category: 'prop',
        keywords: ['model', 'e62c71bd', '144', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1261',
        path: '/models/samples/model_e6575280-200.glb', // model_e6575280-200
        category: 'prop',
        keywords: ['model', 'e6575280', '200', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1262',
        path: '/models/samples/model_e69bcc63-c34.glb', // model_e69bcc63-c34
        category: 'prop',
        keywords: ['model', 'e69bcc63', 'c34', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1263',
        path: '/models/samples/model_e80d9f2b-7ff.glb', // model_e80d9f2b-7ff
        category: 'prop',
        keywords: ['model', 'e80d9f2b', '7ff', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1264',
        path: '/models/samples/model_eb131f00-2c3.glb', // model_eb131f00-2c3
        category: 'prop',
        keywords: ['model', 'eb131f00', '2c3', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1265',
        path: '/models/samples/model_eb2d7523-082.glb', // model_eb2d7523-082
        category: 'prop',
        keywords: ['model', 'eb2d7523', '082', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1266',
        path: '/models/samples/model_eb4d6a13-ca4.glb', // model_eb4d6a13-ca4
        category: 'prop',
        keywords: ['model', 'eb4d6a13', 'ca4', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1267',
        path: '/models/samples/model_ec6b9814-05c.glb', // model_ec6b9814-05c
        category: 'prop',
        keywords: ['model', 'ec6b9814', '05c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1268',
        path: '/models/samples/model_ed1058c9-b9e.glb', // model_ed1058c9-b9e
        category: 'prop',
        keywords: ['model', 'ed1058c9', 'b9e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1269',
        path: '/models/samples/model_ed25e36b-caf.glb', // model_ed25e36b-caf
        category: 'prop',
        keywords: ['model', 'ed25e36b', 'caf', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1270',
        path: '/models/samples/model_ed9ee2e6-4fe.glb', // model_ed9ee2e6-4fe
        category: 'prop',
        keywords: ['model', 'ed9ee2e6', '4fe', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1271',
        path: '/models/samples/model_eef315f3-a71.glb', // model_eef315f3-a71
        category: 'prop',
        keywords: ['model', 'eef315f3', 'a71', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1272',
        path: '/models/samples/model_ef0825e6-7ab.glb', // model_ef0825e6-7ab
        category: 'prop',
        keywords: ['model', 'ef0825e6', '7ab', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1273',
        path: '/models/samples/model_ef611be9-f95.glb', // model_ef611be9-f95
        category: 'prop',
        keywords: ['model', 'ef611be9', 'f95', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1274',
        path: '/models/samples/model_efa74db6-33a.glb', // model_efa74db6-33a
        category: 'prop',
        keywords: ['model', 'efa74db6', '33a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1275',
        path: '/models/samples/model_f0a300e0-68b.glb', // model_f0a300e0-68b
        category: 'prop',
        keywords: ['model', 'f0a300e0', '68b', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1276',
        path: '/models/samples/model_f0d5d20c-288.glb', // model_f0d5d20c-288
        category: 'prop',
        keywords: ['model', 'f0d5d20c', '288', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1277',
        path: '/models/samples/model_f0e31075-8a3.glb', // model_f0e31075-8a3
        category: 'prop',
        keywords: ['model', 'f0e31075', '8a3', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1278',
        path: '/models/samples/model_f1431dfd-6e9.glb', // model_f1431dfd-6e9
        category: 'prop',
        keywords: ['model', 'f1431dfd', '6e9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1279',
        path: '/models/samples/model_f1994e0f-2c0.glb', // model_f1994e0f-2c0
        category: 'prop',
        keywords: ['model', 'f1994e0f', '2c0', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1280',
        path: '/models/samples/model_f1e7458b-159.glb', // model_f1e7458b-159
        category: 'prop',
        keywords: ['model', 'f1e7458b', '159', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1281',
        path: '/models/samples/model_f1ed6ad1-d54.glb', // model_f1ed6ad1-d54
        category: 'prop',
        keywords: ['model', 'f1ed6ad1', 'd54', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1282',
        path: '/models/samples/model_f33bbd68-b9a.glb', // model_f33bbd68-b9a
        category: 'prop',
        keywords: ['model', 'f33bbd68', 'b9a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1283',
        path: '/models/samples/model_f397d7ef-2a6.glb', // model_f397d7ef-2a6
        category: 'prop',
        keywords: ['model', 'f397d7ef', '2a6', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1284',
        path: '/models/samples/model_f4b87b96-c56.glb', // model_f4b87b96-c56
        category: 'prop',
        keywords: ['model', 'f4b87b96', 'c56', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1285',
        path: '/models/samples/model_f4eaac36-c6f.glb', // model_f4eaac36-c6f
        category: 'prop',
        keywords: ['model', 'f4eaac36', 'c6f', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1286',
        path: '/models/samples/model_f6e3b0dc-e5a.glb', // model_f6e3b0dc-e5a
        category: 'prop',
        keywords: ['model', 'f6e3b0dc', 'e5a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1287',
        path: '/models/samples/model_f73f5d73-788.glb', // model_f73f5d73-788
        category: 'prop',
        keywords: ['model', 'f73f5d73', '788', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1288',
        path: '/models/samples/model_fa9c4d3f-544.glb', // model_fa9c4d3f-544
        category: 'prop',
        keywords: ['model', 'fa9c4d3f', '544', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1289',
        path: '/models/samples/model_fb3f9cc1-f65.glb', // model_fb3f9cc1-f65
        category: 'prop',
        keywords: ['model', 'fb3f9cc1', 'f65', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1290',
        path: '/models/samples/model_fb611993-efd.glb', // model_fb611993-efd
        category: 'prop',
        keywords: ['model', 'fb611993', 'efd', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1291',
        path: '/models/samples/model_fbac7d31-dde.glb', // model_fbac7d31-dde
        category: 'prop',
        keywords: ['model', 'fbac7d31', 'dde', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1292',
        path: '/models/samples/model_fc2e6a27-c5c.glb', // model_fc2e6a27-c5c
        category: 'prop',
        keywords: ['model', 'fc2e6a27', 'c5c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1293',
        path: '/models/samples/model_fca00348-326.glb', // model_fca00348-326
        category: 'prop',
        keywords: ['model', 'fca00348', '326', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1294',
        path: '/models/samples/model_fdb3fabc-376.glb', // model_fdb3fabc-376
        category: 'prop',
        keywords: ['model', 'fdb3fabc', '376', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1295',
        path: '/models/samples/model_fdcfac2d-15c.glb', // model_fdcfac2d-15c
        category: 'prop',
        keywords: ['model', 'fdcfac2d', '15c', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1296',
        path: '/models/samples/model_fddc5f43-8b9.glb', // model_fddc5f43-8b9
        category: 'prop',
        keywords: ['model', 'fddc5f43', '8b9', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1297',
        path: '/models/samples/model_fdfb7519-95e.glb', // model_fdfb7519-95e
        category: 'prop',
        keywords: ['model', 'fdfb7519', '95e', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1298',
        path: '/models/samples/model_fe8040e1-71a.glb', // model_fe8040e1-71a
        category: 'prop',
        keywords: ['model', 'fe8040e1', '71a', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1299',
        path: '/models/samples/module_600.glb', // module_600
        category: 'prop',
        keywords: ['module', '600', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1300',
        path: '/models/samples/moltenDagger.glb', // moltenDagger
        category: 'prop',
        keywords: ['moltenDagger', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1301',
        path: '/models/samples/MosquitoInAmber.glb', // MosquitoInAmber
        category: 'prop',
        keywords: ['MosquitoInAmber', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1302',
        path: '/models/samples/MultiUVTest.glb', // MultiUVTest
        category: 'prop',
        keywords: ['MultiUVTest', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1303',
        path: '/models/samples/obelisk1.glb', // obelisk1
        category: 'prop',
        keywords: ['obelisk1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1304',
        path: '/models/samples/obelisk2.glb', // obelisk2
        category: 'prop',
        keywords: ['obelisk2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1305',
        path: '/models/samples/octopus_customRig.glb', // octopus_customRig
        category: 'prop',
        keywords: ['octopus', 'customRig', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1306',
        path: '/models/samples/OrientationTest.glb', // OrientationTest
        category: 'prop',
        keywords: ['OrientationTest', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1307',
        path: '/models/samples/PBR_Spheres.glb', // PBR_Spheres
        category: 'prop',
        keywords: ['PBR', 'Spheres', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1308',
        path: '/models/samples/pill.glb', // pill
        category: 'prop',
        keywords: ['pill', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1309',
        path: '/models/samples/pinkEnergyBall.glb', // pinkEnergyBall
        category: 'prop',
        keywords: ['pinkEnergyBall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1310',
        path: '/models/samples/pirateFort.glb', // pirateFort
        category: 'prop',
        keywords: ['pirateFort', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1311',
        path: '/models/samples/platformer-kit_block-moving-blue.glb', // platformer-kit_block-moving-blue
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'moving', 'blue', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1312',
        path: '/models/samples/platformer-kit_block-moving-large.glb', // platformer-kit_block-moving-large
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'moving', 'large', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1313',
        path: '/models/samples/platformer-kit_block-moving.glb', // platformer-kit_block-moving
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'moving', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1314',
        path: '/models/samples/platformer-kit_block-snow-corner-overhang-low.glb', // platformer-kit_block-snow-corner-overhang-low
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'corner', 'overhang', 'low', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1315',
        path: '/models/samples/platformer-kit_block-snow-corner-overhang.glb', // platformer-kit_block-snow-corner-overhang
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'corner', 'overhang', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1316',
        path: '/models/samples/platformer-kit_block-snow-curve-half.glb', // platformer-kit_block-snow-curve-half
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'curve', 'half', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1317',
        path: '/models/samples/platformer-kit_block-snow-curve-low.glb', // platformer-kit_block-snow-curve-low
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'curve', 'low', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1318',
        path: '/models/samples/platformer-kit_block-snow-curve.glb', // platformer-kit_block-snow-curve
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'curve', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1319',
        path: '/models/samples/platformer-kit_block-snow-edge.glb', // platformer-kit_block-snow-edge
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'edge', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1320',
        path: '/models/samples/platformer-kit_block-snow-large-slope-steep.glb', // platformer-kit_block-snow-large-slope-steep
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'large', 'slope', 'steep', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1321',
        path: '/models/samples/platformer-kit_block-snow-large-slope.glb', // platformer-kit_block-snow-large-slope
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'large', 'slope', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1322',
        path: '/models/samples/platformer-kit_block-snow-overhang-corner.glb', // platformer-kit_block-snow-overhang-corner
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'corner', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1323',
        path: '/models/samples/platformer-kit_block-snow-overhang-edge.glb', // platformer-kit_block-snow-overhang-edge
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'edge', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1324',
        path: '/models/samples/platformer-kit_block-snow-overhang-large-slope-steep.glb', // platformer-kit_block-snow-overhang-large-slope-steep
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'large', 'slope', 'steep', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1325',
        path: '/models/samples/platformer-kit_block-snow-overhang-large-slope.glb', // platformer-kit_block-snow-overhang-large-slope
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'large', 'slope', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1326',
        path: '/models/samples/platformer-kit_block-snow-overhang-large-tall.glb', // platformer-kit_block-snow-overhang-large-tall
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'large', 'tall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1327',
        path: '/models/samples/platformer-kit_block-snow-overhang-large.glb', // platformer-kit_block-snow-overhang-large
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'large', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1328',
        path: '/models/samples/platformer-kit_block-snow-overhang-long.glb', // platformer-kit_block-snow-overhang-long
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'long', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1329',
        path: '/models/samples/platformer-kit_block-snow-overhang-low-large.glb', // platformer-kit_block-snow-overhang-low-large
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'low', 'large', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1330',
        path: '/models/samples/platformer-kit_block-snow-overhang-low-long.glb', // platformer-kit_block-snow-overhang-low-long
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'low', 'long', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1331',
        path: '/models/samples/platformer-kit_block-snow-overhang-low.glb', // platformer-kit_block-snow-overhang-low
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'low', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1332',
        path: '/models/samples/platformer-kit_bomb.glb', // platformer-kit_bomb
        category: 'prop',
        keywords: ['platformer', 'kit', 'bomb', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1333',
        path: '/models/samples/platformer-kit_brick.glb', // platformer-kit_brick
        category: 'prop',
        keywords: ['platformer', 'kit', 'brick', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1334',
        path: '/models/samples/platformer-kit_button-round.glb', // platformer-kit_button-round
        category: 'prop',
        keywords: ['platformer', 'kit', 'button', 'round', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1335',
        path: '/models/samples/platformer-kit_button-square.glb', // platformer-kit_button-square
        category: 'prop',
        keywords: ['platformer', 'kit', 'button', 'square', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1336',
        path: '/models/samples/platformer-kit_conveyor-belt.glb', // platformer-kit_conveyor-belt
        category: 'prop',
        keywords: ['platformer', 'kit', 'conveyor', 'belt', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1337',
        path: '/models/samples/platformer-kit_hedge-corner.glb', // platformer-kit_hedge-corner
        category: 'prop',
        keywords: ['platformer', 'kit', 'hedge', 'corner', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1338',
        path: '/models/samples/platformer-kit_ladder-broken.glb', // platformer-kit_ladder-broken
        category: 'prop',
        keywords: ['platformer', 'kit', 'ladder', 'broken', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1339',
        path: '/models/samples/platformer-kit_ladder-long.glb', // platformer-kit_ladder-long
        category: 'prop',
        keywords: ['platformer', 'kit', 'ladder', 'long', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1340',
        path: '/models/samples/platformer-kit_lever.glb', // platformer-kit_lever
        category: 'prop',
        keywords: ['platformer', 'kit', 'lever', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1341',
        path: '/models/samples/platformer-kit_pipe.glb', // platformer-kit_pipe
        category: 'prop',
        keywords: ['platformer', 'kit', 'pipe', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1342',
        path: '/models/samples/platformer-kit_platform-fortified.glb', // platformer-kit_platform-fortified
        category: 'prop',
        keywords: ['platformer', 'kit', 'platform', 'fortified', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1343',
        path: '/models/samples/platformer-kit_poles.glb', // platformer-kit_poles
        category: 'prop',
        keywords: ['platformer', 'kit', 'poles', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1344',
        path: '/models/samples/platformer-kit_saw.glb', // platformer-kit_saw
        category: 'prop',
        keywords: ['platformer', 'kit', 'saw', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1345',
        path: '/models/samples/platformer-kit_spike-block-wide.glb', // platformer-kit_spike-block-wide
        category: 'prop',
        keywords: ['platformer', 'kit', 'spike', 'block', 'wide', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1346',
        path: '/models/samples/platformer-kit_spike-block.glb', // platformer-kit_spike-block
        category: 'prop',
        keywords: ['platformer', 'kit', 'spike', 'block', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1347',
        path: '/models/samples/platformer-kit_spring.glb', // platformer-kit_spring
        category: 'prop',
        keywords: ['platformer', 'kit', 'spring', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1348',
        path: '/models/samples/platformer-kit_trap-spikes-large.glb', // platformer-kit_trap-spikes-large
        category: 'prop',
        keywords: ['platformer', 'kit', 'trap', 'spikes', 'large', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1349',
        path: '/models/samples/platformer-kit_trap-spikes.glb', // platformer-kit_trap-spikes
        category: 'prop',
        keywords: ['platformer', 'kit', 'trap', 'spikes', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1350',
        path: '/models/samples/PlaysetLightTest.glb', // PlaysetLightTest
        category: 'prop',
        keywords: ['PlaysetLightTest', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1351',
        path: '/models/samples/PointLightIntensityTest.glb', // PointLightIntensityTest
        category: 'prop',
        keywords: ['PointLightIntensityTest', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1352',
        path: '/models/samples/PotOfCoals.glb', // PotOfCoals
        category: 'prop',
        keywords: ['PotOfCoals', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1353',
        path: '/models/samples/PotOfCoalsAnimationPointer.glb', // PotOfCoalsAnimationPointer
        category: 'prop',
        keywords: ['PotOfCoalsAnimationPointer', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1354',
        path: '/models/samples/previewSphere.glb', // previewSphere
        category: 'prop',
        keywords: ['previewSphere', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1355',
        path: '/models/samples/RecursiveSkeletons.glb', // RecursiveSkeletons
        category: 'prop',
        keywords: ['RecursiveSkeletons', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1356',
        path: '/models/samples/RiggedFigure.glb', // RiggedFigure
        category: 'prop',
        keywords: ['RiggedFigure', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1357',
        path: '/models/samples/riggedMesh.glb', // riggedMesh
        category: 'prop',
        keywords: ['riggedMesh', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1358',
        path: '/models/samples/RiggedSimple.glb', // RiggedSimple
        category: 'prop',
        keywords: ['RiggedSimple', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1359',
        path: '/models/samples/right.glb', // right
        category: 'prop',
        keywords: ['right', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1360',
        path: '/models/samples/Road corner.glb', // Road corner
        category: 'prop',
        keywords: ['Road', 'corner', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1361',
        path: '/models/samples/road gap.glb', // road gap
        category: 'prop',
        keywords: ['road', 'gap', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1362',
        path: '/models/samples/roundedCube.glb', // roundedCube
        category: 'prop',
        keywords: ['roundedCube', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1363',
        path: '/models/samples/roundedCylinder.glb', // roundedCylinder
        category: 'prop',
        keywords: ['roundedCylinder', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1364',
        path: '/models/samples/r_hand_lhs.glb', // r_hand_lhs
        category: 'prop',
        keywords: ['hand', 'lhs', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1365',
        path: '/models/samples/r_hand_rhs.glb', // r_hand_rhs
        category: 'prop',
        keywords: ['hand', 'rhs', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1366',
        path: '/models/samples/sarcophagus.glb', // sarcophagus
        category: 'prop',
        keywords: ['sarcophagus', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1367',
        path: '/models/samples/sarcophagusOpen.glb', // sarcophagusOpen
        category: 'prop',
        keywords: ['sarcophagusOpen', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1368',
        path: '/models/samples/sawMill.glb', // sawMill
        category: 'prop',
        keywords: ['sawMill', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1369',
        path: '/models/samples/seagulf.glb', // seagulf
        category: 'prop',
        keywords: ['seagulf', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1370',
        path: '/models/samples/shaderBall.glb', // shaderBall
        category: 'prop',
        keywords: ['shaderBall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1371',
        path: '/models/samples/shaderBall_rotation.glb', // shaderBall_rotation
        category: 'prop',
        keywords: ['shaderBall', 'rotation', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1372',
        path: '/models/samples/shark.glb', // shark
        category: 'prop',
        keywords: ['shark', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1373',
        path: '/models/samples/sign.glb', // sign
        category: 'prop',
        keywords: ['sign', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1374',
        path: '/models/samples/signboard1.glb', // signboard1
        category: 'prop',
        keywords: ['signboard1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1375',
        path: '/models/samples/signboard2.glb', // signboard2
        category: 'prop',
        keywords: ['signboard2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1376',
        path: '/models/samples/snowBall.glb', // snowBall
        category: 'prop',
        keywords: ['snowBall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1377',
        path: '/models/samples/snowField.glb', // snowField
        category: 'prop',
        keywords: ['snowField', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1378',
        path: '/models/samples/solar_system.glb', // solar_system
        category: 'prop',
        keywords: ['solar', 'system', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1379',
        path: '/models/samples/solid.glb', // solid
        category: 'prop',
        keywords: ['solid', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1380',
        path: '/models/samples/SpecGlossVsMetalRough.glb', // SpecGlossVsMetalRough
        category: 'prop',
        keywords: ['SpecGlossVsMetalRough', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1381',
        path: '/models/samples/spellDisk.glb', // spellDisk
        category: 'prop',
        keywords: ['spellDisk', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1382',
        path: '/models/samples/straight.glb', // straight
        category: 'prop',
        keywords: ['straight', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1383',
        path: '/models/samples/stud.glb', // stud
        category: 'prop',
        keywords: ['stud', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1384',
        path: '/models/samples/stump.glb', // stump
        category: 'prop',
        keywords: ['stump', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1385',
        path: '/models/samples/stump1.glb', // stump1
        category: 'prop',
        keywords: ['stump1', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1386',
        path: '/models/samples/stump2.glb', // stump2
        category: 'prop',
        keywords: ['stump2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1387',
        path: '/models/samples/SunglassesKhronos.glb', // SunglassesKhronos
        category: 'prop',
        keywords: ['SunglassesKhronos', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1388',
        path: '/models/samples/target.glb', // target
        category: 'prop',
        keywords: ['target', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1389',
        path: '/models/samples/TextureCoordinateTest.glb', // TextureCoordinateTest
        category: 'prop',
        keywords: ['TextureCoordinateTest', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1390',
        path: '/models/samples/TextureEncodingTest.glb', // TextureEncodingTest
        category: 'prop',
        keywords: ['TextureEncodingTest', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1391',
        path: '/models/samples/TextureSettingsTest.glb', // TextureSettingsTest
        category: 'prop',
        keywords: ['TextureSettingsTest', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1392',
        path: '/models/samples/TextureTransformMultiTest.glb', // TextureTransformMultiTest
        category: 'prop',
        keywords: ['TextureTransformMultiTest', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1393',
        path: '/models/samples/three.js-examples_bath_day.glb', // three.js-examples_bath_day
        category: 'prop',
        keywords: ['three.js', 'examples', 'bath', 'day', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1394',
        path: '/models/samples/three.js-examples_coffeemat.glb', // three.js-examples_coffeemat
        category: 'prop',
        keywords: ['three.js', 'examples', 'coffeemat', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1395',
        path: '/models/samples/three.js-examples_coffeeMug.glb', // three.js-examples_coffeeMug
        category: 'prop',
        keywords: ['three.js', 'examples', 'coffeeMug', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1396',
        path: '/models/samples/three.js-examples_collision-world.glb', // three.js-examples_collision-world
        category: 'prop',
        keywords: ['three.js', 'examples', 'collision', 'world', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1397',
        path: '/models/samples/three.js-examples_duck.glb', // three.js-examples_duck
        category: 'prop',
        keywords: ['three.js', 'examples', 'duck', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1398',
        path: '/models/samples/three.js-examples_facecap.glb', // three.js-examples_facecap
        category: 'prop',
        keywords: ['three.js', 'examples', 'facecap', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1399',
        path: '/models/samples/three.js-examples_ferrari.glb', // three.js-examples_ferrari
        category: 'prop',
        keywords: ['three.js', 'examples', 'ferrari', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1400',
        path: '/models/samples/three.js-examples_Flamingo.glb', // three.js-examples_Flamingo
        category: 'prop',
        keywords: ['three.js', 'examples', 'Flamingo', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1401',
        path: '/models/samples/three.js-examples_gears.glb', // three.js-examples_gears
        category: 'prop',
        keywords: ['three.js', 'examples', 'gears', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1402',
        path: '/models/samples/three.js-examples_godrays_demo.glb', // three.js-examples_godrays_demo
        category: 'prop',
        keywords: ['three.js', 'examples', 'godrays', 'demo', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1403',
        path: '/models/samples/three.js-examples_IridescentDishWithOlives.glb', // three.js-examples_IridescentDishWithOlives
        category: 'prop',
        keywords: ['three.js', 'examples', 'IridescentDishWithOlives', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1404',
        path: '/models/samples/three.js-examples_kira.glb', // three.js-examples_kira
        category: 'prop',
        keywords: ['three.js', 'examples', 'kira', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1405',
        path: '/models/samples/three.js-examples_LeePerrySmith.glb', // three.js-examples_LeePerrySmith
        category: 'prop',
        keywords: ['three.js', 'examples', 'LeePerrySmith', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1406',
        path: '/models/samples/three.js-examples_LittlestTokyo.glb', // three.js-examples_LittlestTokyo
        category: 'prop',
        keywords: ['three.js', 'examples', 'LittlestTokyo', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1407',
        path: '/models/samples/three.js-examples_Michelle.glb', // three.js-examples_Michelle
        category: 'prop',
        keywords: ['three.js', 'examples', 'Michelle', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1408',
        path: '/models/samples/three.js-examples_Nefertiti.glb', // three.js-examples_Nefertiti
        category: 'prop',
        keywords: ['three.js', 'examples', 'Nefertiti', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1409',
        path: '/models/samples/three.js-examples_nemetona.glb', // three.js-examples_nemetona
        category: 'prop',
        keywords: ['three.js', 'examples', 'nemetona', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1410',
        path: '/models/samples/three.js-examples_Parrot.glb', // three.js-examples_Parrot
        category: 'prop',
        keywords: ['three.js', 'examples', 'Parrot', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1411',
        path: '/models/samples/three.js-examples_pool.glb', // three.js-examples_pool
        category: 'prop',
        keywords: ['three.js', 'examples', 'pool', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1412',
        path: '/models/samples/three.js-examples_PrimaryIonDrive.glb', // three.js-examples_PrimaryIonDrive
        category: 'prop',
        keywords: ['three.js', 'examples', 'PrimaryIonDrive', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1413',
        path: '/models/samples/three.js-examples_readyplayer.me.glb', // three.js-examples_readyplayer.me
        category: 'prop',
        keywords: ['three.js', 'examples', 'readyplayer.me', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1414',
        path: '/models/samples/three.js-examples_RobotExpressive.glb', // three.js-examples_RobotExpressive
        category: 'prop',
        keywords: ['three.js', 'examples', 'RobotExpressive', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1415',
        path: '/models/samples/three.js-examples_rolex.glb', // three.js-examples_rolex
        category: 'prop',
        keywords: ['three.js', 'examples', 'rolex', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1416',
        path: '/models/samples/three.js-examples_ShaderBall.glb', // three.js-examples_ShaderBall
        category: 'prop',
        keywords: ['three.js', 'examples', 'ShaderBall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1417',
        path: '/models/samples/three.js-examples_ShaderBall2.glb', // three.js-examples_ShaderBall2
        category: 'prop',
        keywords: ['three.js', 'examples', 'ShaderBall2', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1418',
        path: '/models/samples/three.js-examples_ShadowmappableMesh.glb', // three.js-examples_ShadowmappableMesh
        category: 'prop',
        keywords: ['three.js', 'examples', 'ShadowmappableMesh', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1419',
        path: '/models/samples/three.js-examples_steampunk_camera.glb', // three.js-examples_steampunk_camera
        category: 'prop',
        keywords: ['three.js', 'examples', 'steampunk', 'camera', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1420',
        path: '/models/samples/three.js-examples_Stork.glb', // three.js-examples_Stork
        category: 'prop',
        keywords: ['three.js', 'examples', 'Stork', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1421',
        path: '/models/samples/three.js-examples_venice_mask.glb', // three.js-examples_venice_mask
        category: 'prop',
        keywords: ['three.js', 'examples', 'venice', 'mask', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1422',
        path: '/models/samples/three.js-examples_Xbot.glb', // three.js-examples_Xbot
        category: 'prop',
        keywords: ['three.js', 'examples', 'Xbot', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1423',
        path: '/models/samples/toast_acrobatics.glb', // toast_acrobatics
        category: 'prop',
        keywords: ['toast', 'acrobatics', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1424',
        path: '/models/samples/transfiguration_class.glb', // transfiguration_class
        category: 'prop',
        keywords: ['transfiguration', 'class', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1425',
        path: '/models/samples/ufo.glb', // ufo
        category: 'prop',
        keywords: ['ufo', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1426',
        path: '/models/samples/underwaterGround.glb', // underwaterGround
        category: 'prop',
        keywords: ['underwaterGround', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1427',
        path: '/models/samples/underwaterScene.glb', // underwaterScene
        category: 'prop',
        keywords: ['underwaterScene', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1428',
        path: '/models/samples/underwaterSceneNavMesh.glb', // underwaterSceneNavMesh
        category: 'prop',
        keywords: ['underwaterSceneNavMesh', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1429',
        path: '/models/samples/valleyvillage.glb', // valleyvillage
        category: 'prop',
        keywords: ['valleyvillage', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1430',
        path: '/models/samples/village.glb', // village
        category: 'prop',
        keywords: ['village', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1431',
        path: '/models/samples/VirtualCity.glb', // VirtualCity
        category: 'prop',
        keywords: ['VirtualCity', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1432',
        path: '/models/samples/wagon.glb', // wagon
        category: 'prop',
        keywords: ['wagon', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1433',
        path: '/models/samples/waterwell.glb', // waterwell
        category: 'prop',
        keywords: ['waterwell', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1434',
        path: '/models/samples/Xbot.glb', // Xbot
        category: 'prop',
        keywords: ['Xbot', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1435',
        path: '/models/samples/yellowEnergyBall.glb', // yellowEnergyBall
        category: 'prop',
        keywords: ['yellowEnergyBall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1436',
        path: '/models/samples/YetiSmall.glb', // YetiSmall
        category: 'prop',
        keywords: ['YetiSmall', 'samples'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1437',
        path: '/models/vehicles/acrobaticPlane_variants.glb', // acrobaticPlane_variants
        category: 'prop',
        keywords: ['acrobaticPlane', 'variants', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1438',
        path: '/models/vehicles/aerobatic_plane.glb', // aerobatic_plane
        category: 'prop',
        keywords: ['aerobatic', 'plane', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1439',
        path: '/models/vehicles/babylon-assets_Buggy.glb', // babylon-assets_Buggy
        category: 'prop',
        keywords: ['babylon', 'assets', 'Buggy', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1440',
        path: '/models/vehicles/babylon-assets_CesiumMilkTruck.glb', // babylon-assets_CesiumMilkTruck
        category: 'prop',
        keywords: ['babylon', 'assets', 'CesiumMilkTruck', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1441',
        path: '/models/vehicles/car-kit_ambulance.glb', // car-kit_ambulance
        category: 'prop',
        keywords: ['car', 'kit', 'ambulance', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1442',
        path: '/models/vehicles/car-kit_box.glb', // car-kit_box
        category: 'prop',
        keywords: ['car', 'kit', 'box', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1443',
        path: '/models/vehicles/car-kit_cone-flat.glb', // car-kit_cone-flat
        category: 'prop',
        keywords: ['car', 'kit', 'cone', 'flat', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1444',
        path: '/models/vehicles/car-kit_cone.glb', // car-kit_cone
        category: 'prop',
        keywords: ['car', 'kit', 'cone', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1445',
        path: '/models/vehicles/car-kit_debris-bolt.glb', // car-kit_debris-bolt
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'bolt', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1446',
        path: '/models/vehicles/car-kit_debris-bumper.glb', // car-kit_debris-bumper
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'bumper', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1447',
        path: '/models/vehicles/car-kit_debris-drivetrain-axle.glb', // car-kit_debris-drivetrain-axle
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'drivetrain', 'axle', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1448',
        path: '/models/vehicles/car-kit_debris-drivetrain.glb', // car-kit_debris-drivetrain
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'drivetrain', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1449',
        path: '/models/vehicles/car-kit_debris-nut.glb', // car-kit_debris-nut
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'nut', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1450',
        path: '/models/vehicles/car-kit_debris-plate-a.glb', // car-kit_debris-plate-a
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'plate', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1451',
        path: '/models/vehicles/car-kit_debris-plate-b.glb', // car-kit_debris-plate-b
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'plate', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1452',
        path: '/models/vehicles/car-kit_debris-plate-small-a.glb', // car-kit_debris-plate-small-a
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'plate', 'small', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1453',
        path: '/models/vehicles/car-kit_debris-plate-small-b.glb', // car-kit_debris-plate-small-b
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'plate', 'small', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1454',
        path: '/models/vehicles/car-kit_debris-spoiler-a.glb', // car-kit_debris-spoiler-a
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'spoiler', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1455',
        path: '/models/vehicles/car-kit_debris-spoiler-b.glb', // car-kit_debris-spoiler-b
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'spoiler', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1456',
        path: '/models/vehicles/car-kit_debris-tire.glb', // car-kit_debris-tire
        category: 'prop',
        keywords: ['car', 'kit', 'debris', 'tire', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1457',
        path: '/models/vehicles/car-kit_delivery-flat.glb', // car-kit_delivery-flat
        category: 'prop',
        keywords: ['car', 'kit', 'delivery', 'flat', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1458',
        path: '/models/vehicles/car-kit_delivery.glb', // car-kit_delivery
        category: 'prop',
        keywords: ['car', 'kit', 'delivery', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1459',
        path: '/models/vehicles/car-kit_firetruck.glb', // car-kit_firetruck
        category: 'prop',
        keywords: ['car', 'kit', 'firetruck', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1460',
        path: '/models/vehicles/car-kit_garbage-truck.glb', // car-kit_garbage-truck
        category: 'prop',
        keywords: ['car', 'kit', 'garbage', 'truck', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1461',
        path: '/models/vehicles/car-kit_hatchback-sports.glb', // car-kit_hatchback-sports
        category: 'prop',
        keywords: ['car', 'kit', 'hatchback', 'sports', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1462',
        path: '/models/vehicles/car-kit_kart-oobi.glb', // car-kit_kart-oobi
        category: 'prop',
        keywords: ['car', 'kit', 'kart', 'oobi', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1463',
        path: '/models/vehicles/car-kit_kart-oodi.glb', // car-kit_kart-oodi
        category: 'prop',
        keywords: ['car', 'kit', 'kart', 'oodi', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1464',
        path: '/models/vehicles/car-kit_kart-ooli.glb', // car-kit_kart-ooli
        category: 'prop',
        keywords: ['car', 'kit', 'kart', 'ooli', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1465',
        path: '/models/vehicles/car-kit_kart-oopi.glb', // car-kit_kart-oopi
        category: 'prop',
        keywords: ['car', 'kit', 'kart', 'oopi', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1466',
        path: '/models/vehicles/car-kit_kart-oozi.glb', // car-kit_kart-oozi
        category: 'prop',
        keywords: ['car', 'kit', 'kart', 'oozi', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1467',
        path: '/models/vehicles/car-kit_police.glb', // car-kit_police
        category: 'prop',
        keywords: ['car', 'kit', 'police', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1468',
        path: '/models/vehicles/car-kit_race-future.glb', // car-kit_race-future
        category: 'prop',
        keywords: ['car', 'kit', 'race', 'future', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1469',
        path: '/models/vehicles/car-kit_race.glb', // car-kit_race
        category: 'prop',
        keywords: ['car', 'kit', 'race', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1470',
        path: '/models/vehicles/car-kit_sedan-sports.glb', // car-kit_sedan-sports
        category: 'prop',
        keywords: ['car', 'kit', 'sedan', 'sports', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1471',
        path: '/models/vehicles/car-kit_sedan.glb', // car-kit_sedan
        category: 'prop',
        keywords: ['car', 'kit', 'sedan', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1472',
        path: '/models/vehicles/car-kit_suv-luxury.glb', // car-kit_suv-luxury
        category: 'prop',
        keywords: ['car', 'kit', 'suv', 'luxury', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1473',
        path: '/models/vehicles/car-kit_suv.glb', // car-kit_suv
        category: 'prop',
        keywords: ['car', 'kit', 'suv', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1474',
        path: '/models/vehicles/car-kit_taxi.glb', // car-kit_taxi
        category: 'prop',
        keywords: ['car', 'kit', 'taxi', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1475',
        path: '/models/vehicles/car-kit_tractor-police.glb', // car-kit_tractor-police
        category: 'prop',
        keywords: ['car', 'kit', 'tractor', 'police', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1476',
        path: '/models/vehicles/car-kit_tractor-shovel.glb', // car-kit_tractor-shovel
        category: 'prop',
        keywords: ['car', 'kit', 'tractor', 'shovel', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1477',
        path: '/models/vehicles/car-kit_tractor.glb', // car-kit_tractor
        category: 'prop',
        keywords: ['car', 'kit', 'tractor', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1478',
        path: '/models/vehicles/car-kit_truck-flat.glb', // car-kit_truck-flat
        category: 'prop',
        keywords: ['car', 'kit', 'truck', 'flat', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1479',
        path: '/models/vehicles/car-kit_truck.glb', // car-kit_truck
        category: 'prop',
        keywords: ['car', 'kit', 'truck', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1480',
        path: '/models/vehicles/car-kit_van.glb', // car-kit_van
        category: 'prop',
        keywords: ['car', 'kit', 'van', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1481',
        path: '/models/vehicles/car-kit_wheel-dark.glb', // car-kit_wheel-dark
        category: 'prop',
        keywords: ['car', 'kit', 'wheel', 'dark', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1482',
        path: '/models/vehicles/car-kit_wheel-default.glb', // car-kit_wheel-default
        category: 'prop',
        keywords: ['car', 'kit', 'wheel', 'default', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1483',
        path: '/models/vehicles/car-kit_wheel-racing.glb', // car-kit_wheel-racing
        category: 'prop',
        keywords: ['car', 'kit', 'wheel', 'racing', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1484',
        path: '/models/vehicles/car-kit_wheel-tractor-back.glb', // car-kit_wheel-tractor-back
        category: 'prop',
        keywords: ['car', 'kit', 'wheel', 'tractor', 'back', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1485',
        path: '/models/vehicles/car-kit_wheel-tractor-dark-back.glb', // car-kit_wheel-tractor-dark-back
        category: 'prop',
        keywords: ['car', 'kit', 'wheel', 'tractor', 'dark', 'back', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1486',
        path: '/models/vehicles/car-kit_wheel-tractor-dark-front.glb', // car-kit_wheel-tractor-dark-front
        category: 'prop',
        keywords: ['car', 'kit', 'wheel', 'tractor', 'dark', 'front', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1487',
        path: '/models/vehicles/car-kit_wheel-tractor-front.glb', // car-kit_wheel-tractor-front
        category: 'prop',
        keywords: ['car', 'kit', 'wheel', 'tractor', 'front', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1488',
        path: '/models/vehicles/car-kit_wheel-truck.glb', // car-kit_wheel-truck
        category: 'prop',
        keywords: ['car', 'kit', 'wheel', 'truck', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1489',
        path: '/models/vehicles/car.glb', // car
        category: 'prop',
        keywords: ['car', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1490',
        path: '/models/vehicles/CarbonFiberWheel.glb', // CarbonFiberWheel
        category: 'prop',
        keywords: ['CarbonFiberWheel', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1491',
        path: '/models/vehicles/CarbonFibre.glb', // CarbonFibre
        category: 'prop',
        keywords: ['CarbonFibre', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1492',
        path: '/models/vehicles/CarConcept.glb', // CarConcept
        category: 'prop',
        keywords: ['CarConcept', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1493',
        path: '/models/vehicles/CesiumMilkTruck.glb', // CesiumMilkTruck
        category: 'prop',
        keywords: ['CesiumMilkTruck', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1494',
        path: '/models/vehicles/ClearCoatCarPaint.glb', // ClearCoatCarPaint
        category: 'prop',
        keywords: ['ClearCoatCarPaint', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1495',
        path: '/models/vehicles/fantasy-town-kit_cart-high.glb', // fantasy-town-kit_cart-high
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'cart', 'high', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1496',
        path: '/models/vehicles/fantasy-town-kit_cart.glb', // fantasy-town-kit_cart
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'cart', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1497',
        path: '/models/vehicles/graveyard-kit_pumpkin-carved.glb', // graveyard-kit_pumpkin-carved
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pumpkin', 'carved', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1498',
        path: '/models/vehicles/graveyard-kit_pumpkin-tall-carved.glb', // graveyard-kit_pumpkin-tall-carved
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pumpkin', 'tall', 'carved', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1499',
        path: '/models/vehicles/highPolyPlane.glb', // highPolyPlane
        category: 'prop',
        keywords: ['highPolyPlane', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1500',
        path: '/models/vehicles/pumpkinBucketCarved.glb', // pumpkinBucketCarved
        category: 'prop',
        keywords: ['pumpkinBucketCarved', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1501',
        path: '/models/vehicles/three.js-examples_space_ship_hallway.glb', // three.js-examples_space_ship_hallway
        category: 'prop',
        keywords: ['three.js', 'examples', 'space', 'ship', 'hallway', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1502',
        path: '/models/vehicles/ToyCar.glb', // ToyCar
        category: 'prop',
        keywords: ['ToyCar', 'vehicles'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1503',
        path: '/models/weapons/babylon-assets_DamagedHelmet.glb', // babylon-assets_DamagedHelmet
        category: 'prop',
        keywords: ['babylon', 'assets', 'DamagedHelmet', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1504',
        path: '/models/weapons/bowlingBall.glb', // bowlingBall
        category: 'prop',
        keywords: ['bowlingBall', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1505',
        path: '/models/weapons/bowlingPinpin.glb', // bowlingPinpin
        category: 'prop',
        keywords: ['bowlingPinpin', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1506',
        path: '/models/weapons/DamagedHelmet.glb', // DamagedHelmet
        category: 'prop',
        keywords: ['DamagedHelmet', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1507',
        path: '/models/weapons/flightHelmet.glb', // flightHelmet
        category: 'prop',
        keywords: ['flightHelmet', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1508',
        path: '/models/weapons/frostAxe.glb', // frostAxe
        category: 'prop',
        keywords: ['frostAxe', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1509',
        path: '/models/weapons/frostAxe_noMorph.glb', // frostAxe_noMorph
        category: 'prop',
        keywords: ['frostAxe', 'noMorph', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1510',
        path: '/models/weapons/graveyard-kit_detail-bowl.glb', // graveyard-kit_detail-bowl
        category: 'prop',
        keywords: ['graveyard', 'kit', 'detail', 'bowl', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1511',
        path: '/models/weapons/platformer-kit_arrow.glb', // platformer-kit_arrow
        category: 'prop',
        keywords: ['platformer', 'kit', 'arrow', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1512',
        path: '/models/weapons/platformer-kit_arrows.glb', // platformer-kit_arrows
        category: 'prop',
        keywords: ['platformer', 'kit', 'arrows', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1513',
        path: '/models/weapons/platformer-kit_block-snow-large-slope-narrow.glb', // platformer-kit_block-snow-large-slope-narrow
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'large', 'slope', 'narrow', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1514',
        path: '/models/weapons/platformer-kit_block-snow-large-slope-steep-narrow.glb', // platformer-kit_block-snow-large-slope-steep-narrow
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'large', 'slope', 'steep', 'narrow', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1515',
        path: '/models/weapons/platformer-kit_block-snow-low-narrow.glb', // platformer-kit_block-snow-low-narrow
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'low', 'narrow', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1516',
        path: '/models/weapons/platformer-kit_block-snow-narrow.glb', // platformer-kit_block-snow-narrow
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'narrow', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1517',
        path: '/models/weapons/platformer-kit_block-snow-overhang-large-slope-narrow.glb', // platformer-kit_block-snow-overhang-large-slope-narrow
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'large', 'slope', 'narrow', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1518',
        path: '/models/weapons/platformer-kit_block-snow-overhang-large-slope-steep-narrow.glb', // platformer-kit_block-snow-overhang-large-slope-steep-narrow
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'large', 'slope', 'steep', 'narrow', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1519',
        path: '/models/weapons/platformer-kit_block-snow-overhang-low-narrow.glb', // platformer-kit_block-snow-overhang-low-narrow
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'low', 'narrow', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1520',
        path: '/models/weapons/platformer-kit_block-snow-overhang-narrow.glb', // platformer-kit_block-snow-overhang-narrow
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'narrow', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1521',
        path: '/models/weapons/runeSword.glb', // runeSword
        category: 'prop',
        keywords: ['runeSword', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1522',
        path: '/models/weapons/stumpAxe.glb', // stumpAxe
        category: 'prop',
        keywords: ['stumpAxe', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1523',
        path: '/models/weapons/sword_noMat.glb', // sword_noMat
        category: 'prop',
        keywords: ['sword', 'noMat', 'weapons'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1524',
        path: '/models/_test_data/AlphaBlendModeTest.glb', // AlphaBlendModeTest
        category: 'prop',
        keywords: ['AlphaBlendModeTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1525',
        path: '/models/_test_data/AlphaBlendModeTest_1769416633725.glb', // AlphaBlendModeTest_1769416633725
        category: 'prop',
        keywords: ['AlphaBlendModeTest', '1769416633725', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1526',
        path: '/models/_test_data/AnimatedMorphCube.glb', // AnimatedMorphCube
        category: 'prop',
        keywords: ['AnimatedMorphCube', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1527',
        path: '/models/_test_data/AnisotropyDiscTest.glb', // AnisotropyDiscTest
        category: 'prop',
        keywords: ['AnisotropyDiscTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1528',
        path: '/models/_test_data/anisotropyMesh.glb', // anisotropyMesh
        category: 'prop',
        keywords: ['anisotropyMesh', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1529',
        path: '/models/_test_data/AnisotropyRotationTest.glb', // AnisotropyRotationTest
        category: 'prop',
        keywords: ['AnisotropyRotationTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1530',
        path: '/models/_test_data/AnisotropyStrengthTest.glb', // AnisotropyStrengthTest
        category: 'prop',
        keywords: ['AnisotropyStrengthTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1531',
        path: '/models/_test_data/AttenuationTest.glb', // AttenuationTest
        category: 'prop',
        keywords: ['AttenuationTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1532',
        path: '/models/_test_data/babylon-assets_AnimatedMorphCube.glb', // babylon-assets_AnimatedMorphCube
        category: 'prop',
        keywords: ['babylon', 'assets', 'AnimatedMorphCube', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1533',
        path: '/models/_test_data/babylon-assets_AnimatedMorphSphere.glb', // babylon-assets_AnimatedMorphSphere
        category: 'prop',
        keywords: ['babylon', 'assets', 'AnimatedMorphSphere', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1534',
        path: '/models/_test_data/babylon-assets_NormalTangentTest.glb', // babylon-assets_NormalTangentTest
        category: 'prop',
        keywords: ['babylon', 'assets', 'NormalTangentTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1535',
        path: '/models/_test_data/babylon-assets_VertexColorTest.glb', // babylon-assets_VertexColorTest
        category: 'prop',
        keywords: ['babylon', 'assets', 'VertexColorTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1536',
        path: '/models/_test_data/ClearCoatTest.glb', // ClearCoatTest
        category: 'prop',
        keywords: ['ClearCoatTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1537',
        path: '/models/_test_data/ClearCoatTest_1769416633736.glb', // ClearCoatTest_1769416633736
        category: 'prop',
        keywords: ['ClearCoatTest', '1769416633736', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1538',
        path: '/models/_test_data/ClearcoatWicker.glb', // ClearcoatWicker
        category: 'prop',
        keywords: ['ClearcoatWicker', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1539',
        path: '/models/_test_data/CompareAlphaCoverage.glb', // CompareAlphaCoverage
        category: 'prop',
        keywords: ['CompareAlphaCoverage', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1540',
        path: '/models/_test_data/CompareAmbientOcclusion.glb', // CompareAmbientOcclusion
        category: 'prop',
        keywords: ['CompareAmbientOcclusion', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1541',
        path: '/models/_test_data/CompareAnisotropy.glb', // CompareAnisotropy
        category: 'prop',
        keywords: ['CompareAnisotropy', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1542',
        path: '/models/_test_data/CompareBaseColor.glb', // CompareBaseColor
        category: 'prop',
        keywords: ['CompareBaseColor', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1543',
        path: '/models/_test_data/CompareClearcoat.glb', // CompareClearcoat
        category: 'prop',
        keywords: ['CompareClearcoat', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1544',
        path: '/models/_test_data/CompareDispersion.glb', // CompareDispersion
        category: 'prop',
        keywords: ['CompareDispersion', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1545',
        path: '/models/_test_data/CompareEmissiveStrength.glb', // CompareEmissiveStrength
        category: 'prop',
        keywords: ['CompareEmissiveStrength', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1546',
        path: '/models/_test_data/CompareIor.glb', // CompareIor
        category: 'prop',
        keywords: ['CompareIor', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1547',
        path: '/models/_test_data/CompareIridescence.glb', // CompareIridescence
        category: 'prop',
        keywords: ['CompareIridescence', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1548',
        path: '/models/_test_data/CompareMetallic.glb', // CompareMetallic
        category: 'prop',
        keywords: ['CompareMetallic', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1549',
        path: '/models/_test_data/CompareNormal.glb', // CompareNormal
        category: 'prop',
        keywords: ['CompareNormal', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1550',
        path: '/models/_test_data/CompareRoughness.glb', // CompareRoughness
        category: 'prop',
        keywords: ['CompareRoughness', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1551',
        path: '/models/_test_data/CompareSheen.glb', // CompareSheen
        category: 'prop',
        keywords: ['CompareSheen', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1552',
        path: '/models/_test_data/CompareSpecular.glb', // CompareSpecular
        category: 'prop',
        keywords: ['CompareSpecular', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1553',
        path: '/models/_test_data/CompareTransmission.glb', // CompareTransmission
        category: 'prop',
        keywords: ['CompareTransmission', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1554',
        path: '/models/_test_data/CompareVolume.glb', // CompareVolume
        category: 'prop',
        keywords: ['CompareVolume', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1555',
        path: '/models/_test_data/CubeVisibility.glb', // CubeVisibility
        category: 'prop',
        keywords: ['CubeVisibility', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1556',
        path: '/models/_test_data/DiffuseTransmissionTest.glb', // DiffuseTransmissionTest
        category: 'prop',
        keywords: ['DiffuseTransmissionTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1557',
        path: '/models/_test_data/DispersionTest.glb', // DispersionTest
        category: 'prop',
        keywords: ['DispersionTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1558',
        path: '/models/_test_data/EmissiveStrengthTest.glb', // EmissiveStrengthTest
        category: 'prop',
        keywords: ['EmissiveStrengthTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1559',
        path: '/models/_test_data/fantasy-town-kit_banner-green.glb', // fantasy-town-kit_banner-green
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'banner', 'green', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1560',
        path: '/models/_test_data/fantasy-town-kit_banner-red.glb', // fantasy-town-kit_banner-red
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'banner', 'red', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1561',
        path: '/models/_test_data/fantasy-town-kit_chimney-base.glb', // fantasy-town-kit_chimney-base
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'chimney', 'base', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1562',
        path: '/models/_test_data/fantasy-town-kit_chimney-top.glb', // fantasy-town-kit_chimney-top
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'chimney', 'top', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1563',
        path: '/models/_test_data/fantasy-town-kit_chimney.glb', // fantasy-town-kit_chimney
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'chimney', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1564',
        path: '/models/_test_data/fantasy-town-kit_fountain-center.glb', // fantasy-town-kit_fountain-center
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'fountain', 'center', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1565',
        path: '/models/_test_data/fantasy-town-kit_fountain-corner-inner-square.glb', // fantasy-town-kit_fountain-corner-inner-square
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'fountain', 'corner', 'inner', 'square', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1566',
        path: '/models/_test_data/fantasy-town-kit_fountain-corner.glb', // fantasy-town-kit_fountain-corner
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'fountain', 'corner', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1567',
        path: '/models/_test_data/fantasy-town-kit_fountain-edge.glb', // fantasy-town-kit_fountain-edge
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'fountain', 'edge', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1568',
        path: '/models/_test_data/fantasy-town-kit_hedge-large.glb', // fantasy-town-kit_hedge-large
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'hedge', 'large', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1569',
        path: '/models/_test_data/fantasy-town-kit_hedge.glb', // fantasy-town-kit_hedge
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'hedge', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1570',
        path: '/models/_test_data/fantasy-town-kit_overhang.glb', // fantasy-town-kit_overhang
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'overhang', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1571',
        path: '/models/_test_data/fantasy-town-kit_pillar-wood.glb', // fantasy-town-kit_pillar-wood
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'pillar', 'wood', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1572',
        path: '/models/_test_data/fantasy-town-kit_planks-half.glb', // fantasy-town-kit_planks-half
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'planks', 'half', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1573',
        path: '/models/_test_data/fantasy-town-kit_poles-horizontal.glb', // fantasy-town-kit_poles-horizontal
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'poles', 'horizontal', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1574',
        path: '/models/_test_data/fantasy-town-kit_poles.glb', // fantasy-town-kit_poles
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'poles', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1575',
        path: '/models/_test_data/fantasy-town-kit_road-curb-end.glb', // fantasy-town-kit_road-curb-end
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'road', 'curb', 'end', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1576',
        path: '/models/_test_data/fantasy-town-kit_road-curb.glb', // fantasy-town-kit_road-curb
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'road', 'curb', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1577',
        path: '/models/_test_data/fantasy-town-kit_road-edge-slope.glb', // fantasy-town-kit_road-edge-slope
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'road', 'edge', 'slope', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1578',
        path: '/models/_test_data/fantasy-town-kit_road-edge.glb', // fantasy-town-kit_road-edge
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'road', 'edge', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1579',
        path: '/models/_test_data/fantasy-town-kit_road-slope.glb', // fantasy-town-kit_road-slope
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'road', 'slope', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1580',
        path: '/models/_test_data/fantasy-town-kit_road.glb', // fantasy-town-kit_road
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'road', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1581',
        path: '/models/_test_data/fantasy-town-kit_stairs-full-corner-inner.glb', // fantasy-town-kit_stairs-full-corner-inner
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'full', 'corner', 'inner', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1582',
        path: '/models/_test_data/fantasy-town-kit_stairs-full-corner-outer.glb', // fantasy-town-kit_stairs-full-corner-outer
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'full', 'corner', 'outer', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1583',
        path: '/models/_test_data/fantasy-town-kit_stairs-full.glb', // fantasy-town-kit_stairs-full
        category: 'prop',
        keywords: ['fantasy', 'town', 'kit', 'stairs', 'full', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1584',
        path: '/models/_test_data/graveyard-kit_pillar-obelisk.glb', // graveyard-kit_pillar-obelisk
        category: 'prop',
        keywords: ['graveyard', 'kit', 'pillar', 'obelisk', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1585',
        path: '/models/_test_data/InterpolationTest.glb', // InterpolationTest
        category: 'prop',
        keywords: ['InterpolationTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1586',
        path: '/models/_test_data/IORTestGrid.glb', // IORTestGrid
        category: 'prop',
        keywords: ['IORTestGrid', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1587',
        path: '/models/_test_data/IridescenceAbalone.glb', // IridescenceAbalone
        category: 'prop',
        keywords: ['IridescenceAbalone', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1588',
        path: '/models/_test_data/IridescenceSuzanne.glb', // IridescenceSuzanne
        category: 'prop',
        keywords: ['IridescenceSuzanne', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1589',
        path: '/models/_test_data/LevelOfDetail.glb', // LevelOfDetail
        category: 'prop',
        keywords: ['LevelOfDetail', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1590',
        path: '/models/_test_data/LightVisibility.glb', // LightVisibility
        category: 'prop',
        keywords: ['LightVisibility', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1591',
        path: '/models/_test_data/MaterialsVariantsShoe.glb', // MaterialsVariantsShoe
        category: 'prop',
        keywords: ['MaterialsVariantsShoe', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1592',
        path: '/models/_test_data/model_0edd72b2-508.glb', // model_0edd72b2-508
        category: 'prop',
        keywords: ['model', '0edd72b2', '508', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1593',
        path: '/models/_test_data/model_1a363c0a-9d6.glb', // model_1a363c0a-9d6
        category: 'prop',
        keywords: ['model', '1a363c0a', '9d6', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1594',
        path: '/models/_test_data/model_1c2c2336-452.glb', // model_1c2c2336-452
        category: 'prop',
        keywords: ['model', '1c2c2336', '452', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1595',
        path: '/models/_test_data/model_378cbff9-748.glb', // model_378cbff9-748
        category: 'prop',
        keywords: ['model', '378cbff9', '748', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1596',
        path: '/models/_test_data/model_3f54926f-2ae.glb', // model_3f54926f-2ae
        category: 'prop',
        keywords: ['model', '3f54926f', '2ae', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1597',
        path: '/models/_test_data/model_47401bf3-3f5.glb', // model_47401bf3-3f5
        category: 'prop',
        keywords: ['model', '47401bf3', '3f5', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1598',
        path: '/models/_test_data/model_47f79259-a8c.glb', // model_47f79259-a8c
        category: 'prop',
        keywords: ['model', '47f79259', 'a8c', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1599',
        path: '/models/_test_data/model_5fea0565-f63.glb', // model_5fea0565-f63
        category: 'prop',
        keywords: ['model', '5fea0565', 'f63', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1600',
        path: '/models/_test_data/model_6a19c719-a9a.glb', // model_6a19c719-a9a
        category: 'prop',
        keywords: ['model', '6a19c719', 'a9a', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1601',
        path: '/models/_test_data/model_7a7e0ee3-619.glb', // model_7a7e0ee3-619
        category: 'prop',
        keywords: ['model', '7a7e0ee3', '619', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1602',
        path: '/models/_test_data/model_80462a56-d7c.glb', // model_80462a56-d7c
        category: 'prop',
        keywords: ['model', '80462a56', 'd7c', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1603',
        path: '/models/_test_data/model_854a8a67-3e8.glb', // model_854a8a67-3e8
        category: 'prop',
        keywords: ['model', '854a8a67', '3e8', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1604',
        path: '/models/_test_data/model_8b38e2ff-f63.glb', // model_8b38e2ff-f63
        category: 'prop',
        keywords: ['model', '8b38e2ff', 'f63', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1605',
        path: '/models/_test_data/model_8f6bffad-7c5.glb', // model_8f6bffad-7c5
        category: 'prop',
        keywords: ['model', '8f6bffad', '7c5', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1606',
        path: '/models/_test_data/model_a38eff0d-59c.glb', // model_a38eff0d-59c
        category: 'prop',
        keywords: ['model', 'a38eff0d', '59c', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1607',
        path: '/models/_test_data/model_b2f30fa2-517.glb', // model_b2f30fa2-517
        category: 'prop',
        keywords: ['model', 'b2f30fa2', '517', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1608',
        path: '/models/_test_data/model_b96212aa-0d9.glb', // model_b96212aa-0d9
        category: 'prop',
        keywords: ['model', 'b96212aa', '0d9', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1609',
        path: '/models/_test_data/model_be8d450b-5d4.glb', // model_be8d450b-5d4
        category: 'prop',
        keywords: ['model', 'be8d450b', '5d4', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1610',
        path: '/models/_test_data/model_e3912051-2d6.glb', // model_e3912051-2d6
        category: 'prop',
        keywords: ['model', 'e3912051', '2d6', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1611',
        path: '/models/_test_data/model_fa5c7f32-60f.glb', // model_fa5c7f32-60f
        category: 'prop',
        keywords: ['model', 'fa5c7f32', '60f', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1612',
        path: '/models/_test_data/morphLoader.glb', // morphLoader
        category: 'prop',
        keywords: ['morphLoader', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1613',
        path: '/models/_test_data/MorphPrimitivesTest.glb', // MorphPrimitivesTest
        category: 'prop',
        keywords: ['MorphPrimitivesTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1614',
        path: '/models/_test_data/MorphStressTest.glb', // MorphStressTest
        category: 'prop',
        keywords: ['MorphStressTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1615',
        path: '/models/_test_data/morphTargetBars.glb', // morphTargetBars
        category: 'prop',
        keywords: ['morphTargetBars', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1616',
        path: '/models/_test_data/MosquitoInAmber_no_extension.glb', // MosquitoInAmber_no_extension
        category: 'prop',
        keywords: ['MosquitoInAmber', 'extension', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1617',
        path: '/models/_test_data/mrtk-fluent-button.glb', // mrtk-fluent-button
        category: 'prop',
        keywords: ['mrtk', 'fluent', 'button', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1618',
        path: '/models/_test_data/NegativeScaleTest.glb', // NegativeScaleTest
        category: 'prop',
        keywords: ['NegativeScaleTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1619',
        path: '/models/_test_data/NormalTangentMirrorTest.glb', // NormalTangentMirrorTest
        category: 'prop',
        keywords: ['NormalTangentMirrorTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1620',
        path: '/models/_test_data/NormalTangentTest.glb', // NormalTangentTest
        category: 'prop',
        keywords: ['NormalTangentTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1621',
        path: '/models/_test_data/platformer-kit_block-snow-corner-low.glb', // platformer-kit_block-snow-corner-low
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'corner', 'low', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1622',
        path: '/models/_test_data/platformer-kit_block-snow-corner.glb', // platformer-kit_block-snow-corner
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'corner', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1623',
        path: '/models/_test_data/platformer-kit_block-snow-hexagon.glb', // platformer-kit_block-snow-hexagon
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'hexagon', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1624',
        path: '/models/_test_data/platformer-kit_block-snow-large-tall.glb', // platformer-kit_block-snow-large-tall
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'large', 'tall', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1625',
        path: '/models/_test_data/platformer-kit_block-snow-large.glb', // platformer-kit_block-snow-large
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'large', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1626',
        path: '/models/_test_data/platformer-kit_block-snow-long.glb', // platformer-kit_block-snow-long
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'long', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1627',
        path: '/models/_test_data/platformer-kit_block-snow-low-hexagon.glb', // platformer-kit_block-snow-low-hexagon
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'low', 'hexagon', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1628',
        path: '/models/_test_data/platformer-kit_block-snow-low-large.glb', // platformer-kit_block-snow-low-large
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'low', 'large', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1629',
        path: '/models/_test_data/platformer-kit_block-snow-low-long.glb', // platformer-kit_block-snow-low-long
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'low', 'long', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1630',
        path: '/models/_test_data/platformer-kit_block-snow-low.glb', // platformer-kit_block-snow-low
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'low', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1631',
        path: '/models/_test_data/platformer-kit_block-snow-overhang-hexagon.glb', // platformer-kit_block-snow-overhang-hexagon
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'hexagon', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1632',
        path: '/models/_test_data/platformer-kit_block-snow-overhang-low-hexagon.glb', // platformer-kit_block-snow-overhang-low-hexagon
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', 'overhang', 'low', 'hexagon', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1633',
        path: '/models/_test_data/platformer-kit_block-snow.glb', // platformer-kit_block-snow
        category: 'prop',
        keywords: ['platformer', 'kit', 'block', 'snow', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1634',
        path: '/models/_test_data/platformer-kit_heart.glb', // platformer-kit_heart
        category: 'prop',
        keywords: ['platformer', 'kit', 'heart', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1635',
        path: '/models/_test_data/platformer-kit_hedge.glb', // platformer-kit_hedge
        category: 'prop',
        keywords: ['platformer', 'kit', 'hedge', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1636',
        path: '/models/_test_data/platformer-kit_jewel.glb', // platformer-kit_jewel
        category: 'prop',
        keywords: ['platformer', 'kit', 'jewel', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1637',
        path: '/models/_test_data/platformer-kit_ladder.glb', // platformer-kit_ladder
        category: 'prop',
        keywords: ['platformer', 'kit', 'ladder', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1638',
        path: '/models/_test_data/platformer-kit_lock.glb', // platformer-kit_lock
        category: 'prop',
        keywords: ['platformer', 'kit', 'lock', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1639',
        path: '/models/_test_data/platformer-kit_platform-overhang.glb', // platformer-kit_platform-overhang
        category: 'prop',
        keywords: ['platformer', 'kit', 'platform', 'overhang', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1640',
        path: '/models/_test_data/platformer-kit_platform-ramp.glb', // platformer-kit_platform-ramp
        category: 'prop',
        keywords: ['platformer', 'kit', 'platform', 'ramp', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1641',
        path: '/models/_test_data/platformer-kit_platform.glb', // platformer-kit_platform
        category: 'prop',
        keywords: ['platformer', 'kit', 'platform', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1642',
        path: '/models/_test_data/platformer-kit_sign.glb', // platformer-kit_sign
        category: 'prop',
        keywords: ['platformer', 'kit', 'sign', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1643',
        path: '/models/_test_data/platformer-kit_star.glb', // platformer-kit_star
        category: 'prop',
        keywords: ['platformer', 'kit', 'star', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1644',
        path: '/models/_test_data/SheenTestGrid.glb', // SheenTestGrid
        category: 'prop',
        keywords: ['SheenTestGrid', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1645',
        path: '/models/_test_data/shoe_variants.glb', // shoe_variants
        category: 'prop',
        keywords: ['shoe', 'variants', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1646',
        path: '/models/_test_data/SimpleInstancing.glb', // SimpleInstancing
        category: 'prop',
        keywords: ['SimpleInstancing', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1647',
        path: '/models/_test_data/SlateProximity.glb', // SlateProximity
        category: 'prop',
        keywords: ['SlateProximity', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1648',
        path: '/models/_test_data/SpecularSilkPouf.glb', // SpecularSilkPouf
        category: 'prop',
        keywords: ['SpecularSilkPouf', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1649',
        path: '/models/_test_data/SpecularTest.glb', // SpecularTest
        category: 'prop',
        keywords: ['SpecularTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1650',
        path: '/models/_test_data/SphereWithTangents.glb', // SphereWithTangents
        category: 'prop',
        keywords: ['SphereWithTangents', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1651',
        path: '/models/_test_data/TextureLinearInterpolationTest.glb', // TextureLinearInterpolationTest
        category: 'prop',
        keywords: ['TextureLinearInterpolationTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1652',
        path: '/models/_test_data/three.js-examples_ClearcoatTest.glb', // three.js-examples_ClearcoatTest
        category: 'prop',
        keywords: ['three.js', 'examples', 'ClearcoatTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1653',
        path: '/models/_test_data/three.js-examples_DispersionTest.glb', // three.js-examples_DispersionTest
        category: 'prop',
        keywords: ['three.js', 'examples', 'DispersionTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1654',
        path: '/models/_test_data/TransmissionOrderTest.glb', // TransmissionOrderTest
        category: 'prop',
        keywords: ['TransmissionOrderTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1655',
        path: '/models/_test_data/TransmissionRoughnessTest.glb', // TransmissionRoughnessTest
        category: 'prop',
        keywords: ['TransmissionRoughnessTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1656',
        path: '/models/_test_data/TransmissionTest.glb', // TransmissionTest
        category: 'prop',
        keywords: ['TransmissionTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1657',
        path: '/models/_test_data/Unicode❤♻Test.glb', // Unicode❤♻Test
        category: 'prop',
        keywords: ['Unicode❤♻Test', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1658',
        path: '/models/_test_data/UnlitTest.glb', // UnlitTest
        category: 'prop',
        keywords: ['UnlitTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1659',
        path: '/models/_test_data/VertexColorTest.glb', // VertexColorTest
        category: 'prop',
        keywords: ['VertexColorTest', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
    {
        id: 'local_1660',
        path: '/models/_test_data/XmpMetadataRoundedCube.glb', // XmpMetadataRoundedCube
        category: 'prop',
        keywords: ['XmpMetadataRoundedCube', '_test_data'],
        normalizedScale: 1.0,
        placement: { zone: 'any', groundOffset: 0, minSpacing: 1.0 },
        boundingBox: { width: 1, height: 1, depth: 1 }
    },
];

export const ASSET_REGISTRY = ASSETS;

export function getAssetMetadata(id: string): AssetMetadata | undefined {
    return ASSETS.find(a => a.id === id);
}

export function getAssetsByCategory(category: AssetMetadata['category']): AssetMetadata[] {
    return ASSETS.filter(a => a.category === category);
}

// ============================================================
// 블랙리스트 경로 패턴 - 테스트 파일 및 내부용 에셋 제외
// ============================================================
const ASSET_PATH_BLACKLIST = [
    '_test_data',
    'test_',
    'debug_',
    '/temp/',
];

function isBlacklistedPath(path: string): boolean {
    const lowerPath = path.toLowerCase();
    return ASSET_PATH_BLACKLIST.some(pattern => lowerPath.includes(pattern.toLowerCase()));
}

/**
 * 키워드-에셋 간 동적 매칭 점수 계산
 * - 정확 일치 = 1.0
 * - 키워드가 에셋 키에 포함 = 키워드 길이/키 길이 × 0.5 (역방향 페널티)
 * - 에셋 키가 키워드에 포함 = 키 길이/키워드 길이 (정규화 점수)
 */
function assetMatchScore(query: string, assetKeyword: string): number {
    if (query === assetKeyword) return 1.0;
    if (assetKeyword.includes(query)) {
        return (query.length / assetKeyword.length) * 0.5;
    }
    if (query.includes(assetKeyword)) {
        return assetKeyword.length / query.length;
    }
    return 0;
}

export function searchAssets(keyword: string): AssetMetadata[] {
    const lower = keyword.toLowerCase();
    const scored: { asset: AssetMetadata; score: number }[] = [];

    for (const a of ASSETS) {
        if (isBlacklistedPath(a.path)) continue;

        // ID 정확 매칭
        if (a.id.toLowerCase() === lower) {
            scored.push({ asset: a, score: 1.0 });
            continue;
        }

        // 키워드 중 최고 스코어 채택
        let bestScore = 0;
        for (const k of a.keywords) {
            const s = assetMatchScore(lower, k.toLowerCase());
            if (s > bestScore) bestScore = s;
        }

        // 동적 임계값: 쿼리 길이에 비례하되 0.4~0.7 범위로 클램프 (v3)
        const rawThreshold = lower.length / (lower.length + 2);
        const threshold = Math.max(0.4, Math.min(0.7, rawThreshold));
        if (bestScore >= threshold) {
            scored.push({ asset: a, score: bestScore });
        }
    }

    // 스코어 내림차순 정렬 → 최적 매칭 우선
    return scored
        .sort((a, b) => b.score - a.score)
        .map(s => s.asset);
}


export function getAllAssets(): AssetMetadata[] {
    return ASSETS;
}
