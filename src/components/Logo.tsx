import useSVGShapes from '@hooks/useSVGShapes';
import { useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import React, { useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

// Email icons created by Freepik - Flaticon
// https://www.flaticon.com/free-icons/email

export enum IconType {
  GitHub = 'github',
  LinkedIn = 'linkedin',
  Email = 'email',
}

interface Props {
  type: IconType;
  position?: THREE.Vector3Tuple;
  scale: number;
  depth?: number;
  bevelThickness?: number;
  bevelSize?: number;
  material: THREE.MeshPhysicalMaterial;
  onPointerLeave(): void;
  onPointerEnter(): void;
}

const URLS: Record<IconType, string> = {
  github: 'https://github.com/knewkirk',
  linkedin: 'https://www.linkedin.com/in/kyle-newkirk-70838829/',
  email: 'mailto:kylednewkirk@gmail.com',
};

export default ({
  type,
  position,
  scale,
  material,
  bevelThickness,
  bevelSize,
  onPointerLeave,
  onPointerEnter,
}: Props) => {
  const [x, y, z] = position || [0, 0, 0];

  const svg = useLoader(SVGLoader, `logos/${type}.svg`);
  const { shapes, centerX, centerY } = useSVGShapes(svg, scale);
  const [matCopy, setMatCopy] = useState<THREE.MeshPhysicalMaterial>();

  const {
    textureScale,
    depth,
    offX,
    offY,
  } = useControls('logosmaterial', {
    textureScale: { value: 0.0002, min: 0.00001, max: 0.0002 },
    depth: { value: 1, min: 0, max: 50 },
    offX: { value: 1.2, min: 0, max: 2 },
    offY: { value: 0.9, min: 0, max: 2 },
  }, { collapsed: true });

  useEffect(() => {
    if (!material) {
      return;
    }
    const matCopy = material.clone();
    matCopy.map = matCopy.map.clone();
    matCopy.map.repeat.set(textureScale, textureScale);
    matCopy.map.offset = new THREE.Vector2(offX, offY);
    setMatCopy(matCopy);
  }, [
    material,
    offX,
    offY,
    textureScale,
  ]);

  const onClick = useCallback(() => {
    window.open(URLS[type], '_blank');
  }, []);

  return (
    <mesh
      scale={scale}
      position={[-centerX + x, centerY + y, z]}
      rotation={[Math.PI, 0, 0]}
      material={matCopy}
      onClick={onClick}
      onPointerLeave={onPointerLeave}
      onPointerEnter={onPointerEnter}
    >
      <extrudeGeometry args={[shapes, { depth, bevelSize, bevelThickness }]} />
    </mesh>
  );
};
