"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import RevealOnScroll from "./reveal-on-scroll";

export default function ArrowTitle({
  text,
  slideDirection,
  className,
}: { text: string; slideDirection: "bottom" | "top"; className?: string }) {
  return (
    <RevealOnScroll
      className={cn("group flex gap-4 md:gap-12", className)}
      variants={{
        hidden: {
          opacity: 0,
          y: slideDirection === "bottom" ? -128 : 128,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
    >
      <Image
        src="/images/arrow.svg"
        alt="Chevron arrows pointing down"
        width={50}
        height={50}
        loading="eager"
        className="repeat-[2] group-hover:-translate-y-4 animate-bounce duration-500 ease-out"
      />
      <h2 className="text-balance text-center font-semibold text-3xl lg:text-5xl">
        {text}
      </h2>
      <Image
        src="/images/arrow.svg"
        alt="Chevron arrows pointing down"
        width={50}
        height={50}
        loading="eager"
        className="repeat-[2] group-hover:-translate-y-4 animate-bounce duration-500 ease-out"
      />
    </RevealOnScroll>
  );
}
