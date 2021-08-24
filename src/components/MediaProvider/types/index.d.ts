import { Connection, OTError } from "@opentok/client";

export type MediaUserType = "publisher" | "subscriber" | "no-media";
export type MediaState = "unavailable" | "ready";
export type SignalType = 
  "media-mp4-broadcast_url" |
  "media-mp4-broadcast_unpublish" |
  "media-mp4-broadcast_play" |
  "media-mp4-broadcast_pause" |
  "media-mp4-broadcast_volume_change" |
  "media-mp4-broadcast_current_time" |
  "media-mp4-ack_broadcast"
;

export type SignalEvent = {
  type?: string;
  data?: string;
  from: Connection
}

export type SyncTime = {
  currentTime: number;
}

export type BroadcastPlayOptions = SyncTime;
export type BroadcastPauseOptions = SyncTime;
export type BroadcastVolumeChangeOptions = SyncTime & {
  volume: number;
}

export type BroadcastUrlOptions = {
  to?: Connection;
  currentTime?: number;
  force?: boolean;
}

export type BroadcastCurrentTimeOptions = {
  currentTime: number;
  isPlaying: boolean;
}

export type BasicSignalCallbackOptions = {
  err?: OTError,
  signalType: SignalType;
}