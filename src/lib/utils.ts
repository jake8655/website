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
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
