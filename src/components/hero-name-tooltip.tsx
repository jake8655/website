"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function HeroNameTooltip() {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "relative cursor-default bg-linear-to-bl from-brand to-blue-600 bg-clip-text text-transparent leading-normal",
              "before:absolute before:bottom-0 before:h-1 before:w-full before:rounded-full before:bg-linear-to-bl before:from-brand before:to-blue-600 before:transition-all before:duration-300 before:content-[''] data-[state=closed]:before:w-0",
            )}
          >
            Dominik Tóth
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xl">
            However, I go by{" "}
            <span className="bg-linear-to-bl from-brand to-blue-600 bg-clip-text font-bold text-transparent">
              Jake
            </span>{" "}
            online
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
