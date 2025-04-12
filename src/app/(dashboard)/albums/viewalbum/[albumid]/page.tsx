"use client";

import React, { useContext, useEffect, useState } from "react";
import Style from "../../../../styles/ViewAlbums.module.css";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import ErrorSection from "@/components/ErrorSection";
import AlbumStatus from "../components/AlbumStatus";
import TrackSection from "./components/TrackSection";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import DeleteButton from "./components/DeleteButton";
import ContentDeliverySheet from "./components/ContentDeliveryReport";
import UserContext from "@/context/userContext";
import { useRouter } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import TrackList from "./components/TrackList";
import TrackDetails from "./components/TrackDetails";
import AlbumDetails from "./components/AlbumDetails";
import { Card, CardContent } from "@/components/ui/card";

interface Album {
  _id: string;
  title: string;
  artist: string;
  thumbnail: string;
  totalTracks: number;
  status: number;
  labelId: string;
}

const Albums = ({ params }: { params: { albumid: string } }) => {
  const router = useRouter();
  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const [album, setAlbum] = useState<Album | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchAlbumDetails = async () => {
    try {
      const response = await apiGet(
        `/api/albums/getAlbumDetails?albumId=${atob(params.albumid)}`
      );

      if (response.success) {
        setAlbum(response.data);
      }
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  useEffect(() => {
    if (labelId) {
      fetchAlbumDetails();
    }
  }, [labelId]);

  const handleTrackClick = (trackId: string) => {
    setActiveTrackId(trackId);
  };

  const onFinalSubmit = () => {
    setIsDialogOpen(true);
  };

  const handleContinue = async () => {
    const payload = {
      id: atob(params.albumid),
      status: 1, // Assuming 1 is the processing status
      comment: "",
    };

    try {
      const response = await apiPost("/api/albums/updateStatus", payload);
    
      if (response.success) {
        toast.success("Thank you! Your album(s) are currently being processed");
        // check it
        if (album) {
          setAlbum((prevAlbum) =>
            prevAlbum
              ? {
                  ...prevAlbum,
                  status: 1,
                }
              : null
          );
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-white rounded-sm">
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
            <BreadcrumbPage>View Album</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-4">
          <AlbumDetails album={album} />
        </div>
        <div className="col-span-8">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <TrackList
                    albumId={atob(params.albumid)}
                    onTrackClick={handleTrackClick}
                  />
                </div>
                <div className="col-span-8">
                  {activeTrackId && (
                    <TrackDetails
                      trackId={activeTrackId}
                      onFetchDetails={() => {}}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className={Style.albumContainer}>
        <div className={Style.albumThumbnailContainer}>
          {album && album.thumbnail && (
             <a
             href={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${atob(params.albumid)}ba3/cover/${album.thumbnail}`}
             download={album.thumbnail as string}
            rel="noreferrer"
             className="w-full"
           >
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${atob(params.albumid)}ba3/cover/${album.thumbnail}`}
              alt="album thumbnail"
              width={480}
              height={480}
              className={Style.albumThumbnail}
            />
            </a>
          )}
        </div>

        <div className={`p-3 border rounded ${Style.albumDetails}`}>
          {album && (
            <div style={{ width: "100%" }}>
              <AlbumStatus 
              status={album.status}
              comment={""}
              />
            </div>
          )}
          <h2 className={Style.albumTitle}>
            {album && album.title}
          </h2>
          <p className={`${Style.albumArtist} mb-2`}>
            {album && album.artist}
          </p>
          <div className="flex mb-3">
            {album &&
              album.tags.map((tag) => (
                <span
                  key={tag}
                  className="me-2 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                >
                  {tag}
                </span>
              ))}
          </div>

          <ul className={Style.albumInfoList}>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Genre:{" "}
              </span>
              {album?.genre}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Language: </span>
              {album?.language}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                UPC: </span>
              {album?.upc}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Release Date:{" "}
              </span>
              {album?.releasedate
                ? new Date(album.releasedate).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )
                : ""}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                C Line:{" "}
              </span>
              {album ? `© ${album.cline}` : ""}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                P Line:{" "}
              </span>
              {album ? `℗ ${album.pline}` : ""}
            </li>
          </ul>

          <div className="flex items-center">
            {atob(params.albumid) &&
              album &&
              (album.status === 0 || album.status === 3) && (
                <Link
                  href={`/albums/edit/${btoa(atob(params.albumid) as string)}`}
                  className={`mt-4 mb-2 ${Style.albumEditBtn} p-3`}
                >
                  <i className="me-2 bi bi-pencil-square"></i>
                  Edit Album
                </Link>
              )}

            {atob(params.albumid) &&
              album &&
              (album.status === 0 || album.status === 3) && (
                <Link
                  href={`/albums/addtrack/${btoa(atob(params.albumid) as string)}`}
                  className={`mt-4 ms-5 mb-2 btn ${Style.albumAddTrack} p-3`}
                >
                  <i className="me-2 bi bi-plus-circle"></i>
                  Add track
                </Link>
              )}

            {album &&
              (album.status === 0 || album.status === 3) &&
              album.totalTracks > 0 && (
                <button
                  type="button"
                  className={`mt-4 ms-5 mb-2 ${Style.albumSuccessBtn} p-3`}
                  onClick={onFinalSubmit}
                >
                  Final Submit <i className="me-2 bi bi-send-fill"></i>
                </button>
              )}

            {atob(params.albumid) &&
              album &&
              album.status == 0 && (
                <DeleteButton albumId={atob(params.albumid)} />
              )}

            {atob(params.albumid) &&
              album &&
             ( album.status === 2 ||
              album.status === 4 )&&
              (
                <Link
                  href={`/marketing/add/${btoa(
                    atob(params.albumid) as string
                  )}?albumname=${encodeURIComponent(album?.title)}`}
                  className={`mt-4 ms-5 mb-2 btn me-2 ${Style.albumAddTrack} p-3`}
                >
                  <i className="me-2 bi bi-megaphone "></i>
                  Marketing
                </Link>
              )}

            {atob(params.albumid) &&
              album &&
              (album.status === 2 ||
                album.status === 4) && (
                <ContentDeliverySheet
                  contentTitle={album.title}
                  approvalDate={album.updatedAt}
                />
              )}
          </div>
        </div>
      </div>

      {/* list of tracks  */}

      {album && album.totalTracks > 0 ? (
        atob(params.albumid) && <TrackSection albumId={atob(params.albumid)} />
      ) : (
        <div className="mt-5 pt-4">
          <h1 className="text-center text-2xl mt-5">No track found</h1>
        </div>
      )}

      <ConfirmationDialog
        show={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContinue={handleContinue}
        title="Are You Sure ?"
        description="Please note that once you submit your final details, you will not be able to make any further changes."
      />
    </div>
  );
};

export default Albums;
