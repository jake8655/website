"use client";

import dynamic from "next/dynamic";

const ArrowTitle = dynamic(() => import("@/components/arrow-title"), {
  ssr: false,
});

export default function ArrowTitleWrapper() {
  return (
    <>
      <ArrowTitle className="mt-24 md:mt-0" />
    </>
  );
}
