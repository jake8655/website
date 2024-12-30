import { cn } from "@/lib/utils";
import RevealOnScroll from "../reveal-on-scroll";
import { type Card, FocusCards } from "../ui/focus-cards";
import { Timeline } from "../ui/timeline";

export default function Experience({ className }: { className?: string }) {
  const first_point_cards: Card[] = [
    {
      text: "Dark Moon RolePlay",
      src: "/images/dmrp.png",
      alt: "Dark Moon RolePlay logo",
    },
    {
      text: "This was my own server that I was developing for a while with a couple players.",
      src: "/images/dmrp-2.png",
      alt: "GTA gang members",
    },
    {
      text: "Smoke Life RolePlay",
      src: "/images/slrp.png",
      alt: "Smoke Life RolePlay logo",
    },
    {
      text: "I was a part-time Developer and Community Manager for this server.\nIt had ~60 daily active players.",
      src: "/images/slrp-2.png",
      alt: "GTA cop on ambulance",
    },
  ];

  const third_point_cards: Card[] = [
    {
      text: "Fivem Notify script",
      src: "/images/fivem-notify.png",
      alt: "Fivem Notify script",
      href: "https://github.com/jake8655/notify",
    },
    {
      text: "Fivem Hud script",
      src: "/images/fivem-hud.png",
      alt: "Fivem Hud script",
      href: "https://github.com/jake8655/fivem-hud",
    },
    {
      text: "One of (if not) my first HTML projects. It's just a random little site for tinkering and learning the basics. Inspiration from a friend",
      src: "/images/omfg-cats.png",
      alt: "OMFG Cats",
      href: "https://github.com/jake8655/OmfgCats",
    },
  ];

  const fourth_point_cards: Card[] = [
    {
      text: "Some problems I've had time to and have been able to solve from AOC",
      src: "/images/aoc.png",
      alt: "Advent of Code Calendar",
      href: "https://github.com/jake8655/aoc-rust",
    },
    {
      text: "Suggestion requests, bug reports, music bot written in rust btw",
      src: "/images/slrp-bot.png",
      alt: "Discord bot Embed",
      href: "https://github.com/jake8655/slhungary-bot",
    },
    {
      text: "School project about linear data structures",
      src: "/images/linear-data-structures.png",
      alt: "Linearne struktury",
      href: "https://github.com/jake8655/project",
    },
  ];

  const data = [
    {
      title: "2020",
      content: (
        <div>
          <h4 className="mb-8 font-normal text-neutral-200 text-sm md:text-lg">
            <b>FiveM RolePlay Servers</b> - The start of my programming journey
          </h4>
          <FocusCards cards={first_point_cards} />
        </div>
      ),
    },
    {
      title: "2021",
      content: (
        <div>
          <h4 className="mb-8 font-bold text-neutral-200 text-sm md:text-lg">
            FiveM Script Shop
          </h4>
          <p>
            I was selling my FiveM scripts made from scratch to server owners on
            Discord.
          </p>
          <br />
          <p>
            I had some scripts I pre-made, but the majority had exact
            specifications given at order time.
          </p>
        </div>
      ),
    },
    {
      title: "2022-2023",
      content: (
        <div>
          <h4 className="mb-8 font-bold text-neutral-200 text-sm md:text-lg">
            Intro to Web Development
          </h4>
          <p>
            I started learning web technologies to make NUI-based FiveM scripts.
          </p>
          <FocusCards cards={third_point_cards} className="mt-8" />
        </div>
      ),
    },
    {
      title: "2024",
      content: (
        <div>
          <h4 className="mb-8 font-bold text-neutral-200 text-sm md:text-lg">
            Stable growth
          </h4>
          <p>I started contributing to open source projects that I use.</p>
          <br />
          <p>
            Participated in a lot of programming related school competitions.
          </p>
          <br />
          <p>
            Explored the Rust programming language a little bit. I built some
            basic codecrafters projects and a Discord bot using Rust.
          </p>
          <FocusCards cards={fourth_point_cards} className="mt-8" />
        </div>
      ),
    },
  ];

  return (
    <RevealOnScroll
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
      }}
      once
    >
      <Timeline data={data} />
    </RevealOnScroll>
  );
}
