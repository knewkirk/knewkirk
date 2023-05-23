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
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);

  const { sunX, sunY, sunZ, sunColor, distortionScale, speed } = useControls(
    'water',
    {
      sunX: { value: -40, min: -100, max: 100 },
      sunY: { value: -30, min: -100, max: 10 },
      sunZ: { value: -250, min: -1000, max: 500 },
      sunColor: { value: '#fcc78a' },
      distortionScale: { value: 0.3, min: 0, max: 2 },
      speed: { value: 0.1, min: 0, max: 1 },
    },
    { collapsed: true }
  );
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(sunX, sunY, sunZ),
      sunColor: new THREE.Color(sunColor),
      waterColor: 0x001e0f,
      distortionScale,
      fog: false,
    }),
    [waterNormals, sunX, sunY, sunZ, sunColor, distortionScale]
  );
  const Waterr = useMemo(() => new Water(geom, config), [config]);
  useFrame((state, delta) => {
    if (!ref.current) {
      return;
    }
    (ref.current as any).material.uniforms.time.value += delta * speed;
  });

  return (
    <primitive
      ref={ref}
      object={Waterr}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
};
