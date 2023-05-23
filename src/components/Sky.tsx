import React from 'react';
import { Sky } from '@react-three/drei';
import { useControls } from 'leva';

export default () => {
  const { x, y, z, ...props } = useControls(
    'sky',
    {
      distance: { value: 1000, min: 0, max: 3000 },
      inclination: { value: 0.501, min: 0.48, max: 0.55 },
      azimuth: { value: 0.19, min: 0, max: 1 },
      mieCoefficient: { value: 0.025, min: 0, max: 0.1 },
      mieDirectionalG: { value: 0.994, min: 0.99, max: 1 },
      rayleigh: { value: 2, min: 0, max: 5 },
      turbidity: { value: 2.5, min: 0, max: 5 },
      x: { value: -80, min: -100, max: 0 },
      y: { value: -0.5, min: -10, max: 0 },
      z: { value: -300, min: -1000, max: 10 },
    },
    { collapsed: true }
  );

  return (
    <Sky
      {...props}
      sunPosition={[x, y, z]}
    />
  );
};
