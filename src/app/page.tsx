import ArrowTitle from "@/components/arrow-title";
import CustomErrorToast from "@/components/custom-error-toast";
import Navbar from "@/components/navbar";
import RevealOnScroll from "@/components/reveal-on-scroll";
import Experience from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import Wrapper from "@/components/wrapper";
import { cookies } from "next/headers";

export const metadata = {
  title: "Dominik Tóth",
  description: "Personal website of Dominik Tóth.",
};

export default async function Home() {
  const cookieStore = await cookies();
  const error = cookieStore.get("custom_error")?.value;

  return (
    <>
      <div id="home" className="relative z-10">
        <div
          id="background"
          className="-z-20 absolute min-h-full w-full rounded-b-[100px]"
        ></div>
        <CustomErrorToast error={error} />
        <div className="-z-[1] absolute h-screen w-full">
          <div className="relative h-full w-full">
            <BackgroundBeams />
          </div>
        </div>
        <Navbar />
        <Wrapper>
          <Hero className="pt-16 md:pt-32 lg:pt-48" />
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
            id="experience"
          />
        </RevealOnScroll>
        <Experience />
        <div className="relative">
          <div className="mt-64 grid place-items-center">
            <ArrowTitle text="My Projects" slideDirection="top" id="projects" />
          </div>
          <Wrapper>
            <Projects className="mt-32 w-full" />
          </Wrapper>
          <ShootingStars className="-z-10" />
          <StarsBackground className="-z-10" />
        </div>
      </div>
    </>
  );
}
