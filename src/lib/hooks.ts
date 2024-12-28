"use client";

import { useEffect, useRef } from "react";
import { useScreen } from "usehooks-ts";

export function useSmallScreen() {
  const screenSize = useScreen();
  const isSmallScreen = !screenSize || screenSize.width < 1280;

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

    timeoutRef.current = setTimeout(() => cb(), timeOut);
  };

  return startTimeout;
}