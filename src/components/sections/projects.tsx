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
    alt: "Gymgol Simulator",
    id: "gymgol-simulator",
  },
  {
    title: "Asteroids",
    backgroundColor: "bg-gradient-to-br from-slate-300 to-slate-400",
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
          alt={project.alt}
          id={project.id}
          className={cn("project-card", project.backgroundColor)}
        />
      ))}
    </ProjectsSection>
  );
}

async function ProjectCard({
  title,
  href,
  image,
  alt,
  id,
  className,
}: {
  title: string;
  href: string;
  image: string;
  alt: string;
  id: string;
  className?: string;
}) {
  await api.projectLike.getProjectLikeCount.prefetch({ projectId: id });

  return (
    <HydrateClient>
      <a
        className={cn(
          "relative mb-[600px] block min-h-[600px] w-full rounded-[30px]",
          className,
        )}
        style={{
          transformOrigin: "50% -160%",
        }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={image}
          alt={alt}
          fill
          className="absolute inset-0 rounded-[30px] object-cover p-4"
        />

        <div className="project-text relative h-full w-full">
          <h3 className="absolute bottom-0 left-0 translate-y-full pt-4 pl-4 font-bold text-xl">
            {title}
          </h3>
          <div className="absolute right-0 bottom-0 flex translate-y-full items-center gap-8 pt-4 pr-4 font-bold text-lg">
            <ProjectLikes projectId={id} />
          </div>
        </div>
      </a>
    </HydrateClient>
  );
}
