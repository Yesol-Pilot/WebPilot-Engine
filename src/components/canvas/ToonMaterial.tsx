import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

export const ToonShaderMaterial = shaderMaterial(
    {
        uColor: new THREE.Color(1, 1, 1),
        uLightDirection: new THREE.Vector3(1, 1, 1).normalize(),
    },
    // Vertex Shader
    `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform vec3 uColor;
    uniform vec3 uLightDirection;
    varying vec3 vNormal;

    void main() {
      float intensity = dot(vNormal, uLightDirection);
      
      // 3-tone Cel Shading
      if (intensity > 0.95) intensity = 1.0;
      else if (intensity > 0.5) intensity = 0.8;
      else if (intensity > 0.25) intensity = 0.5;
      else intensity = 0.25;

      gl_FragColor = vec4(uColor * intensity, 1.0);
    }
  `
);

extend({ ToonShaderMaterial });
