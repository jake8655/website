"use client";
import type { Row } from "@tanstack/react-table";
import { Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Contact } from "@/server/db/schema";
import { api } from "@/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function ArchiveButton({
  id,
  archived,
}: {
  id: number;
  archived: boolean;
}) {
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
      const previousArchived =
        ctx!.prevData.find(post => post.id === id)?.archived ?? archived;

      toast.error(
        `Error ${previousArchived ? "restoring" : "archiving"} message`,
        {
          description: `There was an internal server error while ${previousArchived ? "restoring" : "archiving"} the message.`,
          action: {
            label: "Try again",
            onClick: () => toggleArchived(),
          },
        },
      );
    },
    onSettled: () => {
      // Sync with server once mutation has settled
      utils.admin.getMessageData.invalidate();
    },
    onSuccess: (_, __, { prevData }) => {
      const previousArchived =
        prevData.find(post => post.id === id)?.archived ?? archived;

      toast.success(
        `Successfully ${previousArchived ? "restored" : "archived"} message`,
        {
          action: {
            label: "Undo",
            onClick: () => toggleArchived(),
          },
        },
      );
    },
  });

  function toggleArchived() {
    if (isPending) return;
    mutate({ messageId: id });
  }

  return (
    <DropdownMenuItem
      onClick={toggleArchived}
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
          onClick: () => deleteMessage(),
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

  function deleteMessage() {
    if (isPending) return;
    mutate({ messageId: id });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={event => event.preventDefault()}
          disabled={isPending}
          className="flex items-center gap-1 text-destructive focus:text-destructive"
        >
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete message?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the contact message. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={deleteMessage}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ArchiveBulkButton({
  rows,
  resetSelection,
}: {
  rows: Row<Contact>[];
  resetSelection: () => void;
}) {
  const ids = rows.map(row => row.original.id);
  const utils = api.useUtils();

  const { mutate, isPending } = api.admin.archiveBulk.useMutation({
    onMutate: async targetIds => {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.admin.getMessageData.cancel();

      // Get the data from the queryCache
      const prevData = utils.admin.getMessageData.getData()!;

      // Optimistically update the data with our new post
      utils.admin.getMessageData.setData(undefined, old => {
        return old!.map(post => {
          if (targetIds.includes(post.id))
            return { ...post, archived: !post.archived };
          return post;
        });
      });

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError: (_, vars, ctx) => {
      // If the mutation fails, use the context-value from onMutate
      utils.admin.getMessageData.setData(undefined, ctx!.prevData);
      const previousArchived = ctx!.prevData.find(
        post => post.id === vars[0],
      )!.archived;

      toast.error(
        `Error ${previousArchived ? "restoring" : "archiving"} messages`,
        {
          description: `There was an internal server error while ${
            previousArchived ? "restoring" : "archiving"
          } the messages.`,
          action: {
            label: "Try again",
            onClick: () => archiveMessages(vars),
          },
        },
      );
    },
    onSettled: () => {
      // Sync with server once mutation has settled
      utils.admin.getMessageData.invalidate();
    },
    onSuccess: (_, vars, ctx) => {
      const previousArchived = ctx!.prevData.find(
        post => post.id === vars[0],
      )!.archived;

      toast.success(
        `Successfully ${previousArchived ? "restored" : "archived"} messages`,
      );
      resetSelection();
    },
  });

  function archiveMessages(targetIds = ids) {
    if (isPending) return;
    mutate(targetIds);
  }

  return rows.length > 0 ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={rows[0]!.original.archived ? "success" : "warning"}
            size="sm"
            onClick={() => archiveMessages()}
            disabled={isPending}
          >
            <Archive />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{rows[0]!.original.archived ? "Restore" : "Archive"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : null;
}

export function DeleteBulkButton({
  rows,
  resetSelection,
}: {
  rows: Row<Contact>[];
  resetSelection: () => void;
}) {
  const ids = rows.map(row => row.original.id);
  const utils = api.useUtils();

  const { mutate, isPending } = api.admin.deleteBulk.useMutation({
    onMutate: async targetIds => {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.admin.getMessageData.cancel();

      // Get the data from the queryCache
      const prevData = utils.admin.getMessageData.getData()!;

      // Optimistically update the data with our new post
      utils.admin.getMessageData.setData(undefined, old =>
        old!.filter(post => !targetIds.includes(post.id)),
      );

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError: (_, vars, ctx) => {
      // If the mutation fails, use the context-value from onMutate
      utils.admin.getMessageData.setData(undefined, ctx!.prevData);

      toast.error("Error deleting messages", {
        description:
          "There was an internal server error while deleting messages.",
        action: {
          label: "Try again",
          onClick: () => deleteMessages(vars),
        },
      });
    },
    onSettled: () => {
      // Sync with server once mutation has settled
      utils.admin.getMessageData.invalidate();
    },
    onSuccess: () => {
      toast.success("Successfully deleted messages");
      resetSelection();
    },
  });

  function deleteMessages(targetIds = ids) {
    if (isPending) return;
    mutate(targetIds);
  }

  return rows.length > 0 ? (
    <AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isPending}>
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete selected messages?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes {rows.length} selected contact{" "}
            {rows.length === 1 ? "message" : "messages"}. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => deleteMessages()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
}
