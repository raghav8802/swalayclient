"use client";
import UserContext from "@/context/userContext";
import { apiGet } from "@/helpers/axiosRequest";
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import MarketingCard from "./components/MarketingCard";
import Loading from "../loading";

interface Album {
  artist: string;
  cline: string;
  comment: string;
  date: string;
  genre: string;
  labelId: string;
  language: string;
  platformLinks: string | null;
  pline: string;
  releasedate: string;
  status: number;
  marketingStatus: string;
  tags: string[];
  thumbnail: string;
  title: string;
  _id: string;
}

const Page = () => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id ?? "";
  const [marketingData, setMarketingData] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchAlbumBymarketing = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGet(`/api/marketing/fetchAlbumBymarketing?labelId=${labelId}`);
      if (response.success) {
        setMarketingData(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [labelId]);

  useEffect(() => {
    if (labelId) {
      fetchAlbumBymarketing();
    }
  }, [labelId, fetchAlbumBymarketing]);

  if (isLoading) {
    return <Loading />;
  }

  return (   
    <div className="w-full min-h-screen p-6 bg-white rounded-sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Marketing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-4 mt-5 text-blue-600">
        All marketings
      </h1>

      <div className="w-full flex items-center justify-start flex-wrap">
        {marketingData && marketingData.length > 0 ? (
          marketingData.map((album) => (
            <MarketingCard
              albumId={album._id}
              key={album._id}
              imageSrc={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${album._id}ba3/cover/${album.thumbnail}`}
              albumName={album.title}
              albumArtist={album.artist}
              status={album.marketingStatus}
            />
          ))
        ) : (
          <div className="w-full text-center py-10">
            <p className="text-gray-500 text-lg">No marketing campaigns found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
