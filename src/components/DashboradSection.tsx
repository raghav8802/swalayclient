"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
// import Style from "../app/styles/DashboardSection.module.css";
import UserContext from "@/context/userContext";
import { apiGet } from "@/helpers/axiosRequest";
import { NotificationSection } from "./NotificationSection";
import Image from "next/image";
import AnalyticCard from "./AnalyticCard";
import { 
  TrendingUp, 
  Mic, 
  Wallet, 
  Music, 
  Plus, 
  Inbox, 
  IndianRupee, 
  Users, 
  Headphones, 
  Edit, 
  User 
} from "lucide-react";

interface Stats {
  albums: number;
  artists: number; // Updated to reflect total artists instead of labels
  balance: number; // Added to reflect totalBalance
  upcomingReleases: number; // Added to reflect upcoming releases (Processing status)
}

// Define the interface for the album item
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
  totalTracks: number;
  status: number;
  tags: string[];
  thumbnail: string;
  title: string;
  _id: string;
}

interface ArtistData {
  iprs: boolean;
  iprsNumber: string;
  isComposer: boolean;
  isLyricist: boolean;
  isProducer: boolean;
  isSinger: boolean;
  labelId: string;
  artistName: string;
  profileImage: string;
  _id: string;
}

export default function DashboradSection() {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const [stats, setStats] = useState<Stats>({
    albums: 0,
    artists: 0,
    balance: 0,
    upcomingReleases: 0,
  });

  // new relese
  const [newReleseData, setNewReleseData] = useState<Album[]>([]);
  const [draftAlbums, setDraftAlbums] = useState<Album[]>([]);
  const [artistData, setArtistData] = useState<ArtistData[]>([]);

  const fetchNumberCounts = useCallback(async () => {
    try {
      const response = await apiGet(`/api/numbers?labelId=${labelId}`);

      if (response?.data) {
        setStats({
          albums: response.data.totalAlbums,
          artists: response.data.totalArtist,
          balance: response.data.totalBalance,
          upcomingReleases: response.data.upcomingReleases,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [labelId]);

  const fetchNewRelese = useCallback(async (labelId: string) => {
    try {
      const response = await apiGet(
        `/api/albums/filter?labelId=${labelId}&status=Live&limit=3}`
      );

      if (response.success) {
        setNewReleseData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchDraft = useCallback(async (labelId: string) => {
    try {
      const response = await apiGet(
        `/api/albums/filter?labelId=${labelId}&status=Draft&limit=3}`
      );
      if (response.success) {
        setDraftAlbums(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchAllArtist = useCallback(async (labelId: any) => {
    try {
      const response = await apiGet(
        `/api/artist/getArtists?labelId=${labelId}&limit=3`
      );

      if (response.success) {
        setArtistData(response.data);
      }
    } catch (error) {
      console.log("Error");
    }
  }, []);

  useEffect(() => {
    if (labelId) {
      fetchNumberCounts();
      fetchNewRelese(labelId);
      fetchDraft(labelId);
      fetchAllArtist(labelId);
    }
  }, [labelId, fetchNumberCounts, fetchNewRelese, fetchDraft, fetchAllArtist]);

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <main className="flex flex-1 items-start gap-4 py-4 sm:py-0 md:gap-8 lg:grid lg:grid-cols-[1fr_300px]">
        <div className="grid gap-4 lg:col-span-2 w-full">
          {/* counts  */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 ">
            <AnalyticCard
              title="Total Releases"
              value={stats.albums}
              icon={TrendingUp}
              iconColor="#3b82f6" // Blue
            />
            <AnalyticCard
              title="Total Artists"
              value={stats.artists}
              icon={Mic}
              iconColor="#3b82f6" // Blue
            />

            <AnalyticCard
              title="Revenue"
              value={`₹ ${stats.balance}`}
              icon={Wallet}
              iconColor="#3b82f6" // Blue
            />

            <AnalyticCard
              title="Upcoming Releases"
              value={stats.upcomingReleases}
              icon={Music}
              iconColor="#3b82f6" // Blue
            />
          </div>
          {/* counts  */}

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-9">
              {/* quick actions  */}

              <div className="mb-4">
                <div className="col-span-12">
                  <Card className="w-full ">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4">
                        <Link
                          href={"/albums/new-release"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="bg-[#8B5CF6] rounded-full QuickAccessItem group-hover:bg-[#7C3AED] transition-colors">
                            <Plus size={24} className="QuickAccessItemIcon text-white" />
                          </div>
                          <span className="text-sm text-[#8B5CF6] group-hover:text-[#7C3AED] transition-colors">
                            New Release
                          </span>
                        </Link>

                        <Link
                          href={"/albums"}
                          className=" flex flex-col items-center gap-2 group"
                        >
                          <div className="QuickAccessItem bg-[#6366F1] rounded-full group-hover:bg-[#4F46E5] transition-colors">
                            <Inbox size={24} className="QuickAccessItemIcon text-white" />
                          </div>
                          <span className="text-sm text-[#6366F1] group-hover:text-[#4F46E5] transition-colors">
                            Releases
                          </span>
                        </Link>

                        <Link
                          href={"/earnings"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="QuickAccessItem bg-[#10B981] rounded-full  group-hover:bg-[#059669] transition-colors">
                            <IndianRupee size={24} className="QuickAccessItemIcon text-white" />
                          </div>
                          <span className="text-sm text-[#10B981] group-hover:text-[#059669] transition-colors">
                            Earnings
                          </span>
                        </Link>

                        {/* <Link
                    href={"/artists"}
                    className="flex flex-col items-center gap-2 group"
                    >
                    <div className="bg-[#EC4899] rounded-full QuickAccessItem group-hover:bg-[#D8336D] transition-colors">
                                                <Users size={24} className="QuickAccessItemIcon text-white" />
                    </div>
                    <span className="text-sm text-[#EC4899] group-hover:text-[#D8336D] transition-colors">
                    Artists
                    </span>
                    </Link> */}

                        <Link
                          href={"support"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="bg-[#3B82F6] rounded-full QuickAccessItem group-hover:bg-[#2563EB] transition-colors">
                            <Headphones size={24} className="QuickAccessItemIcon text-white" />
                          </div>
                          <span className="text-sm text-[#3B82F6] group-hover:text-[#2563EB] transition-colors">
                            Support
                          </span>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              {/* quick actions  */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {newReleseData && (
                  <div className="col-span-1 anlyticsCard">
                    {/* New Releases  */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">New Releases</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {newReleseData.map((album) => (
                            <div
                              className="flex items-center justify-between"
                              key={album._id}
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${album._id}ba3/cover/${album.thumbnail}`}
                                  alt="Album Cover"
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                  style={{
                                    aspectRatio: "40/40",
                                    objectFit: "cover",
                                  }}
                                />
                                <div>
                                  <div className="font-medium">
                                    {album.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {album.artist}
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm font-medium">
                                {album.totalTracks}
                              </div>
                            </div>
                          ))}
                          <Link
                            href="/albums"
                            className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block"
                          >
                            View More
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* upcoming Release  */}
                {draftAlbums && (
                  <div className="col-span-1 anlyticsCard">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Draft Albums</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {draftAlbums.map((album) => (
                            <div
                              className="flex items-center justify-between"
                              key={album._id}
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${album._id}ba3/cover/${album.thumbnail}`}
                                  alt="Album Cover"
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                  style={{
                                    aspectRatio: "40/40",
                                    objectFit: "cover",
                                  }}
                                />
                                <div>
                                  <div className="font-medium">
                                    {album.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {album.artist}
                                  </div>
                                </div>
                              </div>
                              <Link
                                href={`/albums/viewalbum/${btoa(album._id)}`}
                                className="text-sm font-medium"
                              >
                                <Edit size={16} />
                              </Link>
                            </div>
                          ))}

                          <Link
                            href="/albums/draft"
                            className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block"
                          >
                            View More
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                {/* top artist  */}
                {artistData && (
                  <div className="col-span-1 anlyticsCard">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Top Artists </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {artistData.map((artist) => (
                            <div
                              className="flex items-center justify-between mb-2"
                              key={artist._id}
                            >
                              <Link
                                href={`/artists/${btoa(artist._id)}`}
                                className="flex items-center justify-between w-full"
                              >
                                <div className="flex items-center gap-2">
                                  {artist && artist.profileImage ? (
                                    <Image
                                      src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}labels/artist/${artist.profileImage}`}
                                      width={40}
                                      height={40}
                                      className="rounded-md"
                                      alt="artist profile"
                                    />
                                  ) : (
                                    <div className="rounded-full bg-[#55efc4] w-8 h-8 flex items-center justify-center text-xl">
                                      🎤
                                    </div>
                                  )}

                                  <div>
                                    <div className="font-medium">
                                      {artist.artistName}
                                    </div>
                                    {/* <div className="text-xs text-muted-foreground">
                        1.2M monthly listeners
                      </div> */}
                                  </div>
                                </div>

                                <User size={16} />
                              </Link>
                            </div>
                          ))}

                          <Link
                            href="/artists"
                            className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block"
                          >
                            View More
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* notifications  */}
            <div className="col-span-3 NotificationSection">
              {labelId && <NotificationSection labelId={labelId} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
