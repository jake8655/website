"use client";

import { cn, msToTime } from "@/lib/utils";
import { api } from "@/trpc/react";
import NumberFlow from "@number-flow/react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function ProjectLikes({ projectId }: { projectId: string }) {
  const { data, isLoading } = api.projectLike.getProjectLikeCount.useQuery({
    projectId,
  });

  // Should not happen because data is prefetched on the server
  if (isLoading || !data) return null;

  return (
    <div className="fade-in slide-in-from-right flex animate-in items-start gap-2 duration-700">
      <NumberFlow value={data.likes} />
      <ProjectLikeButton
        projectId={projectId}
        userHasLiked={data.userHasLiked}
      />
    </div>
  );
}

function ProjectLikeButton({
  projectId,
  userHasLiked,
}: {
  projectId: string;
  userHasLiked: boolean;
}) {
  const utils = api.useUtils();

  const { mutate, isPending } = api.projectLike.likeProject.useMutation({
    onMutate: async () => {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.projectLike.getProjectLikeCount.cancel({ projectId });

      // Get the data from the queryCache
      const prevData = utils.projectLike.getProjectLikeCount.getData({
        projectId,
      })!;

      // Optimistically update the data with our new post
      utils.projectLike.getProjectLikeCount.setData({ projectId }, old => {
        if (!old!.userHasLiked)
          return {
            likes: old!.likes + 1,
            userHasLiked: true,
          };

        return {
          likes: old!.likes - 1,
          userHasLiked: false,
        };
      });

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError: (err, __, ctx) => {
      // If the mutation fails, use the context-value from onMutate
      utils.projectLike.getProjectLikeCount.setData(
        { projectId },
        ctx!.prevData,
      );

      if (err.data?.ratelimit) {
        const resetTimestamp = err.data.ratelimit.resetTimestamp;
        const timeStamp = msToTime(resetTimestamp - Date.now());

        return toast.error("Error liking the project", {
          description: `You have exceeded the rate limit for liking projects. Please try again in ${timeStamp}.`,
        });
      }
      toast.error("Error liking the project", {
        description:
          "There was an internal server error while liking the project.",
        action: {
          label: "Try again",
          onClick: () => mutate({ projectId }),
        },
      });
    },
    onSettled: () => {
      // Sync with server once mutation has settled
      utils.projectLike.getProjectLikeCount.invalidate({ projectId });
    },
    onSuccess: ({ userHasLiked }) => {
      if (userHasLiked)
        return toast.success("Successfully liked the project", {
          description: "Thank you for liking the project!",
          action: {
            label: "Undo",
            onClick: () => mutate({ projectId }),
          },
        });

      toast.success("Successfully removed like from the project", {
        action: {
          label: "Undo",
          onClick: () => mutate({ projectId }),
        },
      });
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => mutate({ projectId })}
            disabled={isPending}
            className="group"
          >
            <ThumbsUp filled={userHasLiked} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{userHasLiked ? "Remove like from" : "Like"} this project</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ThumbsUp({
  filled,
}: {
  filled: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-thumbs-up"
    >
      <path
        d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
        style={{
          transition: "fill 200ms ease-out",
        }}
        className={cn("fill-transparent group-hover:fill-brand-dark", {
          "fill-brand-dark": filled,
        })}
      />
      <path d="M7 10v12" />
    </svg>
  );
}
