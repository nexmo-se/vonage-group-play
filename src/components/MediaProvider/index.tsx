/**
 * Sending with this protocol
 * type-mediaType-command
 *   type can be media or message
 *   mediaType can be mp4 or youtube
 *   command can be anything. The command cannot use `-`, you need to use snake_case
 * The data of the signal must be JSON.stringify({})
 * 
 * This provider depends on OTSession. Therefore, you need to put it under OTSession.
 * 
 */
import lodash from "lodash";
import { MediaContext } from "./contexts/media";
import { Connection } from "@opentok/client";
import { ConnectionCreatedEvent } from "components/OT/types/OTSession";
import {
  BasicSignalCallbackOptions,
  BroadcastCurrentTimeOptions,
  BroadcastPauseOptions,
  BroadcastPlayOptions,
  BroadcastUrlOptions,
  BroadcastVolumeChangeOptions,
  MediaState,
  MediaUserType,
  SignalEvent
} from "./types";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "components/OT";

interface MediaProviderProps {
  children: any;
}

const MAX_TIME_DIFFERENCE = 2000; // in millis (ms)

function MediaProvider ({ children }: MediaProviderProps) {
  const [mediaUrl, setMediaUrl] = useState<string>();
  const [mediaState, setMediaState] = useState<MediaState>("unavailable");
  const [userType, setUserType] = useState<MediaUserType>("no-media");
  const [acks, setAcks] = useState<Connection[]>([]);

  // Exclusively for subscriber.
  // It means, below state is being use by subscriber only.
  const [player, setPlayer] = useState<HTMLVideoElement>();
  const [publisher, setPublisher] = useState<Connection>(); // capturing who is the current publisher
  // end of Exclusively for subscribers.

  const { connections, session } = useSession();

  const isOwnConnection = useCallback(
    (from: Connection) => {
      if (!session) return;
      
      // I don't want to receive the signal by myself.
      const myConnection = session.connection;
      if (!myConnection) return false;

      if (myConnection.connectionId === from.connectionId) return true;
      else return false;
    },
    [session]
  )

  /**
   * Called when subscriber ack the media url request
   */
  const handleAckBroadcast = useCallback(
    (from: Connection) => {
      // This callback is exclusively for publisher only
      if (userType !== "publisher") return;

      setAcks(
        (acks) => {
          const newAcks = [...acks, from];
          const uniqAcks = lodash(newAcks).uniqBy("connectionId").value();
          return uniqAcks;
        }
      )
    },
    [userType]
  )

  /**
   * Called when publisher start the player. Subscriber will receive this signal
   */
  const handleBroadcastPlay = useCallback(
    ({ currentTime }) => {
      if (userType !== "subscriber") return;
      // set the player current time
      // and play it
      if (!player) return;

      player.currentTime = currentTime;
      player.play();
    },
    [player, userType]
  )

  /**
   * Called when publisher stop the player. Subscriber will receive this signal
   */
  const handleBroadcastPause = useCallback(
    ({ currentTime }) => {
      if (userType !== "subscriber") return;
      if (!player) return;
      player.pause();
      player.currentTime = currentTime;
    },
    [player, userType]
  )

  const handleBroadcastVolumeChange = useCallback(
    ({ currentTime, volume }) => {
      if (userType !== "subscriber") return;
      if (!player) return;
      player.volume = volume;
      player.currentTime = currentTime;
    },
    [player, userType]
  )

  /**
   * We want to adjust the time if the gap is huge. You can define the gap
   * in the MAX_TIME_DIFFERENCE variable
   */
  const handleBroadcastCurrentTime = useCallback(
    ({ currentTime, isPlaying }) => {
      if (userType !== "subscriber") return;
      if (!player) return;

      const difference = Math.abs(player.currentTime - currentTime);
      if (difference >= (MAX_TIME_DIFFERENCE / 1000)) {
        // adjust the time because of time difference
        player.currentTime = currentTime;
      }

      // In this opportunity as well, I want to check if the subscriber video is playing
      if (player.paused && isPlaying) player.play();
    },
    [userType, player]
  )

  /**
   * We only handle signal that is related to the media sharing. 
   * Furthermore, we will ignore the signal that is not for media sharing.
   */
  const handleSignal = useCallback(
    (event: SignalEvent) => {
      if (!event.type) return;
      const rawData = lodash(event).get("data");
      
      const noLogs = ["signal:media-mp4-broadcast_volume_change", "signal:media-mp4-broadcast_current_time"]
      const ignoreSignal = isOwnConnection(event.from)
      if (ignoreSignal) {
        if (!noLogs.includes(event.type)) {
          console.log(`Ignored ${event.type} signal from ${event.from.connectionId}`);
        }
        return;
      };

      if (!noLogs.includes(event.type)) {
        console.log(`Received ${event.type} signal from ${event.from.connectionId}`);
      }

      const acceptedType = [
        "signal:media-mp4-broadcast_url",
        "signal:media-mp4-broadcast_unpublish",
        "signal:media-mp4-broadcast_play",
        "signal:media-mp4-broadcast_pause",
        "signal:media-mp4-broadcast_volume_change",
        "signal:media-mp4-broadcast_current_time",
        "signal:media-mp4-ack_broadcast",
      ]

      if (!acceptedType.includes(event.type)) return;


      if (event.type === "signal:media-mp4-broadcast_url" && rawData !== undefined) {
        const data = JSON.parse(rawData);
        setMediaUrl(data.url);
        setUserType("subscriber");
        setPublisher(event.from);
      } else if (event.type === "signal:media-mp4-ack_broadcast") {
        // when a connection ack the broadcast, we will change to mediaState to `ready`.
        // It means, all the connections received the mediaUrl and ready to start the player
        handleAckBroadcast(event.from);
      } else if (event.type === "signal:media-mp4-broadcast_play" && rawData !== undefined) {
        const data = JSON.parse(rawData);
        handleBroadcastPlay({ currentTime: data.currentTime });
      } else if (event.type === "signal:media-mp4-broadcast_pause" && rawData !== undefined) {
        const data = JSON.parse(rawData);
        handleBroadcastPause({ currentTime: data.currentTime });
      } else if (event.type === "signal:media-mp4-broadcast_volume_change" && rawData !== undefined) {
        const data = JSON.parse(rawData);
        handleBroadcastVolumeChange({
          currentTime: data.currentTime,
          volume: data.volume
        })
      } else if (event.type === "signal:media-mp4-broadcast_unpublish") {
        setMediaUrl(undefined);
        setUserType("no-media");
        setPublisher(undefined);
        setPlayer(undefined);
        setAcks([]);
      } else if (event.type === "signal:media-mp4-broadcast_current_time" && rawData !== undefined) {
        const data = JSON.parse(rawData);
        handleBroadcastCurrentTime({
          currentTime: data.currentTime,
          isPlaying: data.isPlaying
        });
      }
      
    },
    [
      isOwnConnection,
      handleAckBroadcast,
      handleBroadcastPlay,
      handleBroadcastPause,
      handleBroadcastVolumeChange,
      handleBroadcastCurrentTime
    ]
  )

  function basicSignalCallback ({ err, signalType }: BasicSignalCallbackOptions) {
    if (err) {
      console.log("Signal not sent", err);
    } else {
      console.log("Signal sent: ", signalType);
    }
  }

  /**
   * Publisher will broadcast the url to all subscribers. Even if the userType is not no-media
   * the broadcast will still happen.
   * @returns 
   */
  const broadcastUrl = useCallback(
    (options?: BroadcastUrlOptions) => {
      setUserType(
        (prevUserType) => {
          if (!session) return prevUserType;

          const signalBody = {
            url: mediaUrl,
            type: "mp4",
            currentTime: lodash(options).get("currentTime", 0)
          }

          const signalType = "media-mp4-broadcast_url"
          const signalOptions = lodash({
            type: signalType,
            data: JSON.stringify(signalBody),
            to: lodash(options).get("to")
          }).omitBy(lodash.isNil).value();
    
          try {
            session.signal(
              signalOptions,
              (err) => {
                if (err) throw err;
                else {
                  console.log("Signal sent: ", signalType);
      
                  // This is a case where the publisher is the only publisher
                  if (connections.length === 1) setMediaState("ready");
                }
              }
            );
          } catch (err) {
            console.log("Signal not sent", err);
            return "no-media";
          }
          return "publisher";
        }
      )
    },
    [connections.length, mediaUrl, session]
  )

  /**
   * This function will broadcast to all subscribers for removing current video player.
   */
  function broadcastUnpublish () {
    if (!session) return;
    if (userType !== "publisher") return;

    const signalType = "media-mp4-broadcast_unpublish"
    session.signal(
      { type: signalType },
      (err) => {
        if (err) {
          console.log("Signal not sent", err);
        } else {
          setMediaUrl(undefined);
          setUserType("no-media");
          console.log("Signal sent: ", signalType);
        }
      }
    )

    
  }

  /**
   * Publisher will broadcast to all subscribers that is now playing with the currentTime for sync
   * @param param0 
   * @returns 
   */
  function broadcastPlay ({ currentTime }: BroadcastPlayOptions) {
    if (!session) return;

    const body = { currentTime };
    const signalType = "media-mp4-broadcast_play";
    session.signal(
      {
        type: signalType,
        data: JSON.stringify(body)
      },
      (err) => basicSignalCallback({ err, signalType })
    )
  }

  /**
   * Publisher will broadcast to all subscribers that is now on pause with currentTime for sync
   * @param param0 
   * @returns 
   */
  function broadcastPause ({ currentTime }: BroadcastPauseOptions) {
    if (!session) return;

    const body = { currentTime };
    const signalType = "media-mp4-broadcast_pause";
    session.signal(
      {
        type: signalType,
        data: JSON.stringify(body)
      },
      (err) => basicSignalCallback({ err, signalType })
    )
  }

  /**
   * Publisher will broadcast to all susbcribers that the volume has changed. 
   * Publisher also want to take this opportunity to re-sync the timing.
   * @param param0 
   */
  function broadcastVolumeChange ({ currentTime, volume }: BroadcastVolumeChangeOptions) {
    if (!session) return;
    if (userType !== "publisher") return;

    const body = { currentTime, volume };
    const signalType = "media-mp4-broadcast_volume_change";
    session.signal(
      {
        type: signalType,
        data: JSON.stringify(body)
      },
      (err) => basicSignalCallback({ err, signalType })
    )
  }

  /**
   * Broadcasting the current time. This function is callable by publisher only
   * @param param0 
   */
  function broadcastCurrentTime ({ currentTime, isPlaying }: BroadcastCurrentTimeOptions) {
    if (!session) return;
    if (userType !== "publisher") return;

    const body = { currentTime, isPlaying };
    const signalType = "media-mp4-broadcast_current_time";
    session.signal(
      {
        type: signalType,
        data: JSON.stringify(body)
      },
      (err) => {
        if (err) {
          console.log("Signal not sent", err);
        }
      }
    )
  }

  /**
   * Subscriber will send the broadcast result to the publisher
   * @returns 
   */
  function ackBroadcast () {

    if (!session) return;
    if (!publisher) return;
    if (userType !== "subscriber") return;
    
    const signalType = "media-mp4-ack_broadcast"
    session.signal(
      {
        type: signalType,
        to: publisher
      },
      (err) => {
        if (err) {
          console.log("Signal not sent", err);
        } else {
          console.log("Signal sent:", signalType);
        }
      }
    )
  }

  /**
   * When a new user coming in, we would like to let them know that we have a video
   * ready to be streamed.
   */
  const handleConnectionChange = useCallback(
    (event: ConnectionCreatedEvent) => {
      if (userType !== "publisher") return;
      if (!player) return;

      broadcastUrl({
        to: event.connection,
        currentTime: player.currentTime
      })
    },
    [userType, player, broadcastUrl]
  )

  useEffect(
    () => {
      if (!session) return;
      session.on("signal", handleSignal);

      return function cleanup () {
        if (!session) return;
        session.off("signal", handleSignal);
      }
    },
    [session, handleSignal]
  )

  useEffect(
    () => {
      // Whenever the acks and connections changes
      // change the mediaState
      const intersectionAcks = lodash(connections).intersectionBy(acks, "connectionId").value();

      const totalConnection = connections.length - 1; // minus 1 because we want to ignore our own connection
      if (totalConnection === 0) {
        // No one is here, just show the control
        setMediaState("ready");
      } else if (intersectionAcks.length === totalConnection && intersectionAcks.length !== 0) {
        setMediaState("ready");
      } else {
        setMediaState("unavailable");
      }
    },
    [acks, connections]
  )

  /**
   * Whenever I have a new connections, I need to re-broadcast it.
   * I don't care if they already have media, if they have, we just ignore it
   */
  useEffect(
    () => {
      lodash(connections).forEach(
        (connection) => handleConnectionChange({ connection })
      )
    },
    [connections, handleConnectionChange]
  )

  /**
   * Whenever connection change, we need to readjust the acks list
   */
  useEffect(
    () => {
      setAcks(
        (prevAcks) => {
          const intersectionAcks = lodash(connections).intersectionBy(prevAcks, "connectionId").value();
          return intersectionAcks;
        }
      )
    },
    [connections]
  )

  return (
    <MediaContext.Provider
      value={{
        userType,
        mediaUrl,
        mediaState,
        setMediaUrl,
        setPlayer,
        ackBroadcast,
        broadcastUrl,
        broadcastUnpublish,
        broadcastPlay,
        broadcastPause,
        broadcastVolumeChange,
        broadcastCurrentTime
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}

export { useMedia } from "./hooks/media"
export default MediaProvider;
