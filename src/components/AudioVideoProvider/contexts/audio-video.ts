import { createContext, Dispatch, SetStateAction } from "react";

interface AudioVideoContextProps {
  hasAudio: boolean;
  hasVideo: boolean;
  setHasAudio: Dispatch<SetStateAction<boolean>>;
  setHasVideo: Dispatch<SetStateAction<boolean>>;
}

export const AudioVideoContext = createContext<AudioVideoContextProps>({
  hasAudio: true,
  hasVideo: true
} as AudioVideoContextProps);