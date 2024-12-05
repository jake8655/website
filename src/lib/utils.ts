import { type ClassValue, clsx } from "clsx";
import sanitizeHtml from "sanitize-html";
import { twMerge } from "tailwind-merge";
import { BreakPoint, useScreenSize } from "use-screen-size";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUptimeDaysFrom(date: Date) {
  return Math.floor((Date.now() - date.getTime()) / 1000 / 60 / 60 / 24);
}

export function dangerouslySanitizeHtml(
  html: string,
  options?: sanitizeHtml.IOptions,
) {
  return {
    __html: sanitizeHtml(html, {
      allowedTags: ["span"],
      allowedAttributes: {
        span: ["class"],
      },
      ...options,
    }),
  };
}

export function useSmallScreen() {
  const screenSize = useScreenSize();
  const isSmallScreen = (
    [BreakPoint.xs, BreakPoint.s, BreakPoint.m] as string[]
  ).includes(screenSize.screen);

  return isSmallScreen;
}
