import ArrowTitle, { ExperienceTitle } from "@/components/arrow-title";
import RevealOnScroll from "@/components/reveal-on-scroll";
import Experience from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import Wrapper from "@/components/wrapper";

export const metadata = {
  title: "Dominik Tóth • Home",
  description: "Personal website of Dominik Tóth.",
};

export default function Home() {
  return (
    <main className="pt-16 md:pt-32 lg:pt-64">
      <Wrapper>
        <Hero />
      </Wrapper>
      <RevealOnScroll
        className="grid place-items-center"
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
          delay: 0.6,
        }}
      >
        <ArrowTitle
          text="My Experience"
          slideDirection="bottom"
          key="experience"
        />
      </RevealOnScroll>
      <Experience />
      <div className="relative">
        <div className="mt-64 grid place-items-center">
          <ArrowTitle text="My Projects" slideDirection="top" />
        </div>
        <Wrapper>
          <Projects className="mt-32 w-full" />
        </Wrapper>
        <ShootingStars className="-z-10" />
        <StarsBackground className="-z-10" />
      </div>
      <BackgroundBeams className="-z-[1]" />
    </main>
  );
}
