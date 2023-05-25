import React, { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { vertexShader, fragmentShader } from './shaders';
import { lerp } from 'three/src/math/MathUtils';

const FONTS = [
  'fonts/Caveat-VariableFont_wght.ttf',
  'fonts/Caveat-Bold.ttf',
  'fonts/Caveat-Medium.ttf',
  'fonts/Caveat-Regular.ttf',
  'fonts/Caveat-SemiBold.ttf',
  'fonts/CormorantGaramond-Light.ttf',
  'fonts/CormorantGaramond-Regular.ttf',
  'fonts/Parisienne-Regular.ttf',
  'fonts/Playfair-Variable.ttf',
  'fonts/ShadowsIntoLight-Regular.ttf',
];

const ABOUT_BODY = `
Hi there! \
My name is Kyle Newkirk, currently \
living in San Francisco. I've been a (mostly frontend) engineer \
for the past 10 years.`;

const UNEMPLOYMENT_BODY = `
Most recently, I was a Senior Frontend Engineer at Reddit 04/17 - 02/22, \
on Core Product and then a founding member of the Design Systems Team, \
before quitting due to injuries. \
During my time off, aside from healing, I've been learning lots: \
ThreeJS, Vue, Blender, iOS, Unity, \
economics, finance, accounting; also built a PC, traveled a bunch, \
and contracted for a friend.
`;

const CLOSER = `More details in resumé, I look forward to connecting!`;

interface Props {
  shouldShow: boolean;
}

export default ({ shouldShow }: Props) => {
  const {
    font,
    fontSize,
    lerpFac,
    intensity,
    speed,
    h1z,
    p1z,
    p2z,
    p3z,
    paperw,
    paperhfac,
    scale,
    z,
    y,
    colorA,
    colorB,
    colorC,
    colorD,
  } = useControls(
    'paper',
    {
      font: { value: 'fonts/Caveat-Bold.ttf', options: FONTS },
      fontSize: { value: 0.09, min: 0.01, max: 0.2 },
      h1z: { value: 0.92, min: 0.7, max: 1 },
      p1z: { value: 0.65, min: 0.6, max: 0.7 },
      p2z: { value: -0.13, min: -0.2, max: -0.05 },
      p3z: { value: -0.8, min: -0.9, max: -0.7 },
      lerpFac: { value: 0.08, min: 0.01, max: 0.1 },
      z: { value: 2.7, min: 0.5, max: 5 },
      y: { value: 2, min: 0.5, max: 5 },
      paperw: { value: 1.8, min: 0.5, max: 3 },
      paperhfac: { value: 1.3, min: 0.5, max: 3 },
      dist: { value: 1.9, min: 0.5, max: 4 },
      intensity: { value: 0.03, min: 0, max: 0.1 },
      speed: { value: 0.6, min: 0, max: 1.5 },
      scale: { value: 1.5, min: 0.3, max: 2 },
      colorA: { value: '#f2e5cc' },
      colorB: { value: '#fff2e1' },
      colorC: { value: '#111111' },
      colorD: { value: '#555555' },
    },
    { collapsed: true }
  );

  const uniformsMesh = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_colorA: { value: new THREE.Color(colorA) },
      u_colorB: { value: new THREE.Color(colorB) },
      u_intensity: { value: intensity },
      u_opacity: { value: 0 },
    }),
    []
  );
  const uniformsText = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_colorB: { value: new THREE.Color(colorC) },
      u_colorA: { value: new THREE.Color(colorD) },
      u_intensity: { value: intensity },
      u_opacity: { value: 0 },
    }),
    []
  );

  const meshRef = useRef<THREE.Mesh>();
  const textRef = useRef<THREE.Mesh>();
  const gref = useRef<THREE.Group>();
  const [textShaderRef, setTextShaderRef] = useState<THREE.ShaderMaterial>();

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.u_time.value =
      clock.getElapsedTime() * speed;
    (
      meshRef.current.material as THREE.ShaderMaterial
    ).uniforms.u_intensity.value = intensity;
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.u_colorA.value =
      new THREE.Color(colorA);
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.u_colorB.value =
      new THREE.Color(colorB);

    const currOpacity = (meshRef.current.material as THREE.ShaderMaterial)
      .uniforms.u_opacity.value;
    (
      meshRef.current.material as THREE.ShaderMaterial
    ).uniforms.u_opacity.value = lerp(
      currOpacity,
      shouldShow ? 1.0 : 0.0,
      lerpFac
    );

    const currZ = gref.current.position.z;
    gref.current.position.z = lerp(currZ, shouldShow ? z : 0, lerpFac);
    const currY = gref.current.position.y;
    gref.current.position.y = lerp(currY, shouldShow ? y : -2.0, lerpFac);
    const currRotX = gref.current.rotation.x;
    gref.current.rotation.x = lerp(
      currRotX,
      shouldShow ? 0.0 : -Math.PI / 2,
      lerpFac
    );
    const currRotY = gref.current.rotation.y;
    gref.current.rotation.y = lerp(currRotY, shouldShow ? 0.0 : -1.0, lerpFac);
    const currRotZ = gref.current.rotation.z;
    gref.current.rotation.z = lerp(currRotZ, shouldShow ? 0.0 : -1.0, lerpFac);

    if (!textRef.current || !textShaderRef) {
      return;
    }
    (textRef.current.material as THREE.ShaderMaterial).uniforms.u_time.value =
      clock.getElapsedTime() * speed;
    (textRef.current.material as THREE.ShaderMaterial).uniforms.u_colorA.value =
      new THREE.Color(colorC);
    (textRef.current.material as THREE.ShaderMaterial).uniforms.u_colorB.value =
      new THREE.Color(colorD);
    const currTOpacity = (textRef.current.material as THREE.ShaderMaterial)
      .uniforms.u_opacity.value;
    (
      textRef.current.material as THREE.ShaderMaterial
    ).uniforms.u_opacity.value = lerp(
      currTOpacity,
      shouldShow ? 1.0 : 0.0,
      lerpFac
    );
  });

  return (
    <>
      <shaderMaterial
        uniforms={uniformsText}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        ref={(r) => setTextShaderRef(r)}
        transparent
      />
      <group
        position={[0, y, z]}
        scale={scale}
        ref={gref}
      >
        <mesh ref={meshRef}>
          <planeGeometry args={[paperw, paperw * paperhfac, 20, 20]} />
          <shaderMaterial
            side={THREE.DoubleSide}
            uniforms={uniformsMesh}
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            transparent
          />
        </mesh>
        <Suspense fallback={null}>
          <Text
            ref={textRef}
            anchorX={'center'}
            font={'fonts/SigmarOne-Regular.ttf'}
            fontSize={0.2}
            maxWidth={1.5}
            position={[0, h1z, 0.1]}
            material={textShaderRef}
          >
            About
          </Text>
        </Suspense>
        <Text
          ref={textRef}
          fontSize={fontSize}
          maxWidth={1.5}
          position={[0, p1z, 0.1]}
          material={textShaderRef}
          font={font}
        >
          {ABOUT_BODY}
        </Text>
        <Text
          ref={textRef}
          fontSize={fontSize}
          maxWidth={1.5}
          position={[0, p2z, 0.1]}
          material={textShaderRef}
          font={font}
        >
          {UNEMPLOYMENT_BODY}
        </Text>
        <Text
          ref={textRef}
          fontSize={fontSize}
          maxWidth={1.5}
          position={[0, p3z, 0.1]}
          material={textShaderRef}
          font={font}
        >
          {CLOSER}
        </Text>
      </group>
    </>
  );
};
