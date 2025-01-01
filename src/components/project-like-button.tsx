"use client";

import { likeProjectAction } from "@/server/sdk/like-project";
import { ThumbsUp } from "lucide-react";
import { useTransition } from "react";

export default function ProjectLikeButton({
  projectId,
  userHasLiked,
}: {
  projectId: string;
  userHasLiked: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => void likeProjectAction(projectId))}
      disabled={isPending}
    >
      {/* TODO: add a little animation when the like is successful */}
      <ThumbsUp fill={userHasLiked ? "#005cb8" : "none"} />
    </button>
  );
}
