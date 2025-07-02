"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useContext, useEffect, useState, useCallback } from "react";
import Style from "../../../styles/Albums.module.css";
import { AlbumDataTable } from "../components/AlbumDataTable";
import UserContext from "@/context/userContext";
import toast from "react-hot-toast";
import { apiGet } from "@/helpers/axiosRequest";
import AlbumsLoading from "@/components/AlbumsLoading";
import ErrorSection from "@/components/ErrorSection";
import Link from "next/link";


const Albums = ({ params }: { params: { filter: string } }) => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;
  const [albumList, setAlbumList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const filter =
    params.filter.charAt(0).toUpperCase() +
    params.filter.slice(1).toLowerCase();

  const validFilters = [
    "All",
    "Draft",
    "Processing",
    "Approved",
    "Rejected",
    "Live",
  ];

  const fetchAlbums = useCallback(async (labelId: string) => {
    try {
      const response = await apiGet(
        `/api/albums/filter?labelId=${labelId}&status=${filter}`
      );
      if (response.success) {
        setAlbumList(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error");
    }
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    if (labelId) {
      fetchAlbums(labelId);
    }
  }, [labelId, fetchAlbums]);

  if (!validFilters.includes(filter)) {
    return <ErrorSection message="Invalid URL or Not Found" />;
  }

  if (isLoading) {
    return <AlbumsLoading />;
  }

  return (
    <div className="w-full h-dvh p-6 bg-white rounded-sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Albums</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize ">{filter}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* all music list  */}

      <div className={`bg-white mt-3 rounded ${Style.musicListContainer}`}>
        <div className={`flex flex-col gap-3 md:flex-row justify-between items-baseline md:items-center`}>
          <h3 className="text-3xl font-bold text-blue-500 capitalize text-left">
            {filter} Albums
          </h3>

          <Link href="/albums/olddata/albums" className="px-4 py-2 bg-black text-white rounded-md">Old Data</Link>

        </div>

        <div className={Style.musicList}>
          {albumList ? (
            <AlbumDataTable data={albumList} />
          ) : (
            <h3 className="text-center mt-4">No Albums found</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Albums;
