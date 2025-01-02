"use client";

import { useSmallScreen } from "@/lib/hooks";
import { useReducedMotion } from "motion/react";
import { SnowOverlay } from "react-snow-overlay";

export default function SnowOverlayWrapper() {
  const prefersReducedMotion = useReducedMotion();
  const lowEndDevice = window.navigator.hardwareConcurrency <= 4;
  const isSmallScreen = useSmallScreen(768);
  const isDecember = new Date().getMonth() === 11;

  return (
    <SnowOverlay
      disabled={!isDecember || !!prefersReducedMotion}
      maxParticles={lowEndDevice || isSmallScreen ? 25 : 50}
      aria-hidden
    />
  );
}
