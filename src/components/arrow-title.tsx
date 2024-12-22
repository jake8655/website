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
      {guiMode ? <GuiTitle /> : <CliTitle />}
    </div>
  );
}

function GuiTitle() {
  return (
    <div className="group fade-in slide-in-from-bottom-32 flex animate-in gap-4 duration-700 ease-out md:gap-12">
      <Image
        src="/images/arrow.svg"
        alt="Chevron arrows pointing down"
        width={50}
        height={50}
        loading="eager"
        className="repeat-[2] group-hover:-translate-y-4 animate-bounce duration-500 ease-out"
      />

      <h2 className="text-balance text-center font-semibold text-3xl lg:text-5xl">
        About me
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

function CliTitle() {
  return (
    <div className="group fade-in slide-in-from-top-32 flex animate-in gap-4 duration-700 ease-out md:gap-12">
      <Image
        src="/images/arrow.svg"
        alt="Chevron arrows pointing down"
        width={50}
        height={50}
        loading="eager"
        className="repeat-[2] group-hover:-translate-y-4 animate-bounce duration-500 ease-out"
      />

      <h2 className="text-balance text-center font-semibold text-3xl lg:text-5xl">
        Explore me through the terminal
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
