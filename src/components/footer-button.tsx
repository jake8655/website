"use client";

import GitHubButton from "react-github-btn";
import { useModal } from "./ui/animated-modal";

export default function FooterButton() {
  const { setOpen } = useModal();

  return (
    <button
      className="mb-12 h-24 w-full animate-shimmer rounded-full border border-slate-800 bg-[length:200%_100%] bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] px-12 font-bold text-3xl text-slate-400 shadow-[0_10px_14px_0_rgb(0,255,255,39%)] transition hover:shadow-[0_10px_20px_0_rgb(0,255,255,39%)] md:text-6xl"
      onClick={() => setOpen(true)}
    >
      Let's connect!
    </button>
  );
}

export function StarButton() {
  return (
    <GitHubButton
      href="https://github.com/jake8655/website"
      data-icon="octicon-star"
      data-size="large"
      data-show-count="true"
      aria-label="Star jake8655/website on GitHub"
      data-color-scheme="dark"
    >
      Star
    </GitHubButton>
  );
}
