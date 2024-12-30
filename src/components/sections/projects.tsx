"use client";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

const projects = [
  {
    title: "Project 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    backgroundColor: "bg-red-600",
  },
  {
    title: "Project 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    backgroundColor: "bg-blue-600",
  },
  {
    title: "Project 3",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    backgroundColor: "bg-green-600",
  },
];

export default function Projects({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement[]>(null);
  const cardTexts = useRef<HTMLDivElement[]>(null);
  const firstCardST = useRef<ScrollTrigger>(null);
  const lastCardST = useRef<ScrollTrigger>(null);

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
          end: () => lastCardST.current!.start + 500,
          pin: true,
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
      {projects.map(project => (
        <ProjectCard
          key={project.title}
          title={project.title}
          description={project.description}
          className={cn("project-card", project.backgroundColor)}
        />
      ))}
    </section>
  );
}

function ProjectCard({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mb-[600px] min-h-[600px] w-full rounded-[30px] shadow-md",
        className,
      )}
      style={{
        transformOrigin: "50% -160%",
      }}
    >
      <div className="project-text relative h-full w-full">
        <h3 className="absolute bottom-0 left-0 translate-y-full pt-4 pl-4 font-bold text-xl">
          {title}
        </h3>
        <p className="absolute right-0 bottom-0 translate-y-full pt-4 pr-4">
          {description}
        </p>
      </div>
    </div>
  );
}
