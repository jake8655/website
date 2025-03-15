"use client";

import { useActiveIdx } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useInView } from "motion/react";
import { useEffect, useRef } from "react";

export default function ProjectsSection({
  className,
  children,
}: { className?: string; children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement[]>(null);
  const cardTexts = useRef<HTMLDivElement[]>(null);
  const firstCardST = useRef<ScrollTrigger>(null);
  const lastCardST = useRef<ScrollTrigger>(null);

  const [activeIdx, setActiveIdx] = useActiveIdx();
  const inView = useInView(containerRef, {
    margin: "0px 0px -500px 0px",
  });

  useEffect(() => {
    if (inView && activeIdx !== 2) {
      setActiveIdx(2);
    }
  }, [inView, setActiveIdx, activeIdx]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      cards.current = gsap.utils.toArray<HTMLDivElement>(".project-card");
      cardTexts.current = gsap.utils.toArray<HTMLDivElement>(".project-text");
      firstCardST.current = ScrollTrigger.create({
        trigger: cards.current[0],
        start: "center center",
      });
      lastCardST.current = ScrollTrigger.create({
        trigger: cards.current[cards.current.length - 1],
        start: "center center",
      });

      cards.current.forEach((card, index) => {
        const scale = 1 - (cards.current!.length - index) * 0.025;

        const scaleDown = gsap.to(card, {
          scale: scale,
          transformOrigin: `"50% ${lastCardST.current!.start}"`,
        });

        ScrollTrigger.create({
          trigger: card,
          start: "center center",
          end: () => lastCardST.current!.start + 20,
          pin: true,
          scrub: true,
          pinSpacing: false,
          animation: scaleDown,
          toggleActions: "restart none none reverse",
        });

        const nextCard = cards.current![index + 1];
        if (!nextCard) return;

        gsap.to(cardTexts.current![index]!, {
          scrollTrigger: {
            trigger: nextCard,
            start: "top bottom",
            end: "top center",
            scrub: true,
            toggleActions: "restart none none reverse",
          },
          opacity: 0,
          filter: "blur(10px)",
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <section className={cn(className)} ref={containerRef}>
      {children}
    </section>
  );
}
