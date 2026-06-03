"use client";

import { Star } from "lucide-react";
import { useModal } from "./ui/animated-modal";

export default function FooterButton() {
  const { setOpen } = useModal();

  return (
    <button
      type="button"
      className="mb-12 h-24 w-full animate-shimmer rounded-full border border-slate-800 bg-[length:200%_100%] bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] px-12 font-bold text-3xl text-slate-400 shadow-[0_10px_14px_0_rgb(0,255,255,39%)] transition hover:shadow-[0_10px_20px_0_rgb(0,255,255,39%)] md:text-6xl"
      onClick={() => setOpen(true)}
    >
      Let's connect!
    </button>
  );
}

export function StarButton() {
  return (
    <a
      href="https://github.com/jake8655/website"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Star jake8655/website on GitHub"
      className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 font-semibold text-sm text-slate-100 transition-colors hover:border-brand hover:text-brand"
    >
      <Star className="size-4" />
      Star
    </a>
  );
}
