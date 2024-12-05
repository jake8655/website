"use client";

import { cn, useSmallScreen } from "@/lib/utils";
import Image from "next/image";

export default function ArrowTitle({ className }: { className: string }) {
  const smallScreen = useSmallScreen();
  const title = smallScreen ? "About me" : "Explore me through the terminal";

  return (
    <div
      className={cn(
        "fade-in slide-in-from-top grid animate-in place-items-center duration-700 ease-out",
        className,
      )}
    >
      <div className="group flex gap-4 md:gap-12">
        <Image
          src="/images/arrow.svg"
          alt="Chevron arrows pointing down"
          width={50}
          height={50}
          loading="eager"
          className="repeat-[2] group-hover:-translate-y-4 animate-bounce duration-500 ease-out"
        />
        <h2 className="text-balance text-center font-semibold text-3xl lg:text-5xl">
          {title}
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
    </div>
  );
}
