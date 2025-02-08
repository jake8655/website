import { cn } from "@/lib/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import ProjectLikes from "../project-likes";
import ProjectsSection from "../projects-section";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

type Project = {
  title: string;
  description: string;
  technologies: { name: string; color: string; href: string }[];
  backgroundColor: string;
  deployedHref?: string;
  sourceHref?: string;
  image: string;
  alt: string;
  id: string;
  imagePosition?: "left" | "bottom";
};

const projects: Project[] = [
  {
    title: "ASR RolePlay",
    description: "Website for a FiveM roleplay server.",
    technologies: [
      {
        name: "TypeScript",
        color: "bg-[#3178c6]",
        href: "https://www.typescriptlang.org",
      },
      { name: "Next.js", color: "bg-black", href: "https://nextjs.org" },
      {
        name: "Auth.js",
        color: "bg-[#bc3cd2]",
        href: "https://authjs.dev",
      },
      {
        name: "tRPC",
        color: "bg-trpc-blue",
        href: "https://trpc.io",
      },
      {
        name: "PostgreSQL",
        color: "bg-[#336791]",
        href: "https://www.postgresql.org",
      },
      {
        name: "Drizzle ORM",
        color: "bg-[#c5f74f]",
        href: "https://orm.drizzle.team/",
      },
    ],
    backgroundColor: "bg-gradient-to-br from-blue-600 to-blue-800",
    deployedHref: "https://asrrp.hu",
    image: "/images/asrrp.png",
    alt: "ASR RolePlay",
    id: "asr-roleplay",
  },
  {
    title: "Access-Bot",
    description:
      "Discord bot for quizzing people about rules before entering the server.",
    technologies: [
      {
        name: "JavaScript",
        color: "bg-[#f7df1e]",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      },
      {
        name: "Discord.js",
        color: "bg-discord-blue",
        href: "https://discord.js.org",
      },
      {
        name: "Node.js",
        color: "bg-[#5fa04e]",
        href: "https://nodejs.org",
      },
    ],
    backgroundColor: "bg-gradient-to-br from-green-600 to-green-800",
    sourceHref: "https://github.com/jake8655/Access-Bot",
    image: "/images/access-bot.png",
    alt: "Access-Bot",
    id: "access-bot",
  },
  {
    title: "Hypoxia",
    description: "RPG game made in 24 hours for Game Jam Nitra 2025.",
    technologies: [
      {
        name: "Godot",
        color: "bg-[#1e5b8a]",
        href: "https://godotengine.org",
      },
    ],
    backgroundColor: "bg-gradient-to-br from-sky-800 to-sky-950",
    sourceHref: "https://github.com/AGoodGuyAdam/GameJam25",
    deployedHref: "https://agoodguyadam.itch.io/hypoxia",
    image: "/images/hypoxia.png",
    alt: "Hypoxia",
    id: "hypoxia",
  },
  {
    title: "Gymgol Simulator",
    description:
      "Game about my school where the goal is to avoid the teachers asking questions.",
    technologies: [
      {
        name: "Python",
        color: "bg-[#3776ab]",
        href: "https://www.python.org",
      },
      {
        name: "Pygame",
        color: "bg-[#10d223]",
        href: "https://www.pygame.org",
      },
    ],
    backgroundColor: "bg-gradient-to-br from-teal-600 to-teal-800",
    sourceHref: "https://github.com/jake8655/gymgol-simulator",
    deployedHref: "https://jake8655.itch.io/gymgol-simulator",
    image: "/images/gymgol-simulator.png",
    imagePosition: "bottom",
    alt: "Gymgol Simulator",
    id: "gymgol-simulator",
  },
  {
    title: "Asteroids",
    description:
      "My first game, where you shoot asteroids using a flying spaceship.",
    technologies: [
      {
        name: "C#",
        color: "bg-[#a08ed8]",
        href: "https://dotnet.microsoft.com/en-us/languages/csharp",
      },
      {
        name: "MonoGame",
        href: "https://www.monogame.net",
        color: "bg-[#e73c00]",
      },
    ],
    backgroundColor: "bg-gradient-to-br from-slate-300 to-slate-400",
    imagePosition: "left",
    sourceHref: "https://github.com/jake8655/asteroids",
    deployedHref: "https://jake8655.itch.io/asteroids",
    image: "/images/asteroids.png",
    alt: "Asteroids Game",
    id: "asteroids",
  },
];

export default function Projects({ className }: { className?: string }) {
  return (
    <ProjectsSection className={cn("pb-[200px]", className)}>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.title}
          title={project.title}
          description={project.description}
          technologies={project.technologies}
          deployedHref={project.deployedHref}
          sourceHref={project.sourceHref}
          image={project.image}
          imagePosition={project.imagePosition}
          alt={project.alt}
          id={project.id}
          last={index === projects.length - 1}
          backgroundColor={project.backgroundColor}
          className="project-card"
        />
      ))}
    </ProjectsSection>
  );
}

function ProjectCard({
  title,
  description,
  technologies,
  deployedHref,
  sourceHref,
  image,
  imagePosition,
  alt,
  id,
  className,
  last,
  backgroundColor,
}: Project & {
  last: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        {
          "mb-[400px] sm:mb-[600px]": !last,
        },
        className,
      )}
      style={{
        transformOrigin: "50% -160%",
      }}
    >
      <a
        className={cn(
          "group block h-[400px] w-full rounded-[38px] p-2 sm:h-[600px] md:rounded-[46px] md:p-4",
          backgroundColor,
        )}
        href={deployedHref ?? sourceHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[30px]">
          <Image
            src={image}
            alt={alt}
            width={1920}
            height={1080}
            className={cn(
              "h-full w-full rounded-[30px] object-cover transition-transform duration-300 group-hover:scale-105",
              {
                "object-left": imagePosition === "left",
                "object-bottom": imagePosition === "bottom",
              },
            )}
          />
        </div>
      </a>
      <div className="project-text flex h-full flex-col gap-2 md:flex-row md:gap-0">
        <div className="flex flex-col items-start gap-2 pl-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xl">{title}</h3>
            {deployedHref || sourceHref ? (
              <Separator orientation="vertical" />
            ) : null}
            {deployedHref && (
              <a
                href={deployedHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand"
              >
                <ExternalLink size={20} />
              </a>
            )}
            {sourceHref && (
              <a
                href={sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand"
              >
                <SiGithub size={20} />
              </a>
            )}
          </div>
          <p>{description}</p>
          <ul className="flex flex-wrap gap-2 text-sm">
            {technologies.map((tech, idx) => (
              <li key={idx}>
                <Badge
                  variant="secondary"
                  className="flex gap-1"
                  href={tech.href}
                >
                  <span className="relative flex h-3 w-3">
                    <span
                      className={cn(
                        "absolute inline-flex h-full w-full rounded-full bg-sky-400",
                        tech.color,
                      )}
                    ></span>
                  </span>
                  {tech.name}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
        <div className="ml-auto flex items-center gap-8 pr-4 font-bold text-lg">
          <ProjectLikes projectId={id} />
        </div>
      </div>
    </div>
  );
}
