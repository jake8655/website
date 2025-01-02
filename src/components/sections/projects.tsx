import { cn } from "@/lib/utils";
import { HydrateClient, api } from "@/trpc/server";
import Image from "next/image";
import ProjectLikes from "../project-likes";
import ProjectsSection from "../projects-section";

const projects = [
  {
    title: "ASR RolePlay",
    backgroundColor: "bg-gradient-to-br from-blue-600 to-blue-800",
    href: "https://asrrp.hu",
    image: "/images/asrrp.png",
    alt: "ASR RolePlay",
    id: "asr-roleplay",
  },
  {
    title: "Access-Bot",
    backgroundColor: "bg-gradient-to-br from-green-600 to-green-800",
    href: "https://github.com/jake8655/Access-Bot",
    image: "/images/access-bot.png",
    alt: "Access-Bot",
    id: "access-bot",
  },
  {
    title: "Tic-Tac-Toe Game & Bot",
    backgroundColor: "bg-gradient-to-br from-red-600 to-red-800",
    href: "https://github.com/jake8655/tkinter-app",
    image: "/images/tic-tac-toe.png",
    alt: "Tic-Tac-Toe Game & Bot",
    id: "tic-tac-toe",
  },
  {
    title: "Gymgol Simulator",
    backgroundColor: "bg-gradient-to-br from-teal-600 to-teal-800",
    href: "https://github.com/jake8655/gymgol-simulator",
    image: "/images/gymgol-simulator.png",
    imagePosition: "bottom" as const,
    alt: "Gymgol Simulator",
    id: "gymgol-simulator",
  },
  {
    title: "Asteroids",
    backgroundColor: "bg-gradient-to-br from-slate-300 to-slate-400",
    imagePosition: "left" as const,
    href: "https://github.com/jake8655/asteroids",
    image: "/images/asteroids.png",
    alt: "Asteroids Game",
    id: "asteroids",
  },
];

export default function Projects({ className }: { className?: string }) {
  return (
    <ProjectsSection className={className}>
      {projects.map(project => (
        <ProjectCard
          key={project.title}
          title={project.title}
          href={project.href}
          image={project.image}
          imagePosition={project.imagePosition}
          alt={project.alt}
          id={project.id}
          backGroundColor={project.backgroundColor}
          className="project-card"
        />
      ))}
    </ProjectsSection>
  );
}

async function ProjectCard({
  title,
  href,
  image,
  imagePosition,
  alt,
  id,
  className,
  backGroundColor,
}: {
  title: string;
  href: string;
  image: string;
  imagePosition?: "left" | "bottom";
  alt: string;
  id: string;
  className?: string;
  backGroundColor: string;
}) {
  await api.projectLike.getProjectLikeCount.prefetch({ projectId: id });

  return (
    <HydrateClient>
      <div
        className={cn("mb-[600px] flex flex-col gap-4", className)}
        style={{
          transformOrigin: "50% -160%",
        }}
      >
        <a
          className={cn(
            "group block min-h-[400px] w-full rounded-[46px] p-4 sm:min-h-[600px]",
            backGroundColor,
          )}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="relative h-full w-full overflow-hidden rounded-[30px]">
            <Image
              src={image}
              alt={alt}
              fill
              className={cn(
                "rounded-[30px] object-cover transition-transform duration-300 group-hover:scale-105",
                {
                  "object-left": imagePosition === "left",
                  "object-bottom": imagePosition === "bottom",
                },
              )}
            />
          </div>
        </a>
        <div className="project-text flex h-full">
          <h3 className="pl-4 font-bold text-xl">{title}</h3>
          <div className="ml-auto flex items-center gap-8 pr-4 font-bold text-lg">
            <ProjectLikes projectId={id} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
