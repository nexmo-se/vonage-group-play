import { Connection, Stream } from "@opentok/client";

export type ConnectionCreatedEvent = {
  connection: Connection;
}

export type ConnectionDestroyedEvent = ConnectionCreatedEvent & { reason: string };

export type StreamCreatedEvent = {
  stream: Stream;
}

export type StreamDestroyedEvent = StreamCreatedEvent & {
  cancelable: boolean;
  reason: string;
}