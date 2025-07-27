import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";

interface VirtualizedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  itemHeight?: number; // Height of each row
  height?: number; // Height of the virtualized container
}

// ✅ Memoized row component for virtual scrolling
const VirtualRow = React.memo(({ 
  index, 
  style, 
  data: { rows, columns } 
}: {
  index: number;
  style: React.CSSProperties;
  data: { rows: any[]; columns: ColumnDef<any, any>[] };
}) => {
  const row = rows[index];
  
  return (
    <div style={style} className="flex border-b">
      {row.getVisibleCells().map((cell: any) => (
        <div 
          key={cell.id} 
          className="flex-1 px-4 py-2 text-left"
          style={{ minWidth: `${100 / row.getVisibleCells().length}%` }}
        >
          {flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
          )}
        </div>
      ))}
    </div>
  );
});

VirtualRow.displayName = 'VirtualRow';

export function VirtualizedDataTable<TData, TValue>({
  columns,
  data,
  itemHeight = 60,
  height = 400,
}: VirtualizedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // ✅ Memoized table configuration
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // ✅ Memoized rows for virtual scrolling
  const rows = useMemo(() => table.getRowModel().rows, [table]);

  // ✅ Memoized item data for virtual list
  const itemData = useMemo(() => ({
    rows,
    columns,
  }), [rows, columns]);

  return (
    <div className="w-full">
      <div className="rounded-md border">
        {/* Header */}
        <div className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} className="flex border-b">
              {headerGroup.headers.map((header) => (
                <div 
                  key={header.id} 
                  className="flex-1 px-4 py-3 text-left font-medium"
                  style={{ minWidth: `${100 / headerGroup.headers.length}%` }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ✅ Virtual scrolling container */}
        {rows.length > 0 ? (
          <List
            height={height}
            width="100%"
            itemCount={rows.length}
            itemSize={itemHeight}
            itemData={itemData}
          >
            {VirtualRow}
          </List>
        ) : (
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">No results.</p>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
    </div>
  );
} 