import { SiGithub } from "@icons-pack/react-simple-icons";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
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
  imagePosition?: "top" | "bottom" | "left" | "right";
};

const projects: Project[] = [
  {
    title: "ASR RolePlay Website",
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
    backgroundColor: "bg-linear-to-br from-blue-600 to-blue-800",
    deployedHref: "https://asrrp.vercel.app",
    image: "/images/asrrp_website.png",
    alt: "ASR RolePlay Website",
    id: "asr-roleplay-website",
  },
  {
    title: "ASR RolePlay Dashboard",
    description: "Player dashboard script for a FiveM roleplay server.",
    technologies: [
      {
        name: "Lua",
        href: "https://www.lua.org",
        color: "bg-[#040376]",
      },
      {
        name: "MySQL",
        color: "bg-[#036b84]",
        href: "https://www.mysql.com",
      },
      {
        name: "TypeScript",
        color: "bg-[#3178c6]",
        href: "https://www.typescriptlang.org",
      },
      {
        name: "React.js",
        color: "bg-[#5cc9e7]",
        href: "https://react.dev",
      },
      {
        name: "React Router",
        color: "bg-[#e23f4d]",
        href: "https://reactrouter.com",
      },
      {
        name: "Motion",
        color: "bg-[#e2d82e]",
        href: "https://motion.dev",
      },
      {
        name: "Tanstack Query",
        color: "bg-[#2361d7]",
        href: "https://tanstack.com/query",
      },
      {
        name: "Tanstack Table",
        color: "bg-[#df8e10]",
        href: "https://tanstack.com/table",
      },
    ],
    backgroundColor: "bg-linear-to-br from-slate-300 to-slate-400",
    deployedHref: "https://discord.gg/4jVGE6tFhA",
    image: "/images/asrrp_dashboard.png",
    alt: "ASR RolePlay Dashboard",
    id: "asr-roleplay-dashboard",
  },
  {
    title: "Nyaverlose Website",
    description: "Website for a Minecraft client.",
    technologies: [
      {
        name: "TypeScript",
        color: "bg-[#3178c6]",
        href: "https://www.typescriptlang.org",
      },
      { name: "Next.js", color: "bg-black", href: "https://nextjs.org" },
      {
        name: "Tanstack Query",
        color: "bg-[#2361d7]",
        href: "https://tanstack.com/query",
      },
      {
        name: "tRPC",
        color: "bg-trpc-blue",
        href: "https://trpc.io",
      },
      {
        name: "Motion",
        color: "bg-[#e2d82e]",
        href: "https://motion.dev",
      },
    ],
    backgroundColor: "bg-linear-to-br from-[#febdc7] to-[#a86d77]",
    deployedHref: "https://www.nyaverlose.cc",
    image: "/images/nyaverlose.png",
    imagePosition: "top",
    alt: "Nyaverlose Website",
    id: "nyaverlose-website",
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
    backgroundColor: "bg-linear-to-br from-green-600 to-green-800",
    sourceHref: "https://github.com/jake8655/Access-Bot",
    image: "/images/access-bot.png",
    imagePosition: "top",
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
    backgroundColor: "bg-linear-to-br from-sky-800 to-sky-950",
    sourceHref: "https://github.com/AGoodGuyAdam/GameJam25",
    deployedHref: "https://agoodguyadam.itch.io/hypoxia",
    image: "/images/hypoxia.png",
    imagePosition: "bottom",
    alt: "Hypoxia",
    id: "hypoxia",
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
                "object-top": imagePosition === "top",
                "object-bottom": imagePosition === "bottom",
                "object-left": imagePosition === "left",
                "object-right": imagePosition === "right",
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
