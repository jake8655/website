import ArrowTitle from "@/components/arrow-title";
import ModeSwitcher, { OnlyCli, OnlyGui } from "@/components/mode-switcher";
import About from "@/components/sections/about";
import Hero from "@/components/sections/hero";
import Terminal from "@/components/terminal";
import { BackgroundBeams } from "@/components/ui/background-beams";
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
        className="fixed top-0 right-0 mt-4 mr-4 hidden xl:flex"
        defaultValue={guiMode ? guiMode.value === "true" : true}
      >
        <main className="px-8 pt-16 md:mx-auto md:max-w-screen-xl md:px-12 md:pt-32 lg:pt-64">
          <Hero />
          <ArrowTitle />
          <OnlyGui>
            <About />
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

  return (
    <Terminal
      serverFiles={serverFiles}
      pageCreationDate={pageCreationDate.toString()}
    />
  );
}
