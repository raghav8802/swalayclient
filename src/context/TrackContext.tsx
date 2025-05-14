import React, { createContext, useState, useContext, ReactNode } from "react";

interface TrackContextType {
  activeTrackId: string | null;
  // eslint-disable-next-line no-unused-vars
  setActiveTrackId: (id: string | null) => void;
  audioInfo: {
    songName: string;
    songUrl: string;
  };
  // eslint-disable-next-line no-unused-vars
  setAudioInfo: (info: { songName: string; songUrl: string }) => void;
  showTrackDetails: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowTrackDetails: (show: boolean) => void;
  showAudioPlayer: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowAudioPlayer: (show: boolean) => void;
}

const defaultContext: TrackContextType = {
  activeTrackId: null,
  setActiveTrackId: () => {},
  audioInfo: {
    songName: "",
    songUrl: ""
  },
  setAudioInfo: () => {},
  showTrackDetails: false,
  setShowTrackDetails: () => {},
  showAudioPlayer: false,
  setShowAudioPlayer: () => {}
};

const TrackContext = createContext<TrackContextType>(defaultContext);

export const useTrackContext = () => useContext(TrackContext);

interface TrackProviderProps {
  children: ReactNode;
}

export const TrackProvider: React.FC<TrackProviderProps> = ({ children }) => {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [audioInfo, setAudioInfo] = useState({
    songName: "",
    songUrl: ""
  });
  const [showTrackDetails, setShowTrackDetails] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  return (
    <TrackContext.Provider
      value={{
        activeTrackId,
        setActiveTrackId,
        audioInfo,
        setAudioInfo,
        showTrackDetails,
        setShowTrackDetails,
        showAudioPlayer,
        setShowAudioPlayer
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export default TrackContext; 