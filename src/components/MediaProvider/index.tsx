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
import {
  BasicSignalCallbackOptions,
  BroadcastPauseOptions,
  BroadcastPlayOptions,
  BroadcastVolumeChangeOptions,
  MediaState,
  MediaUserType,
  SignalEvent
} from "./types";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "components/OT";
import { Connection } from "@opentok/client";

interface MediaProviderProps {
  children: any;
}

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
   * We only handle signal that is related to the media sharing. 
   * Furthermore, we will ignore the signal that is not for media sharing.
   */
  const handleSignal = useCallback(
    (event: SignalEvent) => {
      if (!event.type) return;
      const rawData = lodash(event).get("data");
      
      const ignoreSignal = isOwnConnection(event.from)
      if (ignoreSignal) {
        console.log(`Ignored ${event.type} signal from ${event.from.connectionId}`);
        return;
      };
      console.log(`Received ${event.type} signal from ${event.from.connectionId}`);

      const acceptedType = [
        "signal:media-mp4-broadcast_url",
        "signal:media-mp4-broadcast_unpublish",
        "signal:media-mp4-broadcast_play",
        "signal:media-mp4-broadcast_pause",
        "signal:media-mp4-broadcast_volume_change",
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
      }
      
    },
    [
      isOwnConnection,
      handleAckBroadcast,
      handleBroadcastPlay,
      handleBroadcastPause,
      handleBroadcastVolumeChange
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
   * Publisher will broadcast the url to all subscribers
   * @returns 
   */
  function broadcastUrl () {
    if (!session) return;
    if (userType !== "no-media") return;

    const signalBody = {
      url: mediaUrl,
      type: "mp4"
    }

    const signalType = "media-mp4-broadcast_url"
    session.signal(
      {
        type: signalType,
        data: JSON.stringify(signalBody)
      },
      (err) => {
        if (err) {
          console.log("Signal not sent", err);
          setUserType("no-media");
        } else {
          console.log("Signal sent: ", signalType);
        }
      }
    );
    setUserType("publisher");
  }

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
      console.log("intrsectionAcks", intersectionAcks);
      console.log("acks", acks);
      console.log("connections", connections);

      const totalConnection = connections.length - 1; // minus 1 because we want to ignore our own connection
      if (intersectionAcks.length === totalConnection && intersectionAcks.length !== 0) {
        setMediaState("ready");
      } else {
        setMediaState("unavailable");
      }
    },
    [acks, connections]
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
        broadcastVolumeChange
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}

export { useMedia } from "./hooks/media"
export default MediaProvider;
