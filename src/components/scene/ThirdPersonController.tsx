
// [MMO-Style 3rd Person Controller]
// WASD to Move, Right-Click Drag to Orbit Camera
// Cursor always visible.

import { useRef, useEffect, useState, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { KeyboardControls, useKeyboardControls, useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
    { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
    { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
    { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'interact', keys: ['keyE', 'e', 'E'] },
];

interface ThirdPersonControllerProps {
    onHoverChange: (name: string | null) => void;
    disableControl?: boolean;
    isFreeCamera?: boolean; // [New] Prop
}

export default function ThirdPersonController({ onHoverChange, disableControl = false, isFreeCamera = false }: ThirdPersonControllerProps) {
    return (
        <KeyboardControls map={keyboardMap}>
            <PlayerRig onHoverChange={onHoverChange} disableControl={disableControl} isFreeCamera={isFreeCamera} />
        </KeyboardControls>
    );
}

function PlayerRig({ onHoverChange, disableControl, isFreeCamera }: ThirdPersonControllerProps) {
    const rb = useRef<RapierRigidBody>(null);
    const { camera, scene, gl } = useThree();
    const [, get] = useKeyboardControls();

    const grounded = useRef(false);
    const raycaster = useRef(new THREE.Raycaster());

    // [Camera State]
    // Orbit angles
    const yaw = useRef(0);
    const pitch = useRef(0.5); // Start slightly looking down
    const distance = useRef(5); // Distance from player
    const isDragging = useRef(false);

    // Settings
    const walkSpeed = 5;
    const jumpForce = 5;
    const sensitivity = 0.003;

    // Vectors (Memoized to persist across re-renders)
    const direction = useMemo(() => new THREE.Vector3(), []);
    const frontVector = useMemo(() => new THREE.Vector3(), []);
    const sideVector = useMemo(() => new THREE.Vector3(), []);
    const playerPos = useMemo(() => new THREE.Vector3(), []);
    const cameraOffset = useMemo(() => new THREE.Vector3(), []);

    // [Event Listeners] Right-Click Orbit Logic
    useEffect(() => {
        const domElement = gl.domElement;

        const onMouseDown = (e: MouseEvent) => {
            if (e.button === 2) { // Right Click
                isDragging.current = true;
            }
        };

        const onMouseUp = () => {
            isDragging.current = false;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (isDragging.current && !disableControl) {
                yaw.current -= e.movementX * sensitivity;
                pitch.current += e.movementY * sensitivity;

                // Clamp Pitch
                const minPitch = -0.5; // Look up limit
                const maxPitch = 1.5;  // Look down limit
                pitch.current = Math.max(minPitch, Math.min(maxPitch, pitch.current));
            }
        };

        // Scroll to Zoom (Optional)
        const onWheel = (e: WheelEvent) => {
            if (!disableControl) {
                distance.current += e.deltaY * 0.01;
                distance.current = Math.max(2, Math.min(10, distance.current));
            }
        };

        const onContextMenu = (e: Event) => e.preventDefault();

        domElement.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        domElement.addEventListener('wheel', onWheel);
        domElement.addEventListener('contextmenu', onContextMenu);

        return () => {
            domElement.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
            domElement.removeEventListener('wheel', onWheel);
            domElement.removeEventListener('contextmenu', onContextMenu);
        };
    }, [gl.domElement, disableControl]);

    useFrame(() => {
        if (!rb.current) return;

        // Sync Player Position
        const translation = rb.current.translation();
        playerPos.set(translation.x, translation.y, translation.z);

        // --- 0. Ground Detection (Raycast) ---
        const rayOrigin = playerPos.clone();
        raycaster.current.set(rayOrigin, new THREE.Vector3(0, -1, 0));
        raycaster.current.far = 1.5;
        const groundHits = raycaster.current.intersectObjects(scene.children, true);
        const groundHit = groundHits.find(hit => {
            let obj: THREE.Object3D | null = hit.object;
            while (obj) {
                if (obj.userData?.isPlayer) return false;
                obj = obj.parent;
            }
            return true;
        });
        grounded.current = !!(groundHit && groundHit.distance <= 0.8);

        // --- 1. Physics Movement ---
        if (!disableControl && !isFreeCamera) {
            const { forward, backward, left, right, jump } = get();
            const velocity = rb.current.linvel();

            if (translation.y < -10) {
                rb.current.setTranslation({ x: 0, y: 5, z: 0 }, true);
                rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            }

            frontVector.set(0, 0, Number(backward) - Number(forward));
            sideVector.set(Number(left) - Number(right), 0, 0);

            direction
                .subVectors(frontVector, sideVector)
                .normalize()
                .multiplyScalar(walkSpeed)
                .applyEuler(new THREE.Euler(0, yaw.current, 0));

            rb.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

            if (jump) {
                if (grounded.current) {
                    rb.current.setLinvel({ x: velocity.x, y: jumpForce, z: velocity.z }, true);
                    grounded.current = false;
                }
            }
        }

        // --- 2. Camera Update (Chase Mode) ---
        if (!isFreeCamera) {
            const hDist = distance.current * Math.cos(pitch.current);
            const vDist = distance.current * Math.sin(pitch.current);

            const offsetX = hDist * Math.sin(yaw.current);
            const offsetZ = hDist * Math.cos(yaw.current);

            cameraOffset.set(offsetX, vDist, offsetZ);

            const pivot = playerPos.clone().add(new THREE.Vector3(0, 1.5, 0));
            const idealCameraPos = pivot.clone().add(cameraOffset);

            const dirToCam = new THREE.Vector3().subVectors(idealCameraPos, pivot).normalize();
            const distToCam = cameraOffset.length();

            raycaster.current.set(pivot, dirToCam);
            const hits = raycaster.current.intersectObjects(scene.children, true);

            let actualDistance = distToCam;

            for (const hit of hits) {
                if (hit.distance < 0.2) continue;
                if (hit.object.userData?.isPlayer || hit.object.parent?.userData?.isPlayer) continue;

                if (hit.distance < distToCam) {
                    actualDistance = hit.distance - 0.2;
                    break;
                }
            }

            actualDistance = Math.max(0.5, actualDistance);
            const clampedPos = pivot.clone().add(dirToCam.multiplyScalar(actualDistance));

            camera.position.copy(clampedPos);
            camera.lookAt(pivot);
        }

        // --- 3. Interaction Raycasting ---
        raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);
        const intersects = raycaster.current.intersectObjects(scene.children, true);
        const hit = intersects.find(i => i.object.userData && i.object.userData.isInteractable);

        if (hit) {
            const name = hit.object.userData.name || '알 수 없는 물체';
            onHoverChange(name);
            const { interact } = get();
            if (interact && !disableControl) {
                if (hit.object.userData.onAction) hit.object.userData.onAction();
            }
        } else {
            onHoverChange(null);
        }
    });

    return (
        <RigidBody
            ref={rb}
            colliders={false}
            mass={1}
            type="dynamic"
            position={[0, 5, 0]} // Spawn higher to prevent floor clip
            enabledRotations={[false, false, false]}
            ccd // Continuous Collision Detection
            canSleep={false}
        >
            <CapsuleCollider args={[0.35, 0.3]} />


            {/* Player Model Visualization (Character) */}
            <group position={[0, -0.3, 0]}>
                <CharacterModel direction={direction} grounded={grounded} />
            </group>
        </RigidBody>
    );
}

// [Sub-component] Character Model with Rotation & Animation
function CharacterModel({ direction, grounded }: { direction: THREE.Vector3, grounded: React.MutableRefObject<boolean> }) {
    const group = useRef<THREE.Group>(null);
    // Use RobotExpressive for full animation set (Idle, Walking, Running, Jump)
    const { scene, animations } = useGLTF('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb');

    // Bind animations to the scene directly to ensure correct targeting
    const { actions, names } = useAnimations(animations, scene);

    // Debug: Log available animations
    useEffect(() => {
        // console.log('[ThirdPersonController] Available Animations:', names);
    }, [names]);

    // Apply 'isPlayer' tag to all meshes in the model to avoid camera collision
    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.userData.isPlayer = true;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    // Animation State
    const [animation, setAnimation] = useState("Idle");

    useFrame((state, delta) => {
        if (!group.current) return;

        const isMoving = Math.abs(direction.x) > 0.1 || Math.abs(direction.z) > 0.1;
        const isGrounded = grounded.current;

        // 1. Rotation Logic
        if (isMoving) {
            // Fix: RobotExpressive faces +Z. atan2(0, -1) is PI, which rotates it to face -Z.
            // No extra PI offset needed.
            const targetRotation = Math.atan2(direction.x, direction.z);

            // Smooth rotation (slerp-like)
            let rotDiff = targetRotation - group.current.rotation.y;
            // Normalize to -PI ~ PI
            while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
            while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;

            group.current.rotation.y += rotDiff * delta * 10;
        }

        // 2. Animation Logic
        // RobotExpressive has 'Idle', 'Walking', 'Running', 'Jump', 'Death', 'Sitting', 'Standing'
        let nextAnim = isMoving ? "Running" : "Idle";

        if (!isGrounded) {
            // Fallback for Jump or Air
            // RobotExpressive HAS a 'Jump' animation.
            nextAnim = "Jump";
        }

        if (animation !== nextAnim) {
            setAnimation(nextAnim);
        }
    });

    // Handle Animation Transitions
    useEffect(() => {
        const action = actions[animation];
        if (action) {
            action.reset().fadeIn(0.2).play();
            return () => {
                action.fadeOut(0.2);
            };
        }
    }, [animation, actions]);

    return (
        <group ref={group} dispose={null}>
            {/* Visual Offset: Adjusted for RobotExpressive */}
            <primitive object={scene} scale={0.3} position={[0, -0.4, 0]} />
        </group>
    );
}

useGLTF.preload('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb');
