import { type ClassValue, clsx } from "clsx";
import sanitizeHtml from "sanitize-html";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export async function getDifferenceBetweenDates(date1: Date, date2: Date) {
  const diff = Math.floor(
    Math.abs(new Date(date2).getTime() - new Date(date1).getTime()) /
      1000 /
      60 /
      60 /
      24,
  );

  return diff;
}
