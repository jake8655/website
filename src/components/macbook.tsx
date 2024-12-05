"use client";

import { useSmallScreen } from "@/lib/utils";
import { type Interpolation, useSpring } from "@react-spring/core";
import { a as three } from "@react-spring/three";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Macbook() {
  const [open, setOpen] = useState(false);
  const props = useSpring({ open: Number(open) });

  useEffect(() => {
    setTimeout(() => setOpen(true), 2000);
  }, []);

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, -30], fov: 35 }}>
      <pointLight position={[10, 10, 10]} intensity={1.5} color={"#f0f0f0"} />
      <Suspense fallback={null}>
        <group
          rotation={[0, Math.PI, 0]}
          onClick={e => (e.stopPropagation(), setOpen(!open))}
        >
          <Model open={open} hinge={props.open.to([0, 1], [1.575, -0.425])} />
        </group>
        <Environment preset="city" />
      </Suspense>
      <ContactShadows
        position={[0, -4.5, 0]}
        opacity={0.4}
        scale={20}
        blur={1.75}
        far={4.5}
      />
    </Canvas>
  );
}

function Model({
  open,
  hinge,
}: { open: boolean; hinge: Interpolation<number> }) {
  const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
  const { nodes, materials } = useGLTF("/macbook.glb");
  const [hovered, setHovered] = useState(false);
  const smallScreen = useSmallScreen();

  useEffect(
    () => void (document.body.style.cursor = hovered ? "pointer" : "auto"),
    [hovered],
  );

  // Make it float in the air when it's opened
  useFrame(state => {
    if (!group.current) return;

    const t = state.clock.getElapsedTime();
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      open ? Math.cos(t / 10) / 10 + 0.25 : 0,
      0.1,
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      open ? Math.sin(t / 10) / 4 : 0,
      0.1,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      open ? Math.sin(t / 10) / 10 : 0,
      0.1,
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      open ? (-2 + Math.sin(t)) / 3 : -4.3,
      0.1,
    );
  });

  return (
    <group
      ref={group}
      onPointerOver={e => (e.stopPropagation(), setHovered(true))}
      onPointerOut={_ => setHovered(false)}
      dispose={null}
      scale={smallScreen ? 1.4 : 1}
    >
      {/* Lid + Screen */}
      {/* @ts-expect-error Bad types */}
      <three.group
        rotation-x={hinge}
        position={[0, smallScreen ? -0.04 : 3.46, 0.41]}
      >
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            material={materials.aluminium}
            // @ts-expect-error Bad types
            geometry={nodes["Cube008"]!.geometry}
          />
          <mesh
            material={materials["matte.001"]}
            // @ts-expect-error Bad types
            geometry={nodes["Cube008_1"]!.geometry}
          />
          <mesh
            material={materials["screen.001"]}
            // @ts-expect-error Bad types
            geometry={nodes["Cube008_2"]!.geometry}
          />
        </group>
        {/* @ts-expect-error Bad types */}
      </three.group>

      {/* Keyboard */}
      <mesh
        material={materials.keys}
        // @ts-expect-error Bad types
        geometry={nodes.keyboard!.geometry}
        position={[1.79, smallScreen ? 0 : 3.5, 3.45]}
      />
      {/* Body */}
      <group position={[0, smallScreen ? -0.1 : 3.4, 3.39]}>
        <mesh
          material={materials.aluminium}
          // @ts-expect-error Bad types
          geometry={nodes["Cube002"]!.geometry}
        />
        <mesh
          material={materials.trackpad}
          // @ts-expect-error Bad types
          geometry={nodes["Cube002_1"]!.geometry}
        />
      </group>
      {/* Touchpad */}
      <mesh
        material={materials.touchbar}
        // @ts-expect-error Bad types
        geometry={nodes.touchbar!.geometry}
        position={[0, smallScreen ? -0.03 : 3.47, 1.2]}
      />
    </group>
  );
}
