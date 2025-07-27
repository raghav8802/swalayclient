import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Style from "../../../../../styles/ViewAlbums.module.css";
import { useTrackContext } from "@/context/TrackContext";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  trackName: string;
  audioSrc: string;
}

// ✅ Memoized AudioPlayer to prevent unnecessary re-renders
const AudioPlayer: React.FC<AudioPlayerProps> = React.memo(({ trackName, audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { audioInfo } = useTrackContext();

  // ✅ Memoized actual values to prevent recalculation
  const actualTrackName = useMemo(() => 
    audioInfo.songName || trackName, 
    [audioInfo.songName, trackName]
  );
  
  const actualAudioSrc = useMemo(() => 
    audioInfo.songUrl || audioSrc, 
    [audioInfo.songUrl, audioSrc]
  );

  useEffect(() => {
    // Reset playback when trackName changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [actualTrackName, actualAudioSrc]);
  

  // ✅ Memoized callbacks to prevent re-creation
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleRangeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  // ✅ Memoized time formatting function
  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  const onEnded = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  // ✅ Memoized formatted times
  const formattedCurrentTime = useMemo(() => formatTime(currentTime), [formatTime, currentTime]);
  const formattedDuration = useMemo(() => formatTime(duration), [formatTime, duration]);

  // ✅ Memoized truncated track name
  const displayTrackName = useMemo(() => {
    return actualTrackName.length > 50
      ? `${actualTrackName.substring(0, 50)}...`
      : actualTrackName;
  }, [actualTrackName]);


  return (
    <div className={`border ${Style.MusicPlayerBox}`}>
      <div className={Style.MusicPlayercontainer}>
        <div className={Style.trackControllerButtonGroup}>
          <div
            className={`mx-5 ${Style.trackControllerMusicPlayRound}`}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} />
            )}
          </div>
        </div>

        <div className={Style.rangeContainer}>
          <span className="me-3">{formattedCurrentTime}</span>
          <input
            type="range"
            name="progress"
            min="0"
            max={duration}
            step="1"
            value={currentTime}
            onChange={handleRangeChange}
            className={Style.progress}
            id="myRange"
          />
          <span className="ms-3">{formattedDuration}</span>
        </div>

        <p className={`m-0 ${Style.playingTrack}`}>
          {displayTrackName}
        </p>

        <audio
          ref={audioRef}
          src={actualAudioSrc}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
        />
      </div>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
