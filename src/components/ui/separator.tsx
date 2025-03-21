"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";

import { cn } from "@/lib/utils";

const Separator = ({
  ref,
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentPropsWithRef<typeof SeparatorPrimitive.Root>) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[2px] w-full" : "h-full w-[2px]",
      className,
    )}
    {...props}
  />
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
