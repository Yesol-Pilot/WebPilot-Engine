'use client';

import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { PointerLockControls, KeyboardControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

// 키보드 매핑 설정
const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
    { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
    { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
    { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
    { name: 'jump', keys: ['Space'] },
];

interface FirstPersonControllerProps {
    onHoverChange: (name: string | null) => void;
    onLockChange?: (isLocked: boolean) => void;
}

/**
 * FirstPersonController
 * 플레이어가 WASD로 이동하고 마우스로 시점을 조작하며,
 * 시선 기반 상호작용(Raycasting) 및 추락 방지(Respawn) 로직을 포함합니다.
 */
export default function FirstPersonController({ onHoverChange, onLockChange }: FirstPersonControllerProps) {
    return (
        <KeyboardControls map={keyboardMap}>
            <PlayerRig onHoverChange={onHoverChange} onLockChange={onLockChange} />
        </KeyboardControls>
    );
}

function PlayerRig({ onHoverChange, onLockChange }: FirstPersonControllerProps) {
    const rb = useRef<RapierRigidBody>(null);
    const { camera, scene } = useThree();
    const [, get] = useKeyboardControls();

    // Raycaster 인스턴스 (메모리 최적화를 위해 내부에서 한 번만 생성)
    const raycaster = useRef(new THREE.Raycaster());

    // 이동 및 점프 설정
    const walkSpeed = 5;
    const jumpForce = 5;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    useFrame(() => {
        if (!rb.current) return;

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

        if (jump && Math.abs(velocity.y) < 0.1) {
            rb.current.setLinvel({ x: velocity.x, y: jumpForce, z: velocity.z }, true);
        }

        // 카메라 위치 동기화
        camera.position.set(translation.x, translation.y + 1.2, translation.z);

        // 3. 시선 상호작용 (Raycasting)
        // 화면 중앙(0, 0)에서 카메라 방향으로 레이저 발사
        raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);

        // 씬 내의 모든 객체와 충돌 검사
        const intersects = raycaster.current.intersectObjects(scene.children, true);

        // interactable 태그가 있는 가장 가까운 물체 찾기
        const hit = intersects.find(i => i.object.userData && i.object.userData.isInteractable);

        if (hit) {
            const name = hit.object.userData.name || '알 수 없는 물체';
            onHoverChange(name);
        } else {
            onHoverChange(null);
        }
    });

    return (
        <>
            <PointerLockControls
                onLock={() => onLockChange?.(true)}
                onUnlock={() => onLockChange?.(false)}
            />
            <RigidBody
                ref={rb}
                colliders="hull"
                mass={1}
                type="dynamic"
                position={[0, 2, 0]}
                enabledRotations={[false, false, false]}
            >
                <mesh castShadow visible={false}>
                    <capsuleGeometry args={[0.3, 0.7]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>
        </>
    );
}
