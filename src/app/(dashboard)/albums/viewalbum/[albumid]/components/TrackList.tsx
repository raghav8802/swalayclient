import React, { useEffect, useState } from "react";
import Style from "../../../../../styles/ViewAlbums.module.css";
import { apiGet } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";
import { useTrackContext } from "@/context/TrackContext";


interface Track {
  albumId: string;
  audioFile: string;
  audioFileWav: string | null;
  composers: string[];
  crbt: string;
  duration: string;
  isrc: string;
  lyricists: string[];
  platformLinks: string | null;
  primarySinger: string;
  producers: string[];
  singers: string[];
  songName: string;
  trackOrderNumber: number | null;
  category: string;
  trackType: string;
  version: string;
  _id: string;
}


interface TrackListProps {
  albumId: string;
  //eslint-disable-next-line no-unused-vars
  onTrackClick: (trackId: string) => void;
}

// Converts seconds to MM:SS format
const formatDuration = (duration: string | number) => {
  const totalSeconds = Math.floor(Number(duration));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};


const TrackList: React.FC<TrackListProps> = ({ albumId, onTrackClick }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { activeTrackId, setActiveTrackId } = useTrackContext();

  // Fetch all tracks by albumId
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await apiGet(
          `/api/track/getTracks?albumId=${albumId}`
        );
        if (response.data && response.data.length > 0) {
          const reversedTracks = response.data.reverse(); // Reverse the tracks array
          setTracks(reversedTracks);
          
          // Only set the first track if we don't already have an active track
          const firstTrackId = reversedTracks[0]._id;
          if (!activeTrackId) {
            setActiveTrackId(firstTrackId);
            onTrackClick(firstTrackId);
          }
        } else {
          setTracks([]);
        }
      } catch (error) {
        toast.error("Internal server error");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTracks();
  }, [albumId, setActiveTrackId, onTrackClick, activeTrackId]);

  const handleTrackClick = (trackId: string) => {
    setActiveTrackId(trackId);
    onTrackClick(trackId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ul className={`mt-3 ${Style.trackList}`}>
      {tracks.length > 0 ? (
        tracks.map((track, index) => {
          return (
            <li
              key={track._id}
              className={`mb-4 ${Style.trackItem} ${
                activeTrackId === track._id ? Style.active : ""
              }`}
              onClick={() => handleTrackClick(track._id)}
            >
              <span
                className={`me-2 ${Style.trackItemNumber} ${
                  activeTrackId === track._id ? Style.trackItemNumberActive : ""
                }`}
              >
                {String(index + 1).padStart(2, "0")}.
              </span>
              <div
                className={`me-3 ${Style.trackItemIconBox} ${
                  activeTrackId === track._id ? Style.trackItemIconBoxActive : ""
                }`}
              >
                <i
                  className={`bi bi-music-note ${
                    activeTrackId === track._id
                      ? Style.trackItemIconBoxIconActive
                      : ""
                  }`}
                ></i>
              </div>
              <div className={Style.trackItemInfo}>
                <div>
                  <p
                    className={` ${Style.trackItemTrackName} ${
                      activeTrackId === track._id
                        ? Style.trackItemTrackNameActive
                        : ""
                    }`}
                  >
                    {track.songName}
                  </p>
                  <p className={`${Style.trackItemTrackSingerName}`}>
                    {track.primarySinger}
                  </p>
                </div>
                <div className={Style.controllers}>
                  <div className={Style.controllersItem}>
                    {track && track.category && (
                      <span
                        className="me-2 inline-flex items-center rounded-md bg-purple-50 px-2 py-1 font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 "
                        style={{ fontSize: "12px" }}
                      >
                        {track.category}
                      </span>
                    )}
                  </div>
                  <div className={Style.controllersItem}>
                    <span>
                      <i className={`bi bi-stopwatch ${Style.stopwatchIcon}`}></i>{" "}
                      {formatDuration(track.duration)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full mb-5">
          <i className="bi bi-music-note-list text-4xl text-gray-400 mb-3"></i>
            <p className="text-gray-500 text-lg">No tracks available for this album</p>
        </div>
       
      )}
    </ul>
  );
};

export default TrackList;
