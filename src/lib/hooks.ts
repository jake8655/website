"use client";

import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { useScreen } from "usehooks-ts";

export function useSmallScreen(width: number = 1280) {
  const screenSize = useScreen();
  const isSmallScreen = !screenSize || screenSize.width < width;

  return isSmallScreen;
}

export function useDebouncedCallback(
  cb: (...args: unknown[]) => unknown,
  timeOut: number,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timeoutId = timeoutRef.current;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const startTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(cb, timeOut);
  };

  return startTimeout;
}

const activeIdx = atom(0);
export function useActiveIdx() {
  const [idx, setIdx] = useAtom(activeIdx);
  return [idx, setIdx] as const;
}
