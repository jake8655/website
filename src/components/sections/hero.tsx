import { cn } from "@/lib/utils";
import Image from "next/image";
import HeroInView from "../hero-in-view";
import Macbook from "../macbook";
import RevealOnScroll from "../reveal-on-scroll";
import { ModalTrigger } from "../ui/animated-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function Hero({ id }: { id?: string }) {
  const date = new Date();
  let age = date.getFullYear() - 2007;
  if (date.getMonth() < 4 || (date.getMonth() === 4 && date.getDate() < 25)) {
    age--;
  }

  return (
    <HeroInView id={id}>
      <RevealOnScroll
        variants={{
          hidden: { x: "-50%", opacity: 0 },
          visible: { x: 0, opacity: 1 },
        }}
      >
        <div className="flex w-fit flex-col gap-4">
          <div className="flex justify-center">
            <WorkButton />
          </div>
          <h1 className="w-fit font-bold text-4xl leading-tight md:text-5xl lg:text-7xl">
            Hi there! I&apos;m <br />
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "relative cursor-default bg-gradient-to-bl from-brand to-blue-600 bg-clip-text text-transparent leading-normal",
                      "before:absolute before:bottom-0 before:h-1 before:w-full before:rounded-full before:bg-gradient-to-bl before:from-brand before:to-blue-600 before:transition-all before:duration-300 before:content-[''] data-[state=closed]:before:w-0",
                    )}
                  >
                    Dominik Tóth
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xl">
                    However, I go by{" "}
                    <span className="bg-gradient-to-bl from-brand to-blue-600 bg-clip-text font-bold text-transparent">
                      Jake
                    </span>{" "}
                    online
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            .
          </h1>
        </div>
        <p className="text-balance pt-6 text-xl leading-normal">
          A {age} year old highschool{" "}
          <span className="text-brand">student</span>,{" "}
          <span className="text-brand">web developer</span>,{" "}
          <span className="text-brand">linux</span> and{" "}
          <span className="text-brand">aviation</span> enthusiast from Slovakia.
          <Image
            src="/images/slovakia-flag.png"
            alt="Slovaki flag"
            className="ml-2 inline-block align-top"
            width={30}
            height={30}
          />
        </p>
      </RevealOnScroll>

      <RevealOnScroll
        outerClassName="h-full min-h-[250px] lg:min-h-0"
        className="h-full"
        variants={{
          hidden: { x: "50%", opacity: 0 },
          visible: { x: 0, opacity: 1 },
        }}
        transition={{ delay: 0.3 }}
        initial="visible"
      >
        <Macbook />
      </RevealOnScroll>
    </HeroInView>
  );
}

function WorkButton() {
  return (
    <ModalTrigger className="group relative inline-block cursor-pointer rounded-full bg-slate-800 p-px font-semibold text-xs leading-6 no-underline shadow-2xl shadow-brand">
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <div className="relative z-10 flex items-center space-x-2 rounded-full bg-brand-darker px-4 py-0.5 ring-1 ring-white/10 ">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
        </span>
        <span>Available for work!</span>
        <svg
          fill="none"
          height="16"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
          className="relative left-0 transition-all duration-200 ease-out group-hover:left-1"
        >
          <path
            d="M10.75 8.75L14.25 12L10.75 15.25"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <span className="-bottom-0 absolute left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-purple-400/0 via-purple-400/90 to-purple-400/0 transition-opacity duration-500 group-hover:opacity-40" />
    </ModalTrigger>
  );
}
