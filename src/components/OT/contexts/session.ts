import { Connection, Session, Stream } from "@opentok/client";
import { createContext } from "react";

interface SessionContextProps {
  session?: Session;
  connections: Connection[];
  streams: Stream[];
  isConnected: boolean;
}

export const SessionContext = createContext<SessionContextProps>({
  isConnected: false,
  connections: [],
  streams: []
});
