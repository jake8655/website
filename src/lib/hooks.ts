"use client";

import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import type { Path, UseFormSetValue, UseFromSubscribe } from "react-hook-form";
import { useScreen } from "usehooks-ts";
import { type z } from "zod";

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

export function useSaveForm<T extends z.ZodType>(
  name: string,
  schema: T,
  setValue: UseFormSetValue<z.infer<T>>,
  subscribe: UseFromSubscribe<z.infer<T>>,
) {
  const getStorage = () => window.localStorage.getItem(name);
  const setStorage = (value: string) =>
    window.localStorage.setItem(name, value);
  const clearStorage = () => window.localStorage.removeItem(name);

  useEffect(() => {
    const json = getStorage();
    if (!json) {
      return;
    }

    let values: z.infer<T>;
    try {
      values = schema.parse(JSON.parse(json));
    } catch {
      return clearStorage();
    }

    const keys = Object.keys(values) as Array<keyof z.infer<T>>;

    keys.forEach(key => {
      setValue(key as Path<z.infer<T>>, values[key]);
    });
  }, [name, schema, setValue, getStorage, clearStorage]);

  useEffect(() => {
    const callback = subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        const empty = Object.values(values).every(value => !value);
        if (empty) {
          clearStorage();
          return;
        }

        setStorage(JSON.stringify(values));
      },
    });

    return () => callback();
  }, [subscribe, setStorage, clearStorage]);
}
