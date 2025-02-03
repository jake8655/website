"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

type ContainerProps = {
  href?: string;
  children: React.ReactNode;
  [x: string]: unknown;
};

const Container = ({ href, children, ...props }: ContainerProps) => {
  return (
    <>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      ) : (
        <div {...props}>{children}</div>
      )}
    </>
  );
};

export const Card = ({
  card,
  index,
  hovered,
  setHoveredAction,
}: {
  card: Card;
  index: number;
  hovered: number | null;
  setHoveredAction: React.Dispatch<number | null>;
}) => {
  return (
    <Container
      href={card.href}
      onMouseEnter={() => setHoveredAction(index)}
      onMouseLeave={() => setHoveredAction(null)}
      className={cn(
        "relative block h-60 w-full overflow-hidden rounded-lg transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "scale-[0.98] blur-sm",
      )}
    >
      <Image
        src={card.src}
        alt={card.alt}
        width={500}
        height={500}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <div
        className={cn(
          "absolute inset-0 flex items-end bg-black/50 px-4 py-8 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-lg text-transparent md:text-xl">
          {card.text.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>
    </Container>
  );
};

Card.displayName = "Card";

export type Card = {
  text: string;
  src: string;
  alt: string;
  href?: string;
};

export function FocusCards({
  cards,
  className,
}: { cards: Card[]; className?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      {cards.map((card, index) => (
        <Card
          key={card.text}
          card={card}
          index={index}
          hovered={hovered}
          setHoveredAction={setHovered}
        />
      ))}
    </div>
  );
}
