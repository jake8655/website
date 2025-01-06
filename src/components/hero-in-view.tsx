"use client";

import { useActiveIdx } from "@/lib/hooks";
import { useInView } from "motion/react";
import { useEffect, useRef } from "react";

export default function HeroInView({
  children,
  id,
}: { children: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    margin: "-500px 0px 0px 0px",
  });
  const [, setActiveIdx] = useActiveIdx();

  useEffect(() => {
    console.log(inView);
    if (inView) {
      setActiveIdx(0);
    }
  }, [inView, setActiveIdx]);

  return (
    <section
      className="grid grid-cols-1 items-start gap-12 md:min-h-[35rem] md:grid-cols-2"
      id={id}
      ref={ref}
    >
      {children}
    </section>
  );
}
