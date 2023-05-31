import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Center, Text3D, useTexture } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';
import Logo, { IconType } from './Logo';

const FONTS = [
  'fonts/Bungee_Regular.json',
  'fonts/Carter One_Regular.json', // classy but not too serious
  'fonts/Changa One_Regular.json',
  'fonts/Chewy_Regular.json', //
  'fonts/Concert One_Regular.json',
  'fonts/Knewave_Regular.json',
  'fonts/Luckiest Guy_Regular.json', // silly, bold
  // 'McLaren_Regular.json',
  // 'Overpass Black_Regular.json', // plain
  'fonts/Paytone One_Regular.json', //
  // 'Rampart One_Regular.json', // kinda trippy 4d effect
  'fonts/Rowdies_Bold.json',
  // 'Rowdies_Regular.json', // no
  'fonts/Shrikhand_Regular.json', // ++++ kinda like the puffy vibe
  'fonts/Sigmar One_Regular.json', // BLOCK, but not too serious
  'fonts/Sigmar_Regular.json', // same, but w engineer allcaps vibe
  // 'Skranji_Bold.json',
  // 'Skranji_Regular.json',
  'fonts/Titan One_Regular.json',
];

interface Props {
  position?: THREE.Vector3Tuple;
  rotation?: THREE.Vector3Tuple;
  onAboutClick(): void;
  onAboutMissed(): void;
}

export default ({ position, rotation, onAboutClick, onAboutMissed }: Props) => {
  const [aoMap, map, displacementMap, metalnessMap, normalMap, roughnessMap] =
    useTexture(
      [
        'textures/wood/WoodFloor043_1K_AmbientOcclusion.jpg',
        'textures/wood/WoodFloor043_1K_Color.jpg',
        'textures/wood/WoodFloor043_1K_Displacement.jpg',
        'textures/wood/WoodFloor043_1K_Metalness.jpg',
        'textures/wood/WoodFloor043_1K_Normal.jpg',
        'textures/wood/WoodFloor043_1K_Roughness.jpg',
      ],
      (texture: THREE.Texture[]) => {
        texture.forEach((t) => {
          t.wrapS = THREE.RepeatWrapping;
          t.wrapT = THREE.RepeatWrapping;
          t.repeat.set(0.05, 0.05);
        });
      }
    );

  const {
    spacing,
    liScale,
    liDepth,
    liOffset,
    ghScale,
    ghDepth,
    eScale,
    eDepth,
  } = useControls(
    'logospacing',
    {
      spacing: { value: 0.75, min: 0, max: 2 },
      eScale: { value: 0.0012, min: 0.0001, max: 0.0015 },
      eDepth: { value: 80, min: 20, max: 100 },
      liScale: { value: 0.001, min: 0.0001, max: 0.002 },
      liDepth: { value: 80, min: 20, max: 100 },
      liOffset: { value: 0.05, min: 0.01, max: 0.1 },
      ghScale: { value: 0.0053, min: 0.001, max: 0.009 },
      ghDepth: { value: 10, min: 5, max: 20 },
    },
    { collapsed: true }
  );

  const {
    scale,
    scaleSm,
    linksOffset,
    linksPadding,
    specularIntensity,
    roughness,
    ...fontProps
  } = useControls(
    'text',
    {
      specularIntensity: { value: 0.02, min: 0, max: 0.1 },
      roughness: { value: 0.8, min: 0, max: 1 },
      linksOffset: { value: 1.7, min: 0, max: 3 },
      linksPadding: { value: 0.5, min: 0, max: 1 },
      font: { value: 'fonts/Sigmar One_Regular.json', options: FONTS },
      size: { value: 2.2, min: 0, max: 5 },
      scale: { value: 0.25, min: 0, max: 0.5 },
      scaleSm: { value: 0.6, min: 0, max: 1 },
      height: { value: 1.3, min: 0, max: 4 },
      bevelOffset: { value: 0, min: -0.5, max: 2 },
      bevelEnabled: { value: true },
      bevelSize: { value: 0.1, min: 0, max: 2 },
      bevelThickness: { value: 0.1, min: 0, max: 2 },
      bevelSegments: { value: 20, min: 0, max: 20 },
      curveSegments: { value: 20, min: 3, max: 20 },
      smooth: { value: 0, min: 0, max: 5, step: 1 },
    },
    { collapsed: true }
  );

  const ref = useRef();
  const [material, setMaterial] = useState();

  useEffect(
    () => setMaterial(ref.current),
    [
      aoMap,
      map,
      displacementMap,
      metalnessMap,
      normalMap,
      roughnessMap,
      specularIntensity,
      roughness,
    ]
  );

  const onPointerEnter = useCallback(() => {
    document.body.classList.add('pointer');
  }, []);
  const onPointerLeave = useCallback(() => {
    document.body.classList.remove('pointer');
  }, []);
  const onResumeClick = useCallback(() => {
    window.open('newkirk-resume.pdf', 'blank');
  }, []);

  return (
    <>
      <meshPhysicalMaterial
        aoMap={aoMap}
        map={map}
        displacementMap={displacementMap}
        normalMap={normalMap}
        displacementScale={0.01}
        specularIntensity={specularIntensity}
        roughness={roughness}
        ref={ref}
      />
      <group rotation={rotation}>
        <Center
          scale={scale}
          position={position}
        >
          <mesh>
            <Text3D
              material={material}
              {...fontProps}
            >
              Kyle
            </Text3D>
          </mesh>
        </Center>
        <Center
          scale={scale}
          position={[position[0], position[1] - 0.7, position[2]]}
        >
          <mesh>
            <Text3D
              material={material}
              {...fontProps}
            >
              Newkirk
            </Text3D>
          </mesh>
        </Center>
        <Center
          scale={scale * scaleSm}
          position={[position[0], position[1] - linksOffset, position[2]]}
        >
          <mesh
            onClick={(e) => {
              onAboutClick();
              e.stopPropagation();
            }}
            onPointerMissed={onAboutMissed}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
          >
            <Text3D
              material={material}
              {...fontProps}
            >
              About
            </Text3D>
          </mesh>
        </Center>
        <Center
          scale={scale * scaleSm}
          position={[
            position[0],
            position[1] - (linksOffset + 0.5),
            position[2],
          ]}
        >
          <mesh
            onClick={onResumeClick}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
          >
            <Text3D
              material={material}
              {...fontProps}
            >
              Resumé
            </Text3D>
          </mesh>
        </Center>
        <Logo
          type={IconType.Email}
          scale={eScale}
          material={material}
          position={[
            position[0] - spacing,
            position[1] - (linksOffset + 1.3),
            position[2],
          ]}
          bevelThickness={eDepth}
          bevelSize={5}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        />
        <Logo
          type={IconType.LinkedIn}
          scale={liScale}
          material={material}
          position={[
            position[0] + liOffset,
            position[1] - (linksOffset + 1.3),
            position[2],
          ]}
          bevelThickness={liDepth}
          bevelSize={5}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        />
        <Logo
          type={IconType.GitHub}
          scale={ghScale}
          material={material}
          position={[
            position[0] + spacing,
            position[1] - (linksOffset + 1.3),
            position[2],
          ]}
          bevelThickness={ghDepth}
          bevelSize={2}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        />
      </group>
    </>
  );
};
