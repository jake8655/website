import ArrowTitle from "@/components/arrow-title-wrapper";
import About from "@/components/sections/about";
import Hero from "@/components/sections/hero";
import Terminal from "@/components/terminal";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Media } from "@/lib/media";
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
      <ArrowTitle />
      <Media lessThan="lg">
        <About />
      </Media>
      <Media greaterThanOrEqual="lg">
        <Terminal
          serverFiles={serverFiles}
          pageCreationDate={pageCreationDate}
        />
      </Media>
      <BackgroundBeams className="-z-[1]" />
    </main>
  );
}
