/**
 * PhysicsScatteringService.ts
 * 
 * 물리 기반 오브젝트 배치 보정 서비스 (v4.0 Physical Intelligence)
 * MCTS로 결정된 초기 위치에서 물리 시뮬레이션을 실행하여 자연스러운 배치를 유도합니다.
 */

import RAPIER from '@dimforge/rapier3d-compat';

export interface ScatteringObject {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    mass?: number;
    friction?: number;
    restitution?: number;
}

export class PhysicsScatteringService {
    private static initialized = false;

    /**
     * Rapier 엔진 초기화 (WASM 로드)
     */
    static async init() {
        if (!this.initialized) {
            // 브라우저 및 Node 환경에서 호환되도록 초기화
            await RAPIER.init();
            this.initialized = true;
            console.log('[PhysicsScatteringService] 🏎️ Rapier Physics Engine Initialized');
        }
    }

    /**
     * 지정된 오브젝트 리스트에 대해 물리 시뮬레이션 실행
     * @param objects 초기 배치 정보
     * @param steps 시뮬레이션 스텝 (기본 60프레임 = 1초)
     * @returns 물리적으로 안정화된 위치 정보를 포함한 오브젝트 리스트
     */
    async simulateScattering(objects: ScatteringObject[], steps: number = 60): Promise<ScatteringObject[]> {
        await PhysicsScatteringService.init();

        // 1. World 생성 (중력 설정: Y축 아래방향 -9.81)
        const gravity = { x: 0.0, y: -9.81, z: 0.0 };
        const world = new RAPIER.World(gravity);

        // 2. 바닥(Ground) 생성 (오브젝트들이 아래로 떨어지지 않게)
        // 넓은 평면을 바닥으로 설정
        const groundColliderDesc = RAPIER.ColliderDesc.cuboid(100, 0.1, 100);
        world.createCollider(groundColliderDesc);

        // 3. RigidBody 및 Collider 등록
        const bodyMap = new Map<string, RAPIER.RigidBody>();

        objects.forEach(obj => {
            // 위치 보정용 RigidBody (입력 위치보다 아주 약간 위에서 떨어뜨림으로써 겹침 방지 및 안착 유도)
            const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
                .setTranslation(obj.position[0], obj.position[1] + 0.05, obj.position[2])
                // 단순 Y축 회전 적용 (Quaternion: [0, sin(y/2), 0, cos(y/2)])
                .setRotation({
                    x: 0,
                    y: Math.sin(obj.rotation[1] / 2),
                    z: 0,
                    w: Math.cos(obj.rotation[1] / 2)
                });

            const body = world.createRigidBody(bodyDesc);

            // 콜라이더 설정 (단순 박스 기반)
            // scale의 절반(half-extents)을 인자로 전달
            const colliderDesc = RAPIER.ColliderDesc.cuboid(
                Math.max(obj.scale[0], 0.1) / 2,
                Math.max(obj.scale[1], 0.1) / 2,
                Math.max(obj.scale[2], 0.1) / 2
            )
                .setFriction(obj.friction ?? 0.5)
                .setRestitution(obj.restitution ?? 0.2);

            world.createCollider(colliderDesc, body);
            bodyMap.set(obj.id, body);
        });

        // 4. 시뮬레이션 실행 (지정된 스텝만큼)
        // [Note] 헤드리스 환경이므로 매우 빠른 속도로 연산됨
        for (let i = 0; i < steps; i++) {
            world.step();
        }

        // 5. 결과 추출
        const results = objects.map(obj => {
            const body = bodyMap.get(obj.id);
            if (!body) return obj;

            const trans = body.translation();
            // 쿼터니언에서 Y축 회전을 다시 추출하는 대신, 안정화된 위치 반영을 주목적으로 함

            return {
                ...obj,
                position: [trans.x, trans.y, trans.z]
            } as ScatteringObject;
        });

        // 6. 리소스 해제 (Memory leak 방지 필수)
        world.free();

        console.log(`[PhysicsScatteringService] 📦 ${objects.length}개 오브젝트 물리 안정화 완료`);
        return results;
    }
}
