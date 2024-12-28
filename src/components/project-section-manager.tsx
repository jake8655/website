"use client";

import { useDebouncedCallback } from "@/lib/hooks";
import { AnimatePresence, type MotionProps, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const sections = [
  {
    background: "#FF6B6B",
    content: "Welcome to Our Website",
    subContent: "Scroll down to explore more",
  },
  {
    background: "#4ECDC4",
    content: "Our Services",
    subContent: "We offer a wide range of solutions",
  },
  {
    background: "#45B7D1",
    content: "About Us",
    subContent: "Learn about our company and values",
  },
  {
    background: "#F7DC6F",
    content: "Contact Us",
    subContent: "Get in touch with our team",
  },
];

const variants = {
  enter: (direction: number) => {
    return {
      y: direction > 0 ? 1000 : -1000,
    };
  },
  center: {
    zIndex: 1,
    y: 0,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      y: direction < 0 ? 1000 : -1000,
    };
  },
};

const usePaginateScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  paginate: (newDirection: number) => void,
  page: number,
  maxPage: number,
) => {
  // TODO: Make this 2 scroll occurrences
  const SCROLL_THRESHOLD = 700;
  const [scrollAccumulator, setScrollAccumulator] = useState(0);
  const startResetAccumulatorTimeout = useDebouncedCallback(
    () => setScrollAccumulator(0),
    1000,
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      startResetAccumulatorTimeout();

      setScrollAccumulator(prev => prev + e.deltaY);

      if (Math.abs(scrollAccumulator) >= SCROLL_THRESHOLD) {
        const newDirection = scrollAccumulator > 0 ? 1 : -1;
        setScrollAccumulator(0);

        if (page + newDirection < maxPage && page + newDirection >= 0) {
          paginate(newDirection);
        }
      }
    },
    [paginate, page, maxPage, startResetAccumulatorTimeout, scrollAccumulator],
  );

  useEffect(() => {
    const { current } = containerRef;
    if (!current) return;

    if (current) {
      current.addEventListener("wheel", handleWheel);
    }

    return () => {
      current.removeEventListener("wheel", handleWheel);
    };
  }, [containerRef, paginate, handleWheel]);

  return (Math.abs(scrollAccumulator) / SCROLL_THRESHOLD) * 100;
};

export default function ProjectSectionManager() {
  const [[page, direction], setPage] = useState([0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const scrollPercentage = usePaginateScroll(
    containerRef,
    paginate,
    page,
    sections.length,
  );

  return (
    <div className="relative h-screen" ref={containerRef}>
      <SectionButton
        paginate={paginate}
        page={page}
        maxPage={sections.length}
        scrollPercentage={scrollPercentage}
      />
      <AnimatePresence initial={false} custom={direction}>
        <Section
          key={page}
          background={sections[page]!.background}
          content={sections[page]!.content}
          subContent={sections[page]!.subContent}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", damping: 15 },
          }}
        />
      </AnimatePresence>
    </div>
  );
}

interface SectionProps extends MotionProps {
  background: string;
  content: string;
  subContent: string;
}

function Section({
  background,
  content,
  subContent,
  ...motionProps
}: SectionProps) {
  return (
    <motion.div
      className="absolute h-full w-full text-center"
      style={{
        background,
      }}
      {...motionProps}
    >
      <h2 className="mb-4 font-bold text-4xl text-black">{content}</h2>
      <p className="text-black text-xl">{subContent}</p>
    </motion.div>
  );
}

function SectionButton({
  paginate,
  page,
  maxPage,
  scrollPercentage,
}: {
  paginate: (newDirection: number) => void;
  page: number;
  maxPage: number;
  scrollPercentage: number;
}) {
  return (
    <>
      <button
        className="absolute right-0 bottom-0 z-10 cursor-pointer text-3xl text-black"
        onClick={() => paginate(1)}
        disabled={page === maxPage - 1}
      >
        Next
      </button>
      <div
        className="-translate-y-1/2 absolute top-1/2 right-0 z-10 mr-4 w-10 bg-black"
        style={{ height: `${(300 * scrollPercentage) / 100}px` }}
      ></div>
      <button
        className="absolute right-0 z-10 cursor-pointer text-3xl text-black"
        onClick={() => paginate(-1)}
        disabled={page === 0}
      >
        Previous
      </button>
    </>
  );
}
