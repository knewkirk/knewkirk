import React, { Suspense } from 'react';
import { OrbitControls, Stats, Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Leva, useControls } from 'leva';

import './index.less';

export default () => {
  let devMode = false;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(document.location.search);
    devMode = !!params.get('dev');
  }

  const { color } = useControls({ color: { value: '#bbbbbb' } });

  return (
    <>
      <Canvas>
        <OrbitControls />
        <Suspense fallback={null}>
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color={color} />
          </mesh>
        </Suspense>
      </Canvas>
      <Leva hidden={PRODUCTION && !devMode} />
      {(!PRODUCTION || devMode) && <Stats />}
      <Loader />
    </>
  );
};
