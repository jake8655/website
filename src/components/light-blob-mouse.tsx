"use client";

import { useEffect, useState } from "react";

export default function LightBlobMouse() {
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
      className="-z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none fixed h-20 w-20 rounded-full bg-brand blur-[150px]"
      style={{
        top: position.y,
        left: position.x,
      }}
    />
  );
}
