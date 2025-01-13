"use client";

import type { Contact } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, Mail } from "lucide-react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useModal,
} from "../ui/animated-modal";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ArchiveButton, DeleteButton } from "./action-buttons";

export const columns: ColumnDef<Contact>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const name = getValue() as string;
      if (name.length <= 20) return name;
      return name.slice(0, 20) + "...";
    },
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          Email
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const email = getValue() as string;
      if (email.length <= 20) return email;
      return email.slice(0, 20) + "...";
    },
  },
  {
    id: "subject",
    accessorKey: "subject",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          Subject
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const subject = getValue() as string;
      if (subject.length <= 20) return subject;
      return subject.slice(0, 20) + "...";
    },
  },
  {
    id: "message",
    accessorKey: "message",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          Message
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const message = getValue() as string;
      if (message.length <= 100) return message;
      return message.slice(0, 100) + "...";
    },
  },
  {
    id: "date",
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          Date
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      return date.toLocaleDateString();
    },
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.getValue("date") as Date;
      const dateB = rowB.getValue("date") as Date;
      return dateA.getTime() - dateB.getTime();
    },
    sortDescFirst: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;

      return (
        <MessageModal post={post}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <ViewMessageButton />
              <DropdownMenuSeparator />
              <ArchiveButton id={post.id} archived={post.archived!} />
              {post.archived ? <DeleteButton id={post.id} /> : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </MessageModal>
      );
    },
    enableHiding: false,
  },
  {
    id: "archived",
    accessorKey: "archived",
    enableHiding: false,
    enableSorting: false,
  },
];

function ViewMessageButton() {
  const { setOpen } = useModal();

  return (
    <DropdownMenuItem onClick={() => setOpen(true)}>
      <ExternalLink /> View entire message
    </DropdownMenuItem>
  );
}

function MessageModal({
  post,
  children,
}: { post: Contact; children: React.ReactNode }) {
  return (
    <Modal>
      <ModalBody>
        <ModalContent>
          <h3 className="mb-4 text-center font-bold text-3xl">{post.name}</h3>
          <div className="space-y-4">
            <p className="text-center text-base text-neutral-300">
              {post.subject}
            </p>
            <p className="text-balance text-neutral-500 text-sm">
              {post.message
                .split("")
                .map((char, i) =>
                  char === "\n" ? <br key={i} /> : <span key={i}>{char}</span>,
                )}
            </p>
          </div>
        </ModalContent>
        <ModalFooter className="flex items-center gap-2">
          <CalendarDays size={16} className="shrink-0" />
          <p>Posted on {post.createdAt.toLocaleDateString()}</p>
          <p className="ml-auto">{post.email}</p>
          <Mail size={16} className="shrink-0" />
        </ModalFooter>
      </ModalBody>
      {children}
    </Modal>
  );
}
