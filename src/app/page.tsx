import ArrowTitle, { ExperienceTitle } from "@/components/arrow-title";
import ModeSwitcher, { OnlyCli, OnlyGui } from "@/components/mode-switcher";
import Experience from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import Terminal from "@/components/terminal";
import { BackgroundBeams } from "@/components/ui/background-beams";
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
        <main className="px-8 pt-16 md:mx-auto md:max-w-screen-xl md:px-12 md:pt-32 lg:pt-64">
          <Hero />
          <ExperienceTitle />
          <OnlyGui>
            <Experience />
            <div className="mt-64 grid place-items-center">
              <ArrowTitle text="My Projects" slideDirection="top" />
            </div>
            <Projects className="mt-32 h-[400vh] w-full" />
          </OnlyGui>
          <OnlyCli>
            <TerminalWithData />
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
  const uptimeDays = getDifferenceBetweenDates(pageCreationDate, currentDate);

  return <Terminal serverFiles={serverFiles} uptimeDays={uptimeDays} />;
}
