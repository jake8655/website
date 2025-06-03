"use client";

import { useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { useActiveIdx } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function HeroInView({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    margin: "-500px 0px 0px 0px",
  });
  const [, setActiveIdx] = useActiveIdx();

  useEffect(() => {
    if (inView) {
      setActiveIdx(0);
    }
  }, [inView, setActiveIdx]);

  return (
    <section
      className={cn(
        "grid grid-cols-1 items-start gap-12 md:min-h-[35rem] md:grid-cols-2 lg:min-h-[45rem]",
        className,
      )}
      id={id}
      ref={ref}
    >
      {children}
    </section>
  );
}
