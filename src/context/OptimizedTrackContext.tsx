import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from "react";

// ✅ Split contexts to reduce re-render scope
const TrackDataContext = createContext<TrackData | null>(null);
const TrackActionsContext = createContext<TrackActions | null>(null);

interface TrackData {
  activeTrackId: string | null;
  audioInfo: {
    songName: string;
    songUrl: string;
  };
  showTrackDetails: boolean;
  showAudioPlayer: boolean;
}

/* eslint-disable no-unused-vars */
interface TrackActions {
  setActiveTrackId: (_id: string | null) => void;
  setAudioInfo: (_info: { songName: string; songUrl: string }) => void;
  setShowTrackDetails: (_show: boolean) => void;
  setShowAudioPlayer: (_show: boolean) => void;
}
/* eslint-enable no-unused-vars */

interface TrackProviderProps {
  children: ReactNode;
}

export const OptimizedTrackProvider: React.FC<TrackProviderProps> = ({ children }) => {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [audioInfo, setAudioInfo] = useState({
    songName: "",
    songUrl: ""
  });
  const [showTrackDetails, setShowTrackDetails] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  // ✅ Move useCallback to top level (fixing React hooks violation)
  const handleSetActiveTrackId = useCallback((id: string | null) => setActiveTrackId(id), []);
  const handleSetAudioInfo = useCallback((info: { songName: string; songUrl: string }) => setAudioInfo(info), []);
  const handleSetShowTrackDetails = useCallback((show: boolean) => setShowTrackDetails(show), []);
  const handleSetShowAudioPlayer = useCallback((show: boolean) => setShowAudioPlayer(show), []);

  // ✅ Memoize track data to prevent unnecessary re-renders
  const trackData = useMemo<TrackData>(() => ({
    activeTrackId,
    audioInfo,
    showTrackDetails,
    showAudioPlayer,
  }), [activeTrackId, audioInfo, showTrackDetails, showAudioPlayer]);

  // ✅ Memoize actions to prevent re-creation
  const trackActions = useMemo<TrackActions>(() => ({
    setActiveTrackId: handleSetActiveTrackId,
    setAudioInfo: handleSetAudioInfo,
    setShowTrackDetails: handleSetShowTrackDetails,
    setShowAudioPlayer: handleSetShowAudioPlayer,
  }), [handleSetActiveTrackId, handleSetAudioInfo, handleSetShowTrackDetails, handleSetShowAudioPlayer]);

  return (
    <TrackDataContext.Provider value={trackData}>
      <TrackActionsContext.Provider value={trackActions}>
        {children}
      </TrackActionsContext.Provider>
    </TrackDataContext.Provider>
  );
};

// ✅ Separate hooks for data and actions
export const useTrackData = (): TrackData => {
  const context = useContext(TrackDataContext);
  if (!context) {
    throw new Error('useTrackData must be used within OptimizedTrackProvider');
  }
  return context;
};

export const useTrackActions = (): TrackActions => {
  const context = useContext(TrackActionsContext);
  if (!context) {
    throw new Error('useTrackActions must be used within OptimizedTrackProvider');
  }
  return context;
};

// ✅ Combined hook for backwards compatibility (use sparingly)
export const useOptimizedTrackContext = () => {
  const data = useTrackData();
  const actions = useTrackActions();
  
  return {
    ...data,
    ...actions,
  };
}; 