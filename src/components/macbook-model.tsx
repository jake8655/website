import { useSmallScreen } from "@/lib/hooks";
import { useSpring } from "@react-spring/three";
import { animated } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import React, { type JSX } from "react";
import type * as THREE from "three";
import { type GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Cube008: THREE.Mesh;
    Cube008_1: THREE.Mesh;
    Cube008_2: THREE.Mesh;
    keyboard: THREE.Mesh;
    Cube002: THREE.Mesh;
    Cube002_1: THREE.Mesh;
    touchbar: THREE.Mesh;
    Cube: THREE.Mesh;
  };
  materials: {
    aluminium: THREE.MeshStandardMaterial;
    ["matte.001"]: THREE.MeshStandardMaterial;
    ["screen.001"]: THREE.MeshStandardMaterial;
    keys: THREE.MeshStandardMaterial;
    trackpad: THREE.MeshStandardMaterial;
    touchbar: THREE.MeshStandardMaterial;
    Material: THREE.MeshStandardMaterial;
  };
};

export default function MacbookModel(
  props: JSX.IntrinsicElements["group"] & {
    open: boolean;
  },
) {
  const { nodes, materials } = useGLTF("/macbook.glb") as GLTFResult;
  const spring = useSpring({ open: Number(props.open) });
  const smallScreen = useSmallScreen();

  return (
    <group {...props} dispose={null} scale={smallScreen ? 1.4 : 1}>
      {/* Lid + Screen */}
      {/* @ts-expect-error Bad types */}
      <animated.group
        rotation-x={spring.open.to([0, 1], [1.575, -0.425])}
        position={[0, smallScreen ? -0.04 : 3.46, 0.41]}
      >
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            material={materials.aluminium}
            geometry={nodes["Cube008"]!.geometry}
          />
          <mesh
            material={materials["matte.001"]}
            geometry={nodes["Cube008_1"]!.geometry}
          />
          <mesh
            material={materials["screen.001"]}
            geometry={nodes["Cube008_2"]!.geometry}
          />
        </group>
      </animated.group>

      {/* Keyboard */}
      <mesh
        material={materials.keys}
        geometry={nodes.keyboard!.geometry}
        position={[1.79, smallScreen ? 0 : 3.5, 3.45]}
      />
      {/* Body */}
      <group position={[0, smallScreen ? -0.1 : 3.4, 3.39]}>
        <mesh
          material={materials.aluminium}
          geometry={nodes["Cube002"]!.geometry}
        />
        <mesh
          material={materials.trackpad}
          geometry={nodes["Cube002_1"]!.geometry}
        />
      </group>
      {/* Touchpad */}
      <mesh
        material={materials.touchbar}
        geometry={nodes.touchbar!.geometry}
        position={[0, smallScreen ? -0.03 : 3.47, 1.2]}
      />
    </group>
  );
}

useGLTF.preload("/macbook.glb");
