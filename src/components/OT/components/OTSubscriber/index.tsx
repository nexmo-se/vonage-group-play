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

  useEffect(
    () => {
      setSubscriber(
        (prevSubscriber) => {
          if (!session) return prevSubscriber;
          if (prevSubscriber) return prevSubscriber;

          const defaultProperties = {
            subscribeToAudio: true,
            subscribeToVideo: true,
            width: "100%",
            height: "100%",
            insertMode: "append",
            showControls: false,
            fitMode: "contain"
          } as SubscriberProperties

          const combinedProps = lodash(defaultProperties).merge(properties).value();
          const subscriber = session.subscribe(stream, `subscriber_${id}`, combinedProps, (err) => {
            if (err) {
              if (onError) onError(err);
              console.log(err);
            } else {
              console.log("Subscriber initialised");
            }
          });
          return subscriber;
        }
      )
    },
    [session, properties, onError, stream, id]
  )

  return (
    <div
      id={`subscriber_${id}`}
      className={
        clsx(
          styles.main,
          className
        )
      }
    >
    </div>
  )
}
