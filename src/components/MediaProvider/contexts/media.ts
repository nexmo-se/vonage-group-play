import { Dispatch, SetStateAction } from "react";
import { createContext } from "react";
import {
  BroadcastPauseOptions,
  BroadcastPlayOptions,
  BroadcastVolumeChangeOptions,
  MediaState,
  MediaUserType
} from "../types";

interface MediaContextProps {
  userType: MediaUserType;
  mediaUrl?: string;
  mediaState: MediaState
  setMediaUrl: Dispatch<SetStateAction<string | undefined>>;
  setPlayer: Dispatch<SetStateAction<HTMLVideoElement | undefined>>;
  ackBroadcast: () => void;
  broadcastUrl: () => void;
  broadcastPlay: (args: BroadcastPlayOptions) => void;
  broadcastPause: (args: BroadcastPauseOptions) => void;
  broadcastVolumeChange: (args: BroadcastVolumeChangeOptions) => void;
  broadcastUnpublish: () => void;
}

export const MediaContext = createContext<MediaContextProps>({
  mediaState: "unavailable",
  userType: "no-media"
} as MediaContextProps);
