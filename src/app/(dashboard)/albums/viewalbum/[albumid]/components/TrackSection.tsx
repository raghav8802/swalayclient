"use client";
import React, { useEffect } from "react";
import TrackList from "./TrackList";
import Style from "../../../../../styles/ViewAlbums.module.css";
import TrackDetails from "./TrackDetails";
import AudioPlayer from "./AudioPlayer";
import { useTrackContext } from "@/context/TrackContext";

interface TrackSectionProps {
  albumId: string;
}

const TrackSection: React.FC<TrackSectionProps> = ({ albumId }) => {
  const { 
    activeTrackId, 
    setActiveTrackId,
    showTrackDetails,
    setShowTrackDetails,
    showAudioPlayer,
    audioInfo 
  } = useTrackContext();

  const handleTrackClick = (trackId: string) => {
    setActiveTrackId(trackId);
    setShowTrackDetails(true);
  };

  // Ensure we render audio player when needed
  useEffect(() => {
    if (activeTrackId && !showTrackDetails) {
      setShowTrackDetails(true);
    }
  }, [activeTrackId, showTrackDetails, setShowTrackDetails]);

  return (
    <div>
      <div className={`mt-3 ${Style.trackContainer}`}>
        <div className={`p-1 ${Style.tracksContainer}`}>
          <div className={`mt-3 ${Style.trackDetailsTop}`}>
            <h5 className={Style.subheading}>Tracks</h5>
          </div>
          
          {albumId && (
            <TrackList albumId={albumId} onTrackClick={handleTrackClick} />
          )}
        </div>

        
        {showTrackDetails && activeTrackId && (
          <TrackDetails trackId={activeTrackId} />
        )}
        

      </div>

      {showAudioPlayer && audioInfo.songUrl && (
        <AudioPlayer trackName={audioInfo.songName} audioSrc={audioInfo.songUrl} />
      )}
    </div>
  );
};

export default TrackSection;
