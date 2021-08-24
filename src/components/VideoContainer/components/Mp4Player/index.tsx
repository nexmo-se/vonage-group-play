import lodash from "lodash";

import { OTExternalVideo } from "components/OT";
import { OTExternalVideoRef } from "components/OT/types/OTExternalVideo";

import { useMedia } from "components/MediaProvider";
import { useRef } from "react";
import { useEffect } from "react";

function Mp4Player () {
  const playerRef = useRef<OTExternalVideoRef>(null);
  const {
    mediaState,
    mediaUrl,
    userType,
    setPlayer,
    ackBroadcast,
    broadcastUrl,
    broadcastPlay,
    broadcastPause,
    broadcastVolumeChange,
    broadcastCurrentTime
  } = useMedia();

  /**
   * We are assuming if userType is no-media, it means the user is
   * initiating the media share
   */
  function handleCanPlay () {
    if (userType === "no-media") broadcastUrl();
    else if (userType === "subscriber") ackBroadcast();
  }

  /**
   * The idea here is everytime the video is played we will re-sync the time
   * @returns 
   */
  function handlePlay () {
    if (mediaState !== "ready") return;
    if (userType !== "publisher") return;

    const player = playerRef.current?.getVideoElement();
    if (!player) return;

    broadcastPlay({ currentTime: player.currentTime });
  }

  /**
   * The idea here is everytime the video is paused, we will re-sync the time
   */
  function handlePause () {
    if (mediaState !== "ready") return;
    if (userType !== "publisher") return;

    const player = playerRef.current?.getVideoElement();
    if (!player) return;

    broadcastPause({ currentTime: player.currentTime });
  }

  /**
   * We need to tell the subscriber is the volume has changed.
   * We will use this opportunity to re-sync the time as well.
   */
  function handleVolumeChange () {
    if (mediaState !== "ready") return;
    if (userType !== "publisher") return;

    const player = playerRef.current?.getVideoElement();
    if (!player) return;

    broadcastVolumeChange({
      currentTime: player.currentTime,
      volume: (player.muted)? 0: player.volume
    })
  }

  /**
   * Will update the currentTime. However, only publisher can fire this event
   * @returns 
   */
  function handleTimeUpdate () {
    if (mediaState !== "ready") return;
    if (userType !== "publisher") return;

    const player = playerRef.current?.getVideoElement();
    if (!player) return;

    broadcastCurrentTime({
      currentTime: player.currentTime,
      isPlaying: !player.paused
    })
  }

  useEffect(
    () => {
      const player = playerRef.current?.getVideoElement()
      setPlayer(player);
    },
    [setPlayer]
  )
  
  if (!mediaUrl) return null;
  return (
    <OTExternalVideo
      ref={playerRef}
      videoSource={mediaUrl}
      // We only allow for publisher to have the controls
      showControls={mediaState === "ready" && userType === "publisher"}
      eventHandlers={{
        canPlay: handleCanPlay,
        play: handlePlay,
        pause: handlePause,
        volumeChange: handleVolumeChange,
        timeUpdate: lodash.debounce(handleTimeUpdate, 250)
      }}
    />
  )
}

export default Mp4Player;
