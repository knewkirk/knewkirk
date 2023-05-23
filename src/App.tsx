import React, { Suspense, useState } from 'react';
import * as THREE from 'three';
import {
  OrbitControls,
  Stats,
  Loader,
  PerspectiveCamera,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Leva, useControls } from 'leva';

import './index.less';
import Headline from '@components/Headline';
import Sky from '@components/Sky';
import Clouds from '@components/Clouds';
import About from '@components/About';
import Water from '@components/Water';
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from '@react-three/postprocessing';

export default () => {
  let devMode = false;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(document.location.search);
    devMode = !!params.get('dev');
  }

  const { color1, intensity1, color2, intensity2, lightX, lightY, lightZ } =
    useControls(
      'light',
      {
        color1: { value: '#ffedd2' },
        intensity1: { value: 1.6, min: 0, max: 2 },
        color2: { value: '#ffedd2' },
        intensity2: { value: 15, min: 0, max: 20 },
        lightX: { value: -5, min: -10, max: 10 },
        lightY: { value: 0, min: -2, max: 5 },
        lightZ: { value: -4, min: -10, max: 5 },
      },
      { collapsed: true }
    );

  const [target] = useState(() => new THREE.Object3D());
  const [aboutShowing, setAboutShowing] = useState(false);

  const {
    focusDistance,
    focalLength,
    bokehScale,
    textY,
    textZ,
    orbY,
    orbYOff,
    orbZ,
  } = useControls(
    'focus',
    {
      focusDistance: { value: 0, min: -5, max: 5 }, // where to focus
      focalLength: { value: 0.08, min: 0, max: 0.1 }, // focal length
      bokehScale: { value: 4, min: 0, max: 20 }, // bokeh size
      textY: { value: 3.5, min: 0, max: 10 },
      textZ: { value: 0, min: -5, max: 5 },
      orbY: { value: 1.5, min: 0, max: 10 },
      orbYOff: { value: -1.9, min: -10, max: 10 },
      orbZ: { value: 8, min: -5, max: 10 },
    },
    { collapsed: true }
  );

  return (
    <>
      <Canvas dpr={[1, 2]}>
        <Sky />
        <Clouds />
        <Water />
        <PerspectiveCamera
          makeDefault
          position={[0, orbY, orbZ]}
        />
        <OrbitControls
          target={[0, textY + orbYOff, textZ]}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
        />
        <Suspense fallback={null}>
          <hemisphereLight
            color={color1}
            intensity={intensity1}
          />
          <directionalLight
            position={[lightX, lightY, lightZ]}
            color={color2}
            intensity={intensity2}
            target={target}
          />
          <primitive object={target} />
          <Headline
            position={[0, textY, textZ]}
            onClick={() => setAboutShowing(true)}
            onMissed={() => setAboutShowing(false)}
          />
          <About shouldShow={aboutShowing} />
          <EffectComposer multisampling={0}>
            <DepthOfField
              focalLength={focalLength}
              focusDistance={focusDistance}
              bokehScale={bokehScale}
            />
            <Bloom luminanceThreshold={0.8} />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <Leva hidden={PRODUCTION && !devMode} />
      {(!PRODUCTION || devMode) && <Stats />}
      <Loader />
    </>
  );
};
