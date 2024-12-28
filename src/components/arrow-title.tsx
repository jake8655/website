"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useGuiMode } from "./mode-switcher";

export default function ArrowTitle({ className }: { className?: string }) {
  const guiMode = useGuiMode();

  return (
    <div
      className={cn(
        "fade-in slide-in-from-top grid animate-in place-items-center duration-700 ease-out",
        className,
      )}
    >
      {guiMode ? (
        <Title text="My Experience" slideDirection="bottom" key="experience" />
      ) : (
        <Title
          text="Explore me through the terminal"
          slideDirection="top"
          key="explore"
        />
      )}
    </div>
  );
}

function Title({
  text,
  slideDirection,
}: { text: string; slideDirection: "bottom" | "top" }) {
  return (
    <div
      className={cn(
        "group fade-in flex animate-in gap-4 duration-700 ease-out md:gap-12",
        slideDirection === "bottom"
          ? "slide-in-from-bottom-32"
          : "slide-in-from-top-32",
      )}
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
    </div>
  );
}
