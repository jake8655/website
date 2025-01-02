"use client";

import { useSmallScreen } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { setGuiModeCookieAction } from "@/server/sdk/gui-mode";
import { createContext, use, useEffect, useState } from "react";

export const GuiModeContext = createContext(true);

export default function ModeSwitcher({
  className,
  children,
  defaultValue,
}: {
  className?: string;
  defaultValue: boolean;
  children: React.ReactNode;
}) {
  const [guiMode, setGuiMode] = useState(defaultValue);

  const isSmallScreen = useSmallScreen();

  useEffect(() => {
    if (!guiMode && isSmallScreen) {
      setGuiMode(true);
      setGuiModeCookieAction(true);
    }
  }, [guiMode, isSmallScreen, setGuiMode]);

  return (
    <GuiModeContext value={guiMode}>
      <div
        className={cn(
          "fade-in slide-in-from-top-20 z-10 flex animate-in items-center gap-4 duration-700 ease-out",
          className,
        )}
      >
        <span>GUI Mode</span>
        <label className="inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            value=""
            className="peer sr-only"
            name="guiMode"
            onChange={() => {
              setGuiMode(!guiMode);
              setGuiModeCookieAction(!guiMode);
            }}
            checked={!guiMode}
          />
          <div className="peer rtl:peer-checked:after:-translate-x-full relative h-7 w-14 rounded-full border-gray-600 bg-gray-700 after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-slate-200 after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-slate-200"></div>
        </label>
        <span>CLI Mode</span>
      </div>

      {children}
    </GuiModeContext>
  );
}

export function OnlyGui({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  const guiMode = useGuiMode();

  // Only hiding using CSS to not lose state when guiMode changes
  // If the component was unmounted, the state would be lost
  return (
    <div className={cn("hidden", guiMode && "block", className)}>
      {children}
    </div>
  );
}

export function OnlyCli({ children }: { children: React.ReactNode }) {
  const guiMode = useGuiMode();

  // Only hiding using CSS to not lose state when guiMode changes
  // If the component was unmounted, the state would be lost
  return <div className={cn("hidden", !guiMode && "block")}>{children}</div>;
}

export const useGuiMode = () => {
  const guiMode = use(GuiModeContext);

  return guiMode;
};
