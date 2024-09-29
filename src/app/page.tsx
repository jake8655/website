import ArrowTitle from "@/components/arrow-title";
import About from "@/components/sections/about";
import Hero from "@/components/sections/hero";
import Terminal from "@/components/terminal";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from "next/link";

const pageCreationDate = new Date();

export default function Home() {
  return (
    <main className="px-8 pt-64 md:mx-auto md:max-w-screen-xl md:px-12 md:pt-32">
      <Hero />
      <Link href="/about">about</Link>
      <ArrowTitle title="Explore me through the terminal" />
      <Terminal
        className="hidden xl:block"
        pageCreationDate={pageCreationDate}
      />
      <About className="block xl:hidden" />
      <BackgroundBeams className="-z-[1]" />
    </main>
  );
}
