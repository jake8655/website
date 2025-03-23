"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function LightBlobMouse({ className }: { className?: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn(
        "-translate-x-1/2 -translate-y-1/2 pointer-events-none fixed z-20 h-20 w-20 rounded-full bg-brand blur-[150px]",
        className,
      )}
      style={{
        top: position.y,
        left: position.x,
        transform: "translateZ(0)",
      }}
    />
  );
}
