"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { AnimatePresence, motion } from "motion/react";
import { useActiveIdx } from "@/lib/hooks";
import { cn, navigationSections } from "@/lib/utils";
import { logout } from "@/server/auth/actions";
import { useModal } from "./ui/animated-modal";

export function SignOutButton() {
  return (
    <button
      className="relative transition-colors hover:text-brand"
      role="menuitem"
      onClick={logout}
    >
      Sign out
    </button>
  );
}

export function ContactButton() {
  const { setOpen } = useModal();

  return (
    <button
      className="transition-colors hover:text-brand"
      onClick={() => setOpen(true)}
    >
      Contact
    </button>
  );
}

export function SectionLink({ title, idx }: { title: string; idx: number }) {
  const [activeIdx, setActiveIdx] = useActiveIdx();
  const active = idx === activeIdx;

  const { contextSafe } = useGSAP(() => {
    gsap.registerPlugin(ScrollToPlugin);
  });

  const navigate = contextSafe((idx: number) => {
    gsap.to(window, {
      scrollTo: {
        y: navigationSections[idx]!.hash,
        offsetY: navigationSections[idx]!.offset ?? 0,
      },
      duration: 1,
      ease: "power2.out",
    });
    setActiveIdx(idx);
  });

  return (
    <button
      className={cn("relative transition-colors hover:text-brand", {
        "text-brand": active,
      })}
      onClick={() => navigate(idx)}
      role="menuitem"
      onKeyDown={e => {
        if (e.key === "Enter") {
          navigate(idx);
        }
      }}
    >
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 12 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              ease: "easeInOut",
              duration: 0.4,
              delay: 0.5,
            }}
            className="-translate-x-1/2 absolute bottom-0 left-1/2 h-[6px] w-[6px] rounded-full bg-brand"
          ></motion.div>
        )}
      </AnimatePresence>
      {title}
    </button>
  );
}
