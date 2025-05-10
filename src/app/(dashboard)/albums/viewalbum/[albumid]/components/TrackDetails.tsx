"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Style from "../../../../../styles/ViewAlbums.module.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";
import ConfirmationDialog from "@/components/ConfirmationDialog";
// import { onShare } from "@/helpers/urlShare";

interface TrackListProps {
  trackId: string;
  // eslint-disable-next-line no-unused-vars
  onFetchDetails: (songName: string, url: string) => void;
}


interface ArtistDetail {
  _id: string;
  artistName: string;
}

interface TrackDetail {
  albumId: string;
  songName: string | null;
  primarySinger: ArtistDetail | null;
  singers: ArtistDetail[] | null;
  composers: ArtistDetail[] | null;
  lyricists: ArtistDetail[] | null;
  producers: ArtistDetail[] | null;
  featuredArtist: string | null;
  audioFile: string | null;
  audioFileWav: string | null;
  isrc: string | null;
  duration: string | null;
  crbt: string | null;
  platformLinks: {
    SpotifyLink: string | null;
    AppleLink: string | null;
    Instagram: string | null;
    Facebook: string | null;
  } | null;
  category: string | null;
  version: string | null;
  trackType: string | null;
  trackOrderNumber: string | null;
  albumStatus: number;
}

const TrackDetails: React.FC<TrackListProps> = ({
  trackId,
  onFetchDetails,
}) => {
  const [trackDetails, setTrackDetails] = useState<TrackDetail | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const audioRef = useRef<HTMLAudioElement>(null);

  const fetchTrackDetails = React.useCallback(async () => {
    try {
      const response = await apiGet(
        `/api/track/getTrackDetails?trackId=${trackId}`
      );
  
      if (response.success) {
        setTrackDetails(response.data);
        const audioUrl = `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${response.data.albumId}ba3/tracks/${response.data.audioFile}`;
        onFetchDetails(response.data.songName, audioUrl);
      }
    } catch {
      toast.error("Internal server error");
    }
  }, [trackId, onFetchDetails]);

  // useEffect(() => {
  //   fetchTrackDetails();
  // }, []);

  useEffect(() => {
    fetchTrackDetails();
  }, [fetchTrackDetails]);

  const downloadRef = useRef<HTMLAnchorElement>(null);

  const handleDownload = () => {
    if (downloadRef.current) {
      downloadRef.current.click();
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch(() => {
        // console.error('Failed to copy URL: ', err);
        toast.error("Failed to copy URL");
      });
  };

  const onDelete = async () => {
    setIsDialogOpen(true);
  };

  const handleContinue = async () => {


    try {
      const response = await apiPost("/api/track/deleteTrack", { trackId });

      if (response.success) {
        toast.success("Success! Your album is deleted");
        window.location.reload();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
 
      toast.error("Internal server error");
    }
  };

  return (
    <div className={`p-1 display-none-mobile ${Style.trackDetails}`}>
      <div className={Style.trackDetailsTop}>
        <h5 className={`mt-3 ${Style.subheading}`}> Track Details</h5>

        <div className={Style.trackDetailsIconGroup}>
          {trackDetails?.audioFile && (
            <i
              className="bi bi-link-45deg"
              onClick={() =>
                handleCopyUrl(
                  `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails.albumId}ba3/tracks/${trackDetails.audioFile}`
                )
              }
            ></i>
          )}

          {trackDetails?.audioFile && (
            <div onClick={handleDownload}>
              {/* Download icon */}
              <i className="bi bi-download"></i>

              {/* Hidden anchor tag to handle download */}
              <a
                ref={downloadRef}
                href={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails.albumId}ba3/tracks/${trackDetails.audioFile}`}
                download={trackDetails.audioFile as string}
                style={{ display: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>

              {/* Hidden audio tag (if you still need to keep it) */}
              <audio style={{ display: "none" }} controls>
                <source
                  src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails.albumId}ba3/tracks/${trackDetails.audioFile}`}
                  type="audio/mpeg"
                />
              </audio>
            </div>
          )}

          {trackDetails &&
            trackDetails.albumStatus !== 4 &&
            trackDetails.albumStatus !== 1 &&
            trackDetails.albumStatus !== 2 && (
              <div>
                <Link href={`/albums/edittrack/${btoa(trackId)}`}>
                  <i className="bi bi-pencil-square" title="Edit track"></i>
                </Link>
                <button onClick={onDelete}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            )}
        </div>
      </div>
      <div className={`mt-2 ${Style.currentTrackDetails} `}>
        {/* <p className={`mb-3 ${Style.trackInfoTrackName}`}><span className={Style.trackNameLable}>Track Name: </span> Lost in Mountain</p> */}
        <p className={`mb-3 ${Style.trackInfoTrackName}`}>
          <i className={`bi bi-music-note-list ${Style.trackNameIcon}`}></i>
          {trackDetails && trackDetails?.songName}
        </p>

        {trackDetails && (
          <div className="flex items-center justify-start">
            <Link
              className="px-3 py-2 bg-cyan-600 text-white rounded my-3"
              href={`/albums/tracks/addLyrics/${btoa(
                trackId ?? ""
              )}?trackname=${encodeURIComponent(
                trackDetails?.songName ?? ""
              )}&trackurl=${encodeURIComponent(
                trackDetails?.audioFile
                  ? `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${trackDetails?.albumId}ba3/tracks/${trackDetails.audioFile}`
                  : ""
              )}`}
            >
              Add Lyrics <i className="bi bi-pen-fill"></i>
            </Link>
          </div>
        )}

        <div className="mt-3">
          <Tabs defaultValue="track" className="w-100">
            <TabsList>
              <TabsTrigger value="track">Track Info</TabsTrigger>
              <TabsTrigger value="publishiling">Publishing Info</TabsTrigger>
            </TabsList>
            <TabsContent value="track">
              <div className={`mt-2  ${Style.trackInfoListContainer}`}>
                <ul className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md space-y-4">
                  {/* ISRC */}
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      ISRC
                    </span>
                    <div className="text-gray-800 dark:text-gray-200 font-medium">
                      {trackDetails && trackDetails.isrc}
                    </div>
                  </li>

                  {/* Category */}
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      Category
                    </span>
                    <div className="text-gray-800 dark:text-gray-200 font-medium">
                      {trackDetails && trackDetails.category}
                    </div>
                  </li>

                  {/* TrackType */}
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      Track Type
                    </span>
                    <div className="text-gray-800 dark:text-gray-200 font-medium">
                      {trackDetails && trackDetails.trackType}
                    </div>
                  </li>

                  {/* Version */}
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      Version
                    </span>
                    <div className="text-gray-800 dark:text-gray-200 font-medium">
                      {trackDetails && trackDetails.version}
                    </div>
                  </li>

                  {/* Caller Tune */}
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      Caller Tune
                    </span>
                    <div className="text-gray-800 dark:text-gray-200 font-medium">
                      {trackDetails && trackDetails.crbt}
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="publishiling">
              <div className={`mt-2  ${Style.trackInfoListContainer}`}>
                <ul className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md space-y-4">
                  
                  {/* Primary Singer with special highlight */}
                  {trackDetails?.primarySinger && (
                    <li className="flex flex-col">
                      {/* <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Artist</span> */}
                      <div className="flex items-center">
                        <Link
                          href={`/artists/${btoa(
                            trackDetails.primarySinger._id
                          )}`}
                          className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition duration-200"
                        >
                          {trackDetails.primarySinger.artistName}
                        </Link>
                      </div>
                    </li>
                  )}

                  {/* Singers */}
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      Singer
                    </span>
                    <div className="flex flex-wrap items-center">
                      {trackDetails?.singers?.map((singer, index) => (
                        <span
                          key={singer._id}
                          className="inline-flex items-center"
                        >
                          <Link
                            href={`/artists/${btoa(singer._id)}`}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition duration-200"
                          >
                            {singer.artistName}
                          </Link>
                          {index < (trackDetails.singers?.length ?? 0) - 1 && (
                            <span className="mx-1 text-gray-400">&middot;</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </li>

                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      Featured
                    </span>
                    <div className="flex flex-wrap items-center">

                      {trackDetails?.featuredArtist && (
                        <span
                          className="inline-flex items-center"
                        >
                            {trackDetails.featuredArtist}   
                        </span>
                      )}

                    </div>
                  </li>

                  {/* Lyricists */}
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      Lyricist
                    </span>
                    <div className="flex flex-wrap items-center">
                      {trackDetails?.lyricists?.map((lyricist, index) => (
                        <span
                          key={lyricist._id}
                          className="inline-flex items-center"
                        >
                          <Link
                            href={`/artist/${lyricist._id}`}
                            className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 transition duration-200"
                          >
                            {lyricist.artistName}
                          </Link>
                          {index <
                            (trackDetails.lyricists?.length ?? 0) - 1 && (
                            <span className="mx-1 text-gray-400">&middot;</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </li>

                  {/* Composers */}
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      Composer
                    </span>
                    <div className="flex flex-wrap items-center">
                      {trackDetails?.composers?.map((composer, index) => (
                        <span
                          key={composer._id}
                          className="inline-flex items-center"
                        >
                          <Link
                            href={`/artists/${btoa(composer._id)}`}
                            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition duration-200"
                          >
                            {composer.artistName}
                          </Link>
                          {index <
                            (trackDetails.composers?.length ?? 0) - 1 && (
                            <span className="mx-1 text-gray-400">&middot;</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </li>

                  {/* Music Producers */}
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      Music Producer
                    </span>
                    <div className="flex flex-wrap items-center">
                      {trackDetails?.producers?.map((producer, index) => (
                        <span
                          key={producer._id}
                          className="inline-flex items-center"
                        >
                          <Link
                            href={`/artists/${btoa(producer._id)}`}
                            className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 transition duration-200"
                          >
                            {producer.artistName}
                          </Link>
                          {index <
                            (trackDetails.producers?.length ?? 0) - 1 && (
                            <span className="mx-1 text-gray-400">&middot;</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* <div className={`mt-4 flex  ${Style.socialGroup}`}> */}

        {/* <div className={`mt-4 flex `}>
          <Link href={"/"}>
            <Image
              src={"/images/image.png"}
              width={50}
              height={50}
              alt="music platfrom"
            />
          </Link>
          <Link href={"/"} className="ms-3">
            <Image
              src={"/images/spotify.png"}
              width={50}
              height={50}
              alt="music platfrom"
            />
          </Link>
        </div> */}

        <ConfirmationDialog
          confrimationText="Delete"
          show={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onContinue={handleContinue}
          title="Are You Sure ?"
          description="Once you delete this track, you will no longer be able to retrieve the tracks associated with it."
        />
      </div>
    </div>
  );
};

export default TrackDetails;
