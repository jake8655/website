"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ArchiveBulkButton, DeleteBulkButton } from "./action-buttons";
import { columns } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function DataTable() {
  const { data, isLoading } = api.admin.getMessageData.useQuery();

  const tableData = isLoading
    ? Array(20)
        .fill(0)
        .map((_, i) => ({
          // `archived` is a required key because its used in the initial filter state
          archived: i % 2 === 0,
        }))
    : data!;

  const tableColumns = isLoading
    ? columns.map(col => ({
        ...col,
        header: col.id === "select" ? null : col.header,
        cell: () =>
          ["select", "actions"].includes(col.id!) ? null : (
            <Skeleton className="h-6 w-full rounded-full" />
          ),
      }))
    : columns;

  // @ts-expect-error some porblem with the types, idk idc
  return <TableView columns={tableColumns} data={tableData as Contact[]} />;
}

function TableView<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // Disable react compiler for this component because the table doesnt update if the compiler is enabled
  // eslint-disable-next-line react-compiler/react-compiler
  "use no memo";

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    archived: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "archived", value: false },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
    state: {
      columnVisibility,
      columnFilters,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          onChange={event => table.setGlobalFilter(String(event.target.value))}
          className="max-w-sm bg-background"
        />
        <div className="ml-auto flex gap-2">
          <Select
            defaultValue="active"
            onValueChange={option =>
              table.getColumn("archived")?.setFilterValue(option === "archived")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="active">Active</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border bg-slate-900/70">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex flex-1 items-center gap-2 text-muted-foreground text-sm">
          <p>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ArchiveBulkButton
                  rows={table.getFilteredSelectedRowModel().rows}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Archive</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {table.getColumn("archived")?.getFilterValue() ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DeleteBulkButton
                    rows={table.getFilteredSelectedRowModel().rows}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <p className="text-muted-foreground text-sm">
          {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
