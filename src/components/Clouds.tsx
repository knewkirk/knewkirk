import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import React, { useRef } from 'react';
import * as THREE from 'three';

export default () => {
  const texture = useTexture('cloud.png', (texture: THREE.Texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
  });

  const { speed, x, y, z, width, opacity, color } = useControls(
    'cloud',
    {
      speed: { value: 1.5, min: 0, max: 10 },
      x: { value: 50, min: -100, max: 100 },
      y: { value: 120, min: 0, max: 200 },
      z: { value: -300, min: -500, max: 50 },
      width: { value: 110, min: 0, max: 200 },
      opacity: { value: 0.6, min: 0, max: 1 },
      color: { value: '#624523' },
    },
    { collapsed: true }
  );

  const meshRef = useRef<THREE.Mesh>();

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }
    meshRef.current.position.x -= delta * speed;
  });

  return (
    <mesh
      position={[x, y, z]}
      ref={meshRef}
    >
      <planeGeometry args={[2.342 * width, width]} />
      <meshPhysicalMaterial
        color={color}
        map={texture}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
};
