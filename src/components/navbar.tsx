"use client";

import { useActiveIdx } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "./reveal-on-scroll";
import { useModal } from "./ui/animated-modal";
import Wrapper from "./wrapper";

const sections = [
  {
    title: "Home",
    hash: "#home",
  },
  {
    title: "Experience",
    hash: "#experience",
    offset: 100,
  },
  {
    title: "Projects",
    hash: "#projects",
    offset: 260,
  },
];

export default function Navbar() {
  const { setOpen } = useModal();

  const [activeIdx, setActiveIdx] = useActiveIdx();

  const { contextSafe } = useGSAP(() => {
    gsap.registerPlugin(ScrollToPlugin);
  });

  const navigate = contextSafe((idx: number) => {
    gsap.to(window, {
      scrollTo: {
        y: sections[idx]!.hash,
        offsetY: sections[idx]!.offset ?? 0,
      },
      duration: 1,
      ease: "power2.out",
    });
    setActiveIdx(idx);
  });

  return (
    <>
      {/* Empty div to move navbar lower so the sticky positioning triggers later */}
      <div className="h-16 w-full"></div>
      <nav className="nav sticky top-8 z-50">
        <RevealOnScroll
          variants={{
            hidden: {
              opacity: 0,
              y: "-100%",
            },
            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          transition={{
            delay: 0.9,
          }}
          once
        >
          <Wrapper size="sm">
            <ul className="flex items-center justify-between rounded-xl border-2 border-brand px-2 py-3 font-semibold text-sm backdrop-blur-lg md:p-4 md:text-xl md:backdrop-blur">
              <li>
                <Link href="/">
                  <Image
                    src="/images/memoji.png"
                    width={50}
                    height={50}
                    className="h-8 w-8 md:h-12 md:w-12"
                    alt="Dominik Toth"
                  />
                </Link>
              </li>
              {sections.map((section, idx) => (
                <li
                  key={idx}
                  className={cn("mx-2 md:mx-4", {
                    "ml-auto md:ml-auto": idx === 0,
                  })}
                >
                  <SectionLink
                    title={section.title}
                    idx={idx}
                    navigate={navigate}
                    active={idx === activeIdx}
                  />
                </li>
              ))}
              <li className="mx-2 md:mx-4">
                <button
                  className="transition-colors hover:text-brand"
                  onClick={() => setOpen(true)}
                >
                  Contact
                </button>
              </li>
            </ul>
          </Wrapper>
        </RevealOnScroll>
      </nav>
    </>
  );
}

function SectionLink({
  title,
  idx,
  navigate,
  active,
}: {
  title: string;
  idx: number;
  navigate: (idx: number) => void;
  active: boolean;
}) {
  return (
    <button
      className={cn("relative transition-colors hover:text-brand", {
        "text-brand": active,
      })}
      onClick={() => navigate(idx)}
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
