import { cn } from "@/lib/utils";
import { getProjectLikeCount } from "@/server/sdk/get-project-like-count";
import { Suspense } from "react";
import ProjectLikeButton from "../project-like-button";
import ProjectsSection from "../projects-section";

const projects = [
  {
    title: "ASR RolePlay",
    backgroundColor: "bg-blue-600",
    id: "asr-roleplay",
  },
  {
    title: "Access-Bot",
    backgroundColor: "bg-green-600",
    id: "access-bot",
  },
  {
    title: "Asteroids",
    backgroundColor: "bg-slate-300",
    id: "asteroids",
  },
  {
    title: "Gymgol Simulator",
    backgroundColor: "bg-teal-600",
    id: "gymgol-simulator",
  },
  {
    title: "Tic-Tac-Toe Game & Bot",
    backgroundColor: "bg-red-600",
    id: "tic-tac-toe",
  },
];

export default function Projects({ className }: { className?: string }) {
  return (
    <ProjectsSection className={className}>
      {projects.map(project => (
        <ProjectCard
          key={project.title}
          title={project.title}
          id={project.id}
          className={cn("project-card", project.backgroundColor)}
        />
      ))}
    </ProjectsSection>
  );
}

function ProjectCard({
  title,
  id,
  className,
}: {
  title: string;
  id: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mb-[600px] min-h-[600px] w-full rounded-[30px] shadow-md",
        className,
      )}
      style={{
        transformOrigin: "50% -160%",
      }}
    >
      <div className="project-text relative h-full w-full">
        <h3 className="absolute bottom-0 left-0 translate-y-full pt-4 pl-4 font-bold text-xl">
          {title}
        </h3>
        <div className="absolute right-0 bottom-0 flex translate-y-full items-center gap-8 pt-4 pr-4 font-bold text-lg">
          <Suspense fallback={<div />}>
            <ProjectLikes projectId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ProjectLikes({ projectId }: { projectId: string }) {
  const { likes, userHasLiked } = await getProjectLikeCount(projectId);

  return (
    <div className="fade-in slide-in-from-right flex animate-in gap-2 duration-700">
      {likes}
      <ProjectLikeButton projectId={projectId} userHasLiked={userHasLiked} />
    </div>
  );
}
