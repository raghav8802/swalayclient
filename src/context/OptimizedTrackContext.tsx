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

interface TrackActions {
  setActiveTrackId: (id: string | null) => void;
  setAudioInfo: (info: { songName: string; songUrl: string }) => void;
  setShowTrackDetails: (show: boolean) => void;
  setShowAudioPlayer: (show: boolean) => void;
}

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

  // ✅ Memoize track data to prevent unnecessary re-renders
  const trackData = useMemo<TrackData>(() => ({
    activeTrackId,
    audioInfo,
    showTrackDetails,
    showAudioPlayer,
  }), [activeTrackId, audioInfo, showTrackDetails, showAudioPlayer]);

  // ✅ Memoize actions to prevent re-creation
  const trackActions = useMemo<TrackActions>(() => ({
    setActiveTrackId: useCallback((id: string | null) => setActiveTrackId(id), []),
    setAudioInfo: useCallback((info: { songName: string; songUrl: string }) => setAudioInfo(info), []),
    setShowTrackDetails: useCallback((show: boolean) => setShowTrackDetails(show), []),
    setShowAudioPlayer: useCallback((show: boolean) => setShowAudioPlayer(show), []),
  }), []);

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