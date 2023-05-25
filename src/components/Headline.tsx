import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Center, Float, Text3D, useTexture } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';

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
  onClick(): void;
  onMissed(): void;
}

export default ({ position, onClick, onMissed }: Props) => {
  const [aoMap, map, displacementMap, metalnessMap, normalMap, roughnessMap] =
    useTexture(
      [
        'wood/WoodFloor043_1K_AmbientOcclusion.jpg',
        'wood/WoodFloor043_1K_Color.jpg',
        'wood/WoodFloor043_1K_Displacement.jpg',
        'wood/WoodFloor043_1K_Metalness.jpg',
        'wood/WoodFloor043_1K_Normal.jpg',
        'wood/WoodFloor043_1K_Roughness.jpg',
      ],
      (texture: THREE.Texture[]) => {
        texture.forEach((t) => {
          t.wrapS = THREE.RepeatWrapping;
          t.wrapT = THREE.RepeatWrapping;
          t.repeat.set(0.05, 0.05);
        });
      }
    );

  const { scale, scaleSm, ...fontProps } = useControls(
    'text',
    {
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
  // useEffect(() => setMaterial(ref.current), Object.keys(props) as any);
  useEffect(
    () => setMaterial(ref.current),
    [aoMap, map, displacementMap, metalnessMap, normalMap, roughnessMap]
  );

  const onPointerEnter = useCallback(() => {
    console.log('e');
    document.body.classList.add('pointer');
  }, []);
  const onPointerLeave = useCallback(() => {
    document.body.classList.remove('pointer');
  }, []);
  const onResumeClick = useCallback(() => {
    window.open('resume-may2023.pdf', 'blank');
  }, []);
  const onContactClick = useCallback(() => {
    location.href = 'mailto:kylednewkirk@gmail.com';
  }, []);

  return (
    <>
      {/* <MeshTransmissionMaterial
        {...(props as any)}
        ref={ref}
      /> */}
      <meshPhysicalMaterial
        aoMap={aoMap}
        map={map}
        displacementMap={displacementMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        displacementScale={0.01}
        ref={ref}
      />
      <group rotation={[0, Math.PI / 10, 0]}>
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
          position={[position[0], position[1] - 0.8, position[2]]}
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
          position={[position[0], position[1] - 1.8, position[2]]}
        >
          <mesh
            onClick={(e) => {
              onClick();
              e.stopPropagation();
            }}
            onPointerMissed={onMissed}
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
          position={[position[0], position[1] - 2.3, position[2]]}
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
        <Center
          scale={scale * scaleSm}
          position={[position[0], position[1] - 3.0, position[2]]}
        >
          <mesh
            onClick={onContactClick}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
          >
            <Text3D
              material={material}
              {...fontProps}
            >
              Contact
            </Text3D>
          </mesh>
        </Center>
      </group>
    </>
  );
};
