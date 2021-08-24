import { AudioVideoContext } from "./contexts/audio-video";
import { useState } from "react";

interface AudioVideoProviderProps {
  children?: any;
}

function AudioVideoProvider ({ children }: AudioVideoProviderProps) {
  const [hasAudio, setHasAudio] = useState<boolean>(true);
  const [hasVideo, setHasVideo] = useState<boolean>(true);

  return (
    <AudioVideoContext.Provider
      value={{
        hasAudio,
        hasVideo,
        setHasAudio,
        setHasVideo
      }}
    >
      {children}
    </AudioVideoContext.Provider>
  )
}

export { useAudioVideo } from "./hooks/audio-video";
export default AudioVideoProvider;
