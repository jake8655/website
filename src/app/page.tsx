import ArrowTitle, { ExperienceTitle } from "@/components/arrow-title";
import ModeSwitcher, { OnlyCli, OnlyGui } from "@/components/mode-switcher";
import Experience from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Terminal from "@/components/terminal";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import Wrapper from "@/components/wrapper";
import { getDifferenceBetweenDates } from "@/lib/utils";
import { getLocalFiles } from "@/server/sdk/fs";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

export const metadata = {
  title: "Dominik Tóth • Home",
  description: "Personal website of Dominik Tóth.",
};

export default async function Home() {
  const cookieStore = await cookies();
  const guiMode = cookieStore.get("guiMode");

  return (
    <>
      <ModeSwitcher
        className="absolute top-0 right-0 mt-4 mr-4 hidden xl:flex"
        defaultValue={guiMode ? guiMode.value === "true" : true}
      >
        <main className="pt-16 md:pt-32 lg:pt-64">
          <Wrapper>
            <Hero />
          </Wrapper>
          <ExperienceTitle />
          <OnlyGui>
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
          </OnlyGui>
          <OnlyCli>
            <Wrapper>
              <TerminalWithData />
            </Wrapper>
          </OnlyCli>
          <BackgroundBeams className="-z-[1]" />
        </main>
      </ModeSwitcher>
    </>
  );
}

// Compiler hack to cache the date
const getCachedDate = unstable_cache(async () => new Date());

async function TerminalWithData() {
  const serverFiles = await getLocalFiles();
  const pageCreationDate = await getCachedDate();
  const currentDate = new Date();
  const uptimeDays = await getDifferenceBetweenDates(
    pageCreationDate,
    currentDate,
  );

  return <Terminal serverFiles={serverFiles} uptimeDays={uptimeDays} />;
}
