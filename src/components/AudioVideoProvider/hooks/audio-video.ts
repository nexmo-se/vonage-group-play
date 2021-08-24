import { AudioVideoContext } from "../contexts/audio-video";
import { useContext } from "react";

export function useAudioVideo () {
  return useContext(AudioVideoContext);
}