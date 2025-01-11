import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function msToTime(time: number) {
  function pad(num: number) {
    return ("00" + num).slice(-2);
  }

  time = (time - (time % 1000)) / 1000;
  const secs = time % 60;
  time = (time - secs) / 60;
  const mins = time % 60;

  return `${pad(mins)}:${pad(secs)}`;
}

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email")
    .max(100, "Email must be 100 characters or less"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be 200 characters or less"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message must be 5000 characters or less"),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
