"use client";

import { useSmallScreen } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import {
  type Transition,
  type Variant,
  motion,
  useAnimation,
  useInView,
} from "motion/react";
import { useEffect, useRef } from "react";

export default function RevealOnScroll({
  children,
  variants,
  transition,
  initial,
  once,
  className,
  outerClassName,
  id,
}: {
  children: React.ReactNode;
  variants: { hidden: Variant; visible: Variant };
  transition?: Transition;
  initial?: "hidden" | "visible";
  once?: boolean;
  className?: string;
  outerClassName?: string;
  id?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInview = useInView(containerRef);
  const isSmallScreen = useSmallScreen(768);

  const mainControls = useAnimation();

  useEffect(() => {
    if (isSmallScreen) return;

    if (isInview) mainControls.start("visible");

    if (once) return;
    if (!isInview) mainControls.start("hidden");
  }, [isInview, mainControls, isSmallScreen, once]);

  return (
    <div ref={containerRef} className={cn(outerClassName)}>
      <motion.div
        variants={variants}
        initial={isSmallScreen ? "visible" : initial || "hidden"}
        animate={mainControls}
        className={cn(className)}
        id={id}
        transition={{
          duration: 0.7,
          ease: "easeOut",
          ...transition,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
