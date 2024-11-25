import ArrowTitle from "@/components/arrow-title";
import About from "@/components/sections/about";
import Hero from "@/components/sections/hero";
import Terminal from "@/components/terminal";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { api } from "@/trpc/server";
import Link from "next/link";

export const metadata = {
  title: "Dominik Tóth • Home",
  description: "Personal website of Dominik Tóth.",
};

export const dynamic = "force-static";

export default async function Home() {
  const serverFiles = await api.fs.getLocalFiles();
  const pageCreationDate = new Date();

  return (
    <main className="px-8 pt-64 md:mx-auto md:max-w-screen-xl md:px-12 md:pt-32">
      <Hero />
      <Link href="/about">about</Link>
      <ArrowTitle title="Explore me through the terminal" />
      <Terminal
        className="hidden xl:block"
        pageCreationDate={pageCreationDate}
        serverFiles={serverFiles}
      />
      <About className="block xl:hidden" />
      <BackgroundBeams className="-z-[1]" />
    </main>
  );
}
