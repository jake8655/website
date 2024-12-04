import ArrowTitle from "@/components/arrow-title";
import About from "@/components/sections/about";
import Hero from "@/components/sections/hero";
import Terminal from "@/components/terminal";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { api } from "@/trpc/server";

export const metadata = {
  title: "Dominik Tóth • Home",
  description: "Personal website of Dominik Tóth.",
};

export const dynamic = "force-static";

export default async function Home() {
  const serverFiles = await api.fs.getLocalFiles();
  const pageCreationDate = new Date();

  return (
    <main className="px-8 pt-16 md:mx-auto md:max-w-screen-xl md:px-12 md:pt-32 lg:pt-64">
      <Hero />
      <ArrowTitle title="Explore me through the terminal" />
      <Terminal
        pageCreationDate={pageCreationDate}
        serverFiles={serverFiles}
        className="hidden xl:block"
      />
      <About className="block xl:hidden" />
      <BackgroundBeams className="-z-[1]" />
    </main>
  );
}
