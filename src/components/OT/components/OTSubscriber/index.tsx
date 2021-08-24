import styles from "./OTSubscriber.module.css";

import lodash from "lodash";
import clsx from "clsx";
import { OTError, Stream, Subscriber, SubscriberProperties } from "@opentok/client";
import { v4 as uuid } from "uuid";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "../../hooks/session";

interface OTSubscriberProps {
  stream: Stream;
  className?: string;
  properties?: SubscriberProperties;
  onError?: (err: OTError) => void;
}

export function OTSubscriber ({ onError, properties, stream, className }: OTSubscriberProps) {
  const [, setSubscriber] = useState<Subscriber>();
  const [id] = useState<string>(uuid());
  const { session } = useSession();

  const handleVideoElementCreated = useCallback(
    ({ element }: VideoElementCreatedEvent) => {
      // Remove any existing element.
      const container = document.getElementById(`subscriber_${id}`);
      if (!container) return;
      while (container.firstChild) {
        if (container.lastChild) container.removeChild(container.lastChild);
        else break;
      }

      container.append(element);
    },
    [id]
  )

  useEffect(
    () => {
      if (!session) return;

      const defaultProperties = { insertDefaultUI: false };
      const combinedProps = lodash(defaultProperties).merge(properties).value();
      const subscriber = session.subscribe(stream, undefined, combinedProps, (err) => {
        if (err) {
          if (onError) onError(err);
          console.log(err);
        } else {
          setSubscriber(subscriber);
          console.log("Subscriber initialised");
        }
      });

      subscriber.once("videoElementCreated", handleVideoElementCreated);
    },
    [
      session,
      properties,
      onError,
      stream,
      handleVideoElementCreated
    ]
  )

  return (
    <div
      className={
        clsx(
          styles.main,
          className
        )
      }
    >
      <div
        id={`subscriber_${id}`}
        className={styles.videoContainer}
      />
    </div>
  )
}
