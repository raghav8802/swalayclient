"use client";

import * as React from "react";
import { useMemo, useCallback } from "react";
import { VirtualizedDataTable } from "@/components/VirtualizedDataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Calendar, 
  Music, 
  Languages, 
  Hash, 
  ExternalLink, 
  Edit, 
  Plus 
} from "lucide-react";

export type Album = {
  _id: string;
  artist: string;
  cline: string;
  comment: string | null;
  date: string;
  genre: string;
  labelId: string;
  language: string;
  platformLinks: string | null;
  pline: string;
  releasedate: string;
  status: number;
  thumbnail: string | null;
  title: string;
  totalTracks: number;
  upc: string | null;
};

// ✅ Memoized status badge component
const StatusBadge = React.memo(({ status }: { status: number }) => {
  const getStatusInfo = useMemo(() => {
    switch (status) {
      case 0:
        return { text: "Draft", variant: "secondary" as const };
      case 1:
        return { text: "Submitted", variant: "default" as const };
      case 2:
        return { text: "Approved", variant: "default" as const };
      case 3:
        return { text: "Live", variant: "default" as const };
      case 4:
        return { text: "Takedown", variant: "destructive" as const };
      default:
        return { text: "Unknown", variant: "secondary" as const };
    }
  }, [status]);

  return <Badge variant={getStatusInfo.variant}>{getStatusInfo.text}</Badge>;
});

StatusBadge.displayName = 'StatusBadge';

// ✅ Memoized action buttons component
const AlbumActions = React.memo(({ album }: { album: Album }) => {
  const encodedId = useMemo(() => btoa(album._id), [album._id]);

  return (
    <div className="flex items-center gap-2">
      <Link href={`/albums/viewalbum/${encodedId}`}>
        <Button variant="ghost" size="sm">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/albums/edit/${encodedId}`}>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/albums/addtrack/${encodedId}`}>
        <Button variant="ghost" size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
});

AlbumActions.displayName = 'AlbumActions';

// ✅ Memoized columns definition
const createColumns = (): ColumnDef<Album>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="font-medium">
          {title.length > 30 ? `${title.substring(0, 30)}...` : title}
        </div>
      );
    },
  },
  {
    accessorKey: "artist",
    header: "Artist",
    cell: ({ row }) => {
      const artist = row.getValue("artist") as string;
      return (
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-muted-foreground" />
          {artist.length > 20 ? `${artist.substring(0, 20)}...` : artist}
        </div>
      );
    },
  },
  {
    accessorKey: "genre",
    header: "Genre",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("genre")}</Badge>,
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4 text-muted-foreground" />
        {row.getValue("language")}
      </div>
    ),
  },
  {
    accessorKey: "totalTracks",
    header: "Tracks",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-muted-foreground" />
        {row.getValue("totalTracks")}
      </div>
    ),
  },
  {
    accessorKey: "releasedate",
    header: "Release Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("releasedate"));
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <AlbumActions album={row.original} />,
  },
];

interface OptimizedAlbumDataTableProps {
  data: Album[];
  height?: number;
}

// ✅ Main optimized component with React.memo
export const OptimizedAlbumDataTable = React.memo<OptimizedAlbumDataTableProps>(({ 
  data, 
  height = 600 
}) => {
  const [globalFilter, setGlobalFilter] = React.useState("");

  // ✅ Memoized columns to prevent recreation
  const columns = useMemo(() => createColumns(), []);

  // ✅ Memoized filtered data
  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    
    return data.filter((album) =>
      album.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
      album.artist.toLowerCase().includes(globalFilter.toLowerCase()) ||
      album.genre.toLowerCase().includes(globalFilter.toLowerCase()) ||
      album.language.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }, [data, globalFilter]);

  // ✅ Memoized filter handler
  const handleFilterChange = useCallback((value: string) => {
    setGlobalFilter(value);
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Search Filter */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search albums, artists, genres..."
          value={globalFilter}
          onChange={(event) => handleFilterChange(event.target.value)}
          className="max-w-sm"
        />
        <Badge variant="secondary">{filteredData.length} albums</Badge>
      </div>

      {/* ✅ Virtualized Data Table */}
      <VirtualizedDataTable
        columns={columns}
        data={filteredData}
        height={height}
        itemHeight={70}
      />
    </div>
  );
});

OptimizedAlbumDataTable.displayName = 'OptimizedAlbumDataTable'; 