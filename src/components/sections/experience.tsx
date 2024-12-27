import { cn } from "@/lib/utils";
import Image from "next/image";
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
          <div className="flex flex-col gap-12">
            <p>
              I started learning web technologies to make NUI-based FiveM
              scripts.
            </p>
            <FocusCards cards={third_point_cards} />
          </div>
        </div>
      ),
    },
    {
      title: "Early 2023",
      content: (
        <div>
          <p className="mb-8 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
            I usually run out of copy, but when I see content this big, I try to
            integrate lorem ipsum.
          </p>
          <p className="mb-8 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="hero template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <Image
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <Image
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <Image
              src="https://assets.aceternity.com/cards.png"
              alt="cards template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Late 2023",
      content: (
        <div>
          <p className="mb-4 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
            Deployed 5 new components on Aceternity today
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
              ✅ Card grid component
            </div>
            <div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
              ✅ Startup template Aceternity
            </div>
            <div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
              ✅ Random file upload lol
            </div>
            <div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
              ✅ Himesh Reshammiya Music CD
            </div>
            <div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
              ✅ Salman Bhai Fan Club registrations open
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="hero template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <Image
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <Image
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <Image
              src="https://assets.aceternity.com/cards.png"
              alt="cards template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      className={cn(
        "fade-in slide-in-from-bottom animate-in duration-700 ease-out",
        className,
      )}
    >
      <Timeline data={data} />
      <p>
        A section below the timeline showcasing my current skills (languages,
        tech...)
        <br />
        Also maybe add description of tech/anything to projects mentioned in
        timeline
        <br />
        also mention asrrp.hu somewhere in timeline?/projects
        <br />
        maybe add links to the projects/servers in the timeline
        <br />
        Mention vim/nvim somewhere
        <br />
        Mention planes/vatsim somewhere (hobbies?) + dogs/animals? (photo?)
        <br />
        Projects section separate from timeline? - in horizontally sliding
        carousel - mention game I made!!!! Asteroids, chat-app (deployment
        doesnt work anymore cuz of heroku, redeploy somewhere), omfgcats?
        (deploy)
        <br />
        About section before experience? - maybe not cuz i say important stuff
        in hero
        <br />
        look through projects/fivem directory on my system for projects n shit
      </p>
    </section>
  );
}
