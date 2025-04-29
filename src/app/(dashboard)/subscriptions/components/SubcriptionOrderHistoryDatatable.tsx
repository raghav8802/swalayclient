"use client";

import React from "react";
import {
    ColumnDef,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export type Subscription = {
    _id: string;
    planName: string;
    trackCount: string;
    price: string;
    endDate: string;
    isExpired: boolean;
    status: string;
    createdAt: string;
};

export const subscriptionColumns: ColumnDef<Subscription>[] = [
    {
        accessorKey: "srno",
        header: "Sr No",
        cell: (info) => info.row.index + 1,
    },
    {
        accessorKey: "planName",
        header: "Plan Name",
        cell: ({ row }) => row.original.planName,
    },
    {
        accessorKey: "trackCount",
        header: "Available Tracks",
        cell: ({ row }) => row.original.trackCount,
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => `₹${row.original.price}`,
    },
    {
        accessorKey: "endDate",
        header: "End Date",
        cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString(),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const subscription = row.original;
            return (
                <div className="ms-2">
                    {subscription.isExpired ? (
                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                            Expired
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Active
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "invoice",
        header: "Invoice",
        cell: ({ row }) => {
            const subscription = row.original;
            return (
                <Link
                    className="ms-2 text-blue-600"
                    href={`/invoices/${subscription._id}`}
                >
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1  text-blue-700 ring-1 ring-inset ring-blue-600/20">
                    <i className="bi bi-file-earmark-arrow-down-fill me-1"></i>
                        Download Invoice
                    </span>
                </Link>
            );
        },
    },
];

export function SubscriptionDataTable({ data }: { data: Subscription[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

    const table = useReactTable({
        data,
        columns: subscriptionColumns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnVisibility,
        },
    });

    return (
        <div className="w-full">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        <div className="ms-1">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={subscriptionColumns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
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