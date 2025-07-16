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
import SubscriptionEndAlert from "@/components/SubcriptionEndAlert";
import UserContext from "@/context/userContext";
import { TrackProvider } from "@/context/TrackContext";

interface AlbumDetails {
  artist: string;
  cline: string;
  comment: string | null;
  date: string;
  updatedAt: string;
  genre: string;
  labelId: string;
  language: string;
  platformLinks: string | null;
  pline: string;
  releasedate: string;
  status: number;
  tags: string[];
  thumbnail: string;
  title: string;
  totalTracks: number;
  upc: string | null;
  _id: string;
}

/* eslint-disable no-unused-vars */
enum AlbumProcessingStatus {
  Draft = 0, // on information submit
  Processing = 1, // on final submit
  Approved = 2,
  Rejected = 3,
  Live = 4,
}
/* eslint-disable no-unused-vars */

const tagColorMap: {
  [key: string]: { bg: string; text: string; ring: string };
} = {
  Romantic: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    ring: "ring-pink-700/10",
  },
  Happy: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    ring: "ring-yellow-700/10",
  },
  Sad: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-700/10" },
  Dance: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-700/10",
  },
  Bhangra: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    ring: "ring-orange-700/10",
  },
  Partiotic: {
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-700/10",
  },
  Nostalgic: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-700/10",
  },
  Inspirational: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-700/10",
  },
  Enthusiastic: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-700/10",
  },
  Optimistic: {
    bg: "bg-lime-50",
    text: "text-lime-700",
    ring: "ring-lime-700/10",
  },
  Passion: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-700/10",
  },
  Pessimistic: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    ring: "ring-slate-700/10",
  },
  Spiritual: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-700/10",
  },
  Peppy: {
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    ring: "ring-fuchsia-700/10",
  },
  Philosophical: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-700/10",
  },
  Mellow: { bg: "bg-teal-50", text: "text-teal-700", ring: "ring-teal-700/10" },
  Calm: { bg: "bg-cyan-50", text: "text-cyan-700", ring: "ring-cyan-700/10" },
};

const Albums = ({ params }: { params: { albumid: string } }) => {
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [albumDetails, setAlbumDetails] = useState<AlbumDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const user = useContext(UserContext);
  const subcriptionAvailable = user?.user?.subscriptionAvailable;

  useEffect(() => {
    const albumIdParams = params.albumid;
    try {
      const decodedAlbumId = atob(albumIdParams);
      setAlbumId(decodedAlbumId);
    } catch (e) {
      setError("Invalid Url");
    }
  }, [params.albumid]);

  const fetchAlbumDetails = async (albumId: string) => {
    try {
      const response = await apiGet(
        `/api/albums/getAlbumsDetails?albumId=${albumId}`
      );

      if (response.data) {
        setAlbumDetails(response.data);
        setIsLoading(false);
      } else {
        setError("Invalid Url");
      }
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  useEffect(() => {
    if (albumId) {
      fetchAlbumDetails(albumId);
    }
  }, [albumId]);

  const onFinalSubmit = () => {
    setIsDialogOpen(true);
  };

  const handleContinue = async () => {
    const payload = {
      id: albumId,
      status: AlbumProcessingStatus.Processing,
      comment: "",
    };

    try {
      const response = await apiPost("/api/albums/updateStatus", payload);

      if (response.success) {
        toast.success("Thank you! Your album(s) are currently being processed");
        // check it
        if (albumDetails) {
          setAlbumDetails((prevDetails) =>
            prevDetails
              ? {
                  ...prevDetails,
                  status: AlbumProcessingStatus.Processing,
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

  if (error) {
    return <ErrorSection message="Invalid Url" />;
  }

  return (
    <div>
      {user?.user?.subscriptionAvailable !== undefined &&
        !subcriptionAvailable && (
          <div className="mt-4 mb-2">
            <SubscriptionEndAlert handleSubscriptionEndAlert={() => {}} />
          </div>
        )}

      <div className={Style.albumContainer}>
        <div className={Style.albumThumbnailContainer}>
          {albumDetails && albumDetails.thumbnail && (
            <a
              href={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${albumId}ba3/cover/${albumDetails.thumbnail}`}
              download={albumDetails.thumbnail as string}
              rel="noreferrer"
              className="w-full"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${albumId}ba3/cover/${albumDetails.thumbnail}`}
                alt="album thumbnail"
                width={480}
                height={480}
                className={Style.albumThumbnail}
              />
            </a>
          )}
        </div>

        <div className={`p-3 border rounded ${Style.albumDetails}`}>
          {albumDetails && (
            <div style={{ width: "100%" }}>
              <AlbumStatus
                status={albumDetails.status}
                comment={albumDetails.comment ?? ""}
              />
            </div>
          )}

          <div className=" flex items-center justify-between w-full mb-1 ">
            <h2 className={`w-[60%] text-wrap ${Style.albumTitle}`}>
              {albumDetails && albumDetails.title}
            </h2>

            <div className="w-[40%]">
              <div className="flex items-center justify-between w-full gap-1  rounded">
                {subcriptionAvailable &&
                  albumId &&
                  albumDetails &&
                  (albumDetails.status === AlbumProcessingStatus.Draft ||
                    albumDetails.status === AlbumProcessingStatus.Rejected) && (
                    <>
                      {/* Add Track Button - First and Redesigned */}
                      <Link
                        href={`/albums/addtrack/${btoa(
                          albumId as string
                        )}?label=${btoa(albumDetails.labelId as string)}`}
                        className={`btn ${Style.albumAddTrack} flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded`}
                      >
                        <i className="bi bi-plus-circle text-lg"></i>
                        <span>New Track</span>
                      </Link>

                      {/* Edit Button */}
                      <Link
                        href={`/albums/edit/${btoa(albumId as string)}`}
                        className={`btn ${Style.albumEditBtn} flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded`}
                      >
                        <i className="bi bi-pencil-square text-lg"></i>
                        <span>Edit Album</span>
                      </Link>

                      {/* Delete Button */}
                      <DeleteButton albumId={albumId} />
                    </>
                  )}
              </div>
            </div>
          </div>

          <p className={`${Style.albumArtist} mb-2`}>
            {albumDetails && albumDetails.artist}
          </p>

          <div className="flex mb-3">
            {albumDetails &&
              albumDetails.tags.map((tag) => {
                const colors = tagColorMap[tag] || {
                  bg: "bg-gray-50",
                  text: "text-gray-700",
                  ring: "ring-gray-700/10",
                };
                return (
                  <span
                    key={tag}
                    className={`me-2 inline-flex items-center rounded-md ${colors.bg} ${colors.text} px-2 py-1 text-xs font-medium ring-1 ring-inset ${colors.ring}`}
                  >
                    {tag}
                  </span>
                );
              })}
          </div>

          <ul className={Style.albumInfoList}>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Genre:{" "}
              </span>
              {albumDetails?.genre}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Language:{" "}
              </span>
              {albumDetails?.language}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                UPC:{" "}
              </span>
              {albumDetails?.upc}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Release Date:{" "}
              </span>
              {albumDetails?.releasedate
                ? new Date(albumDetails.releasedate).toLocaleDateString(
                    "en-IN",
                    { year: "numeric", month: "long", day: "numeric" }
                  )
                : ""}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                C Line:{" "}
              </span>
              {albumDetails ? `© ${albumDetails.cline}` : ""}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Submission Date: {" "}
              </span>
              {albumDetails?.date
                ? new Date(albumDetails.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </li>
            <li className={`mb-2 ${Style.albumInfoItem}`}>
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                P Line:{" "}
              </span>
              {albumDetails ? `℗ ${albumDetails.pline}` : ""}
            </li>
          </ul>

          <hr className="w-full border-t border-gray-300 my-4" />

          {subcriptionAvailable && (
            <div
              className={`flex flex-wrap items-center gap-4 ${Style.btnGroup}  w-[100%]`}
            >
              {albumDetails &&
                (albumDetails.status === AlbumProcessingStatus.Draft ||
                  albumDetails.status === AlbumProcessingStatus.Rejected) &&
                albumDetails.totalTracks > 0 && (
                  <button
                    type="button"
                    className={`w-[100%] text-md text-white font-semibold py-3 px-4 rounded  text-center bg-green-500 hover:bg-green-600 transition-colors duration-200`}
                    onClick={onFinalSubmit}
                  >
                    <i className="me-2 bi bi-send-fill text-lg"></i> Final
                    Submit
                  </button>
                )}

              {albumId &&
                albumDetails &&
                (albumDetails.status === AlbumProcessingStatus.Approved ||
                  albumDetails.status === AlbumProcessingStatus.Live) && (
                  <Link
                    href={`/marketing/add/${btoa(
                      albumId as string
                    )}?albumname=${encodeURIComponent(albumDetails?.title)}`}
                    className={`mt-4 mb-2 btn ${Style.albumAddTrack} p-3`}
                  >
                    <i className="me-2 bi bi-megaphone"></i>
                    Marketing
                  </Link>
                )}

              {albumId &&
                albumDetails &&
                (albumDetails.status === AlbumProcessingStatus.Approved ||
                  albumDetails.status === AlbumProcessingStatus.Live) && (
                  <ContentDeliverySheet
                    contentTitle={albumDetails.title}
                    approvalDate={albumDetails.updatedAt}
                  />
                )}
            </div>
          )}
        </div>
      </div>

      {/* list of tracks  */}

      {albumDetails && albumDetails.totalTracks > 0 ? (
        albumId && (
          <TrackProvider>
            <TrackSection albumId={albumId} />
          </TrackProvider>
        )
      ) : (
        <div className="mt-5 pt-4">
          <h1 className="text-center text-2xl mt-5">No track found</h1>
        </div>
      )}

      {/* {albumId && <TrackSection albumId={albumId} />} */}

      <ConfirmationDialog
        show={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContinue={handleContinue}
        title="Are You Sure ?"
        description="Please note that once you submit your final details, you will not be able to make any further changes."
      />

      {/* list of tracks  */}
    </div>
  );
};

export default Albums;
