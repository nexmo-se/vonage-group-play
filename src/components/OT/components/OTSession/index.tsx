import OT from "@opentok/client";
import lodash from "lodash";
import { useEffect, useState, useCallback } from "react";
import { SessionContext } from "../../contexts/session";

import { Session, Connection, Stream } from "@opentok/client";
import {
  ConnectionCreatedEvent,
  ConnectionDestroyedEvent,
  StreamCreatedEvent,
  StreamDestroyedEvent
} from "components/OT/types/OTSession";

interface OTSessionProps {
  children: any;
  apiKey: string;
  sessionId: string;
  token: string;
}

export function OTSession ({ children, apiKey, sessionId, token }: OTSessionProps) {
  const [sessionInstance, setSessionInstance] = useState<Session>();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);

  const handleConnectionCreated = useCallback(
    (event: ConnectionCreatedEvent) => {
      setConnections((connections) => [...connections, event.connection])
    },
    []
  )

  const handleConnectionDestroyed = useCallback(
    (event: ConnectionDestroyedEvent) => {
      setConnections(
        (connections) => connections.filter(
          (connection) => connection.connectionId !== event.connection.connectionId
        )
      )
    },
    []
  )

  const handleStreamCreated = useCallback(
    (event: StreamCreatedEvent) => {
      setStreams(
        (streams) => {
          const combinedStreams = [...streams, event.stream];
          const uniqStream = lodash(combinedStreams).uniqBy("streamId").value();
          return uniqStream;
        }
      )
    },
    []
  )

  const handleStreamDestroyed = useCallback(
    (event: StreamDestroyedEvent) => {
      setStreams(
        (streams) => streams.filter(
          (stream) => stream.streamId !== event.stream.streamId
        )
      )
    },
    []
  )

  // Connecting to the session when first time render
  useEffect(
    () => {
      // If the session is connected, we won't do anything
      if (sessionInstance) return;

      if (!apiKey) return;
      if (!sessionId) return;
      if (!token) return;

      if (OT.checkSystemRequirements() === 1) {
        const session = OT.initSession(apiKey, sessionId);

        // Event handlers for the session
        session.on("connectionCreated", handleConnectionCreated);
        session.on("connectionDestroyed", handleConnectionDestroyed);
        session.on("streamCreated", handleStreamCreated);
        session.on("streamDestroyed", handleStreamDestroyed);

        session.connect(token, (err) => {
          if (!err) {
            console.log("Connected to session");
            console.log("My connection id is ", session.connection?.connectionId)
            setSessionInstance(session);
          } else {
            console.log("Error connecting: ", err.name, err.message);
          }
        })
      } else {
        console.log("Your browser doesn't support WebRTC");
      }
    },
    [
      sessionInstance,
      apiKey,
      sessionId,
      token,
      handleConnectionCreated,
      handleConnectionDestroyed,
      handleStreamCreated,
      handleStreamDestroyed
    ]
  )

  return (
    <SessionContext.Provider
      value={{
        session: sessionInstance,
        connections: connections,
        streams: streams,
        isConnected: sessionInstance !== undefined
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

