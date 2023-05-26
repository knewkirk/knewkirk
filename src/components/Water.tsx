import React, { useMemo, useRef } from 'react';
import { extend, useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';
import { Water } from 'three-stdlib';

extend({ Water });

export default () => {
  const ref = useRef();
  const waterNormals = useLoader(THREE.TextureLoader, '/waternormals.jpeg');
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const {
    sunX,
    sunY,
    sunZ,
    sunColor,
    distortionScale,
    speed,
    size,
    textureScale,
  } = useControls(
    'water',
    {
      size: { value: 2000, min: 100, max: 10000 },
      textureScale: { value: 512, min: 128, max: 2048 },
      sunX: { value: -80, min: -200, max: 0 },
      sunY: { value: -50, min: -100, max: 200 },
      sunZ: { value: -250, min: -1000, max: 500 },
      sunColor: { value: '#fcc78a' },
      distortionScale: { value: 0.3, min: 0, max: 2 },
      speed: { value: 0.1, min: 0, max: 1 },
    },
    { collapsed: true }
  );

  const geom = useMemo(() => new THREE.PlaneGeometry(size, size), [size]);

  const config = useMemo(
    () => ({
      textureWidth: textureScale,
      textureHeight: textureScale,
      waterNormals,
      sunDirection: new THREE.Vector3(sunX, sunY, sunZ),
      sunColor: new THREE.Color(sunColor),
      waterColor: 0x001e0f,
      distortionScale,
      fog: false,
    }),
    [waterNormals, sunX, sunY, sunZ, sunColor, distortionScale, textureScale]
  );
  const waterObj = useMemo(() => new Water(geom, config), [geom, config]);
  useFrame((state, delta) => {
    if (!ref.current) {
      return;
    }
    (ref.current as any).material.uniforms.time.value += delta * speed;
  });

  return (
    <primitive
      ref={ref}
      object={waterObj}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
};
