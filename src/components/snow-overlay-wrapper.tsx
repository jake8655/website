"use client";

import { useReducedMotion } from "motion/react";
import { Snowfall } from "react-snowfall";
import { useSmallScreen } from "@/lib/hooks";

export default function SnowOverlayWrapper() {
  const prefersReducedMotion = useReducedMotion();
  const lowEndDevice = window.navigator.hardwareConcurrency <= 4;
  const isSmallScreen = useSmallScreen(768);
  const isDecember = new Date().getMonth() === 11;

  return isDecember && !prefersReducedMotion ? (
    <div className="pointer-events-none fixed inset-0 z-50">
      <Snowfall
        snowflakeCount={lowEndDevice || isSmallScreen ? 25 : 50}
        aria-hidden
      />
    </div>
  ) : null;
}
