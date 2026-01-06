'use client';

import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { PointerLockControls, KeyboardControls, useKeyboardControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// 키보드 매핑 설정
const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
    { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
    { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
    { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
    { name: 'jump', keys: ['Space'] },
];

/**
 * FirstPersonController
 * 플레이어가 WASD로 이동하고 마우스로 시점을 조작하는 컴포넌트입니다.
 */
export default function FirstPersonController() {
    return (
        <KeyboardControls map={keyboardMap}>
            <PlayerRig />
        </KeyboardControls>
    );
}

function PlayerRig() {
    const rb = useRef<RapierRigidBody>(null);
    const { camera } = useThree();
    const [, get] = useKeyboardControls();

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

        // 입력에 따른 이동 방향 계산
        frontVector.set(0, 0, Number(backward) - Number(forward));
        sideVector.set(Number(left) - Number(right), 0, 0);

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(walkSpeed)
            .applyEuler(camera.rotation);

        // X, Z 평면 이동 속도 적용 (Y는 중력/점프 유지를 위해 기존 속도 유지)
        rb.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

        // 점프 로직 (수직 속도가 거의 0일 때만 가능하도록 예외 처리)
        if (jump && Math.abs(velocity.y) < 0.1) {
            rb.current.setLinvel({ x: velocity.x, y: jumpForce, z: velocity.z }, true);
        }

        // 카메라 위치를 물리 엔진 상의 캐릭터 위치와 동기화 (눈높이 보정)
        const translation = rb.current.translation();
        camera.position.set(translation.x, translation.y + 1.2, translation.z);
    });

    return (
        <>
            <PointerLockControls />
            <RigidBody
                ref={rb}
                colliders="hull"
                mass={1}
                type="dynamic"
                position={[0, 2, 0]}
                enabledRotations={[false, false, false]} // 캐릭터가 회전하며 넘어지지 않도록 고정
            >
                <mesh castShadow visible={false}>
                    <capsuleGeometry args={[0.3, 0.7]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>
        </>
    );
}
