import { type ClassValue, clsx } from "clsx";
import sanitizeHtml from "sanitize-html";
import { twMerge } from "tailwind-merge";

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
