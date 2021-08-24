import { Publisher, PublisherProperties } from "@opentok/client";

type VideoElementCreatedEvent = {
  element: HTMLVideoElement | HTMLObjectElement
}

type RefProps = {
  getPublisher: () => Publisher | undefined;
}

export type PublisherPropertiesKey = keyof PublisherProperties;
export type OTPublisherRefProps = RefProps;