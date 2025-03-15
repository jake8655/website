"use client";

import { ContactShadows, Environment, Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import MacbookModel from "./macbook-model";

export default function Macbook() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setOpen(true), 2000);
  }, []);

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, -30], fov: 35 }}>
      <pointLight position={[10, 10, 10]} intensity={1.5} color={"#f0f0f0"} />
      <group
        rotation={[0, Math.PI, 0]}
        onClick={e => (e.stopPropagation(), setOpen(!open))}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="md:-top-16 relative h-32 w-32 animate-ping rounded-full border-2 border-gray-700 md:h-52 md:w-52" />
            </Html>
          }
        >
          <Model open={open} />
          <Environment preset="city" />
        </Suspense>
      </group>
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

function Model({ open }: { open: boolean }) {
  const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
  const [hovered, setHovered] = useState(false);

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
    <MacbookModel
      open={open}
      ref={group}
      onPointerOver={e => (e.stopPropagation(), setHovered(true))}
      onPointerOut={_ => setHovered(false)}
      dispose={null}
    />
  );
}
