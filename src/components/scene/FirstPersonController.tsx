import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider, CuboidCollider } from '@react-three/rapier';
import { PointerLockControls, KeyboardControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

// 키보드 매핑 설정
const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
    { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
    { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
    { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'interact', keys: ['keyE', 'e', 'E'] },
];

interface FirstPersonControllerProps {
    onHoverChange: (name: string | null) => void;
    onLockChange?: (isLocked: boolean) => void;
    disableControl?: boolean;
}

/**
 * FirstPersonController
 * 플레이어가 WASD로 이동하고 마우스로 시점을 조작하며,
 * 시선 기반 상호작용(Raycasting) 및 추락 방지(Respawn) 로직을 포함합니다.
 */
export default function FirstPersonController({ onHoverChange, onLockChange, disableControl = false }: FirstPersonControllerProps) {
    return (
        <KeyboardControls map={keyboardMap}>
            <PlayerRig onHoverChange={onHoverChange} onLockChange={onLockChange} disableControl={disableControl} />
        </KeyboardControls>
    );
}

function PlayerRig({ onHoverChange, onLockChange, disableControl }: FirstPersonControllerProps) {
    const rb = useRef<RapierRigidBody>(null);
    const { camera, scene } = useThree();
    const [, get] = useKeyboardControls();

    // 접지 상태 확인을 위한 ref
    const grounded = useRef(false);

    // Raycaster 인스턴스
    const raycaster = useRef(new THREE.Raycaster());

    // 이동 및 점프 설정
    const walkSpeed = 5;
    const jumpForce = 5;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    useFrame(() => {
        if (!rb.current) return;

        // [MODIFIED] 제어 비활성화 시 이동 로직 건너뛰기
        if (disableControl) {
            // 원한다면 속도를 0으로 줄일 수 있음
            // rb.current.setLinvel({ x: 0, y: rb.current.linvel().y, z: 0 }, true);
            return;
        }

        const { forward, backward, left, right, jump } = get();
        const velocity = rb.current.linvel();
        const translation = rb.current.translation();

        // 1. 추락 방지 (Respawn)
        if (translation.y < -10) {
            console.log('[Physics] 플레이어 추락 감지! 리스폰합니다.');
            rb.current.setTranslation({ x: 0, y: 5, z: 0 }, true);
            rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        }

        // 2. 이동 로직
        frontVector.set(0, 0, Number(backward) - Number(forward));
        sideVector.set(Number(left) - Number(right), 0, 0);

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(walkSpeed)
            .applyEuler(camera.rotation);

        rb.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

        // 점프 로직 수정: 속도 대신 접지 센서(grounded) 확인
        if (jump && grounded.current) {
            rb.current.setLinvel({ x: velocity.x, y: jumpForce, z: velocity.z }, true);
            grounded.current = false; // 점프 즉시 접지 해제 (연타 방지)
        }

        // 카메라 위치 동기화
        camera.position.set(translation.x, translation.y + 1.2, translation.z);

        // 3. 시선 상호작용 (Raycasting)
        raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);
        const intersects = raycaster.current.intersectObjects(scene.children, true);
        const hit = intersects.find(i => i.object.userData && i.object.userData.isInteractable);

        if (hit) {
            const name = hit.object.userData.name || '알 수 없는 물체';
            onHoverChange(name);

            const { interact } = get();
            if (interact) {
                console.log(`[Interaction] "${name}"와(과) 상호작용 시도!`);
                if (hit.object.userData && hit.object.userData.onAction) {
                    hit.object.userData.onAction();
                }
            }
        } else {
            onHoverChange(null);
        }
    });

    return (
        <>
            {!disableControl && (
                <PointerLockControls
                    onLock={() => onLockChange?.(true)}
                    onUnlock={() => onLockChange?.(false)}
                />
            )}
            <RigidBody
                ref={rb}
                colliders={false} // 수동 Collider 설정
                mass={1}
                type="dynamic"
                position={[0, 2, 0]}
                enabledRotations={[false, false, false]}
            >
                {/* 몸체 Collider (Capsule) */}
                <CapsuleCollider args={[0.35, 0.3]} />

                {/* 발바닥 센서 (Ground Check) */}
                <CuboidCollider
                    args={[0.2, 0.1, 0.2]}
                    position={[0, -0.65, 0]}
                    sensor
                    onIntersectionEnter={() => { grounded.current = true; }}
                    onIntersectionExit={() => { grounded.current = false; }}
                />

                <mesh castShadow visible={false}>
                    <capsuleGeometry args={[0.3, 0.7]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>
        </>
    );
}
