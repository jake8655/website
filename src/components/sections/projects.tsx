import { cn } from "@/lib/utils";
import ProjectSectionManager from "../project-section-manager";

export default function Projects({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "fade-in slide-in-from-left animate-in duration-700 ease-out",
        className,
      )}
    >
      <ProjectSectionManager />
    </section>
  );
}
