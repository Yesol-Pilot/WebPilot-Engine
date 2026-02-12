/**
 * PositionalAudio.tsx
 * 
 * 3D 공간 상에서 위치에 따라 볼륨이 조절되는 오디오 컴포넌트
 * R3F의 <PositionalAudio> 래퍼
 */

import React, { useRef, useEffect, useState } from 'react';
import { PositionalAudio as ThreePositionalAudio } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

interface PositionalAudioProps {
    url: string;
    distance?: number; // 소리가 들리는 최대 거리
    loop?: boolean;
    autoplay?: boolean;
    volume?: number;
    position?: [number, number, number];
}

export default function PositionalAudio({
    url,
    distance = 10,
    loop = false,
    autoplay = false,
    volume = 1.0,
    position = [0, 0, 0]
}: PositionalAudioProps) {
    const audioRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = useState(autoplay);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.setVolume(volume);
            audioRef.current.setRefDistance(1);
            audioRef.current.setMaxDistance(distance);

            if (autoplay && !audioRef.current.isPlaying) {
                audioRef.current.play();
            }
        }
    }, [url, volume, distance, autoplay]);

    return (
        <group position={position}>
            <ThreePositionalAudio
                ref={audioRef}
                url={url}
                distance={distance}
                loop={loop}
                autoplay={autoplay}
            />
            {/* 디버그용 시각화 (선택 사항) */}
            {/* <mesh>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial color="yellow" wireframe />
            </mesh> */}
        </group>
    );
}
