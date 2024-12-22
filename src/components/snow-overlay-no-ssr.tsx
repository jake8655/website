"use client";

import dynamic from "next/dynamic";

const SnowOverlayWrapper = dynamic(() => import("./snow-overlay-wrapper"), {
  ssr: false,
});

export default function SnowOverlayNoSSR() {
  return <SnowOverlayWrapper />;
}
