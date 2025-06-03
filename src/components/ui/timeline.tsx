"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { useActiveIdx } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({
  data,
  className,
}: {
  data: TimelineEntry[];
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [, setActiveIdx] = useActiveIdx();
  const inView = useInView(ref, {
    margin: "-500px 0px -445px 0px",
  });

  useEffect(() => {
    if (inView) {
      setActiveIdx(1);
    }
  }, [inView, setActiveIdx]);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className={cn("w-full font-sans lg:px-10", className)}
      ref={containerRef}
    >
      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 lg:gap-10 lg:pt-40"
          >
            <div className="sticky top-40 z-30 flex max-w-xs flex-col items-center self-start lg:w-full lg:max-w-sm lg:flex-row">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-black lg:left-3">
                <div className="h-4 w-4 rounded-full border border-neutral-700 bg-neutral-800 p-2" />
              </div>
              <h3 className="hidden font-bold text-xl lg:block lg:pl-20 lg:text-5xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pr-4 pl-20 lg:pl-4">
              <h3 className="mb-4 block text-left font-bold text-2xl lg:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute top-0 left-8 w-[2px] overflow-hidden bg-gradient-to-b from-0% from-transparent via-neutral-700 to-99% to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] lg:left-8 "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-linear-to-t from-0% from-gradient-green via-10% via-brand-dark to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
