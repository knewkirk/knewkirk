import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import { Html, MeshDistortMaterial, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import {
  Geometry,
  Base,
  Addition,
  Subtraction,
  Intersection,
  Difference,
} from '@react-three/csg';
import { vertexShader, fragmentShader } from './shaders';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { lerp } from 'three/src/math/MathUtils';

const ABOUT_BODY = `
Welcome! \n
My name is Kyle Newkirk, born and raised in San Jose, CA, and currently \
living in San Francisco. I've been a (mostly frontend) engineer \
for the past 10-or-so years, and after taking the past year off to recover \
from some injuries (details below), I'm starting to look for work again!`;

const UNEMPLOYMENT_TITLE = `
(not very f)unemployment
`;

const UNEMPLOYMENT_BODY = `
I was a Senior Frontend Engineer at Reddit from April 2017 - February 2022, \
working on Core Product and then a founding member of the Design Systems Team. \n
I quit due to a few different injuries - hurt my achilles in Summer 2020 (what a year) \
and ear/facial neuralgia (nerve damage) in Fall 2022. \n
During my time off, aside from healing, I've been learning lots! \
Programming-wise: iOS, Unity, Blender, ThreeJS, Vue. Otherwise: took classes \
on economics, finance, accounting; built a PC; went to several bachelor parties and weddings. \
I also did some contract work for a buddy of mine starting a crypto company.
`;

interface Props {
  shouldShow: boolean;
}

export default ({ shouldShow }: Props) => {
  const {
    lerpFac,
    intensity,
    speed,
    paperw,
    dist,
    maxWidth,
    z,
    colorA,
    colorB,
    colorC,
    colorD,
  } = useControls(
    'paper',
    {
      lerpFac: { value: 0.02, min: 0.01, max: 0.1 },
      z: { value: 3, min: 0.5, max: 5 },
      paperw: { value: 1.8, min: 0.5, max: 3 },
      dist: { value: 1.9, min: 0.5, max: 4 },
      intensity: { value: 0.03, min: 0, max: 0.1 },
      speed: { value: 0.6, min: 0, max: 1.5 },
      maxWidth: { value: 350, min: 100, max: 400 },
      colorA: { value: '#cecabf' },
      colorB: { value: '#c4c2c0' },
      colorC: { value: '#111111' },
      colorD: { value: '#797979' },
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
  const zRef = useRef<number>(0);

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
    gref.current.position.z = lerp(currZ, shouldShow ? 3.0 : -20.0, lerpFac);
    const currY = gref.current.position.y;
    gref.current.position.y = lerp(currY, shouldShow ? 2.0 : -2.0, lerpFac);
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

  const [geo, setGeo] = useState<TextGeometry>();
  useEffect(() => {
    new FontLoader().load('fonts/Shrikhand_Regular.json', (font) => {
      const tGeo = new TextGeometry('About', {
        // bevelEnabled: true,
        font,
        size: 0.2,
        height: 0.5,
      });
      setGeo(tGeo);
    });
  }, []);

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
        position={[0, 2, 2]}
        scale={1.5}
        ref={gref}
      >
        <mesh ref={meshRef}>
          <planeGeometry args={[paperw, paperw * 1.5, 20, 20]} />
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
            font={'fonts/Shrikhand-Regular.ttf'}
            fontSize={0.2}
            maxWidth={1.5}
            position={[0, 1.05, 0.1]}
            material={textShaderRef}
          >
            About
          </Text>
        </Suspense>
        <Text
          ref={textRef}
          fontSize={0.06}
          maxWidth={1.5}
          position={[0, 0.6, 0.1]}
          material={textShaderRef}
          // lineHeight={1.5}
        >
          {ABOUT_BODY}
        </Text>

        <Text
          anchorX={'center'}
          ref={textRef}
          fontSize={0.1}
          maxWidth={1.5}
          position={[0, 0.1, 0.1]}
          material={textShaderRef}
          font={'fonts/Shrikhand-Regular.ttf'}
        >
          {UNEMPLOYMENT_TITLE}
        </Text>
        <Text
          ref={textRef}
          fontSize={0.06}
          maxWidth={1.5}
          position={[0, -0.5, 0.1]}
          material={textShaderRef}
        >
          {UNEMPLOYMENT_BODY}
        </Text>
      </group>
    </>
  );
};
/*
const HTMLText = () => {
  return (
    <Html
      // wrapperClass="html-page"
      transform
      distanceFactor={dist}
      // center
    >
      <div
        className="wrapper"
        style={{ maxWidth: `${maxWidth}px` }}
      >
        <h1>About</h1>
        <p>{ABOUT_BODY}</p>
        <h2>(Not that f)unemployment</h2>
        <p>I hurt myself</p>
      </div>
    </Html>
  );
};
*/
//
