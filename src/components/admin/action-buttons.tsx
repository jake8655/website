"use client";
import { api } from "@/trpc/react";
import type { Row } from "@tanstack/react-table";
import { Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function ArchiveButton({
  id,
  archived,
}: { id: number; archived: boolean }) {
  const utils = api.useUtils();

  const { mutate, isPending } = api.admin.toggleMessageArchived.useMutation({
    onMutate: async () => {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.admin.getMessageData.cancel();

      // Get the data from the queryCache
      const prevData = utils.admin.getMessageData.getData()!;

      // Optimistically update the data with our new post
      utils.admin.getMessageData.setData(undefined, old => {
        const index = old!.findIndex(post => post.id === id);

        return old!.map((post, i) => {
          if (i === index) return { ...post, archived: !post.archived };
          return post;
        });
      });

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError: (_, __, ctx) => {
      // If the mutation fails, use the context-value from onMutate
      utils.admin.getMessageData.setData(undefined, ctx!.prevData);
      toast.error(
        `Error ${ctx!.prevData[0]!.archived ? "restoring" : "archiving"} message`,
        {
          description: `There was an internal server error while ${ctx!.prevData[0]!.archived ? "restoring" : "archiving"} the message.`,
          action: {
            label: "Try again",
            onClick: () => mutate({ messageId: id }),
          },
        },
      );
    },
    onSettled: () => {
      // Sync with server once mutation has settled
      utils.admin.getMessageData.invalidate();
    },
    onSuccess: (_, __, { prevData }) => {
      toast.success(
        `Successfully ${prevData[0]!.archived ? "restored" : "archived"} message`,
        {
          action: {
            label: "Undo",
            onClick: () => mutate({ messageId: id }),
          },
        },
      );
    },
  });

  return (
    <DropdownMenuItem
      onClick={() => mutate({ messageId: id })}
      disabled={isPending}
      className="flex items-center gap-1"
    >
      <Archive />
      {archived ? "Restore" : "Archive"}
    </DropdownMenuItem>
  );
}

export function DeleteButton({ id }: { id: number }) {
  const utils = api.useUtils();

  const { mutate, isPending } = api.admin.deleteMessage.useMutation({
    onMutate: async () => {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.admin.getMessageData.cancel();

      // Get the data from the queryCache
      const prevData = utils.admin.getMessageData.getData()!;

      // Optimistically update the data with our new post
      utils.admin.getMessageData.setData(undefined, old => {
        const index = old!.findIndex(post => post.id === id);

        return old!.filter((_, i) => i !== index);
      });

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError: (_, __, ctx) => {
      // If the mutation fails, use the context-value from onMutate
      utils.admin.getMessageData.setData(undefined, ctx!.prevData);
      toast.error("Error deleting message", {
        description:
          "There was an internal server error while deleting the message.",
        action: {
          label: "Try again",
          onClick: () => mutate({ messageId: id }),
        },
      });
    },
    onSettled: () => {
      // Sync with server once mutation has settled
      utils.admin.getMessageData.invalidate();
    },
    onSuccess: () => {
      toast.success(`Successfully deleted message`);
    },
  });

  return (
    <DropdownMenuItem
      onClick={() => mutate({ messageId: id })}
      disabled={isPending}
      className="flex items-center gap-1"
    >
      <Trash2 />
      Delete
    </DropdownMenuItem>
  );
}

export function ArchiveBulkButton<TData>({ rows }: { rows: Row<TData>[] }) {
  if (rows.length === 0) return null;

  return (
    <Button variant="warning" size="sm">
      <Archive />
    </Button>
  );
}

export function DeleteBulkButton<TData>({ rows }: { rows: Row<TData>[] }) {
  if (rows.length === 0) return null;

  return (
    <Button variant="destructive" size="sm">
      <Trash2 />
    </Button>
  );
}
