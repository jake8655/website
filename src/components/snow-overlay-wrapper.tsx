"use client";

import { useReducedMotion } from "motion/react";
import { SnowOverlay } from "react-snow-overlay";

export default function SnowOverlayWrapper() {
  const prefersReducedMotion = useReducedMotion();
  const lowEndDevice = window.navigator.hardwareConcurrency <= 4;

  return (
    <SnowOverlay
      disabled={!!prefersReducedMotion}
      maxParticles={lowEndDevice ? 25 : 50}
      aria-hidden
    />
  );
}
