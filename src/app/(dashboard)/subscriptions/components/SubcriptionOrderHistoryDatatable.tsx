"use client";

import React, { useContext } from "react";
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceTemplate } from "./InvoiceTemplate";
import { createRoot } from 'react-dom/client';
import UserContext from "@/context/userContext";

export type Subscription = {
    _id: string;
    planName: string;
    trackCount: string;
    price: string;
    endDate: string;
    isExpired: boolean;
    status: string;
    invoiceId: string;
    createdAt: string;
    startDate: string;
    orderId: string;
};

const generatePDF = async (subscription: Subscription, userDetails: any) => {
    // Create a temporary div to render the invoice
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    console.log("Subscription:", subscription);
    // Render the invoice template
    const root = createRoot(tempDiv);
    root.render(<InvoiceTemplate subscription={subscription} userDetails={userDetails} />);

    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        // Convert the rendered template to canvas
        const canvas = await html2canvas(document.getElementById('invoice-template')!, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        // Create PDF
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`invoice-${subscription.orderId.slice(-8)}.pdf`);
    } finally {
        // Clean up
        root.unmount();
        document.body.removeChild(tempDiv);
    }
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
            const userContext = useContext(UserContext);
            
            return (
                <button
                    onClick={async () => {
                        try {
                            const response = await fetch(`/api/subscription/generate-invoice?subscriptionId=${subscription._id}`);
                            if (!response.ok) throw new Error('Failed to fetch invoice data');
                            const data = await response.json();
                            console.log("Invoice data:", data); 
                            if (!data.success) throw new Error(data.message);
                            
                            await generatePDF(data.subscription, userContext?.user);
                        } catch (error) {
                            console.error('Error downloading invoice:', error);
                            alert('Failed to download invoice. Please try again.');
                        }
                    }}
                    className="ms-2 text-blue-600"
                >
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1  text-blue-700 ring-1 ring-inset ring-blue-600/20">
                    <i className="bi bi-file-earmark-arrow-down-fill me-1"></i>
                        Download Invoice
                    </span>
                </button>
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