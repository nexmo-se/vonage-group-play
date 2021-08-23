import styles from "./OTPublisher.module.css";

import OT from "@opentok/client";
import lodash from "lodash";
import { Publisher, OTError, PublisherProperties } from "@opentok/client";
import { v4 as uuid } from "uuid";

import { useSession } from "components/OT";
import { useCallback, useEffect, useState } from "react";

interface OTPublisherProps {
  properties?: PublisherProperties;
  onError?: (err: OTError) => void;
}

export function OTPublisher ({ properties, onError }: OTPublisherProps) {
  const [publisher, setPublisher] = useState<Publisher>();
  const [published, setPublished] = useState<boolean>(false);
  const [id] = useState<string>(uuid());
  const { session } = useSession();

  const handleVideoElementCreated = useCallback(
    ({ element }: VideoElementCreatedEvent) => {
      // remove any existing element
      const container = document.getElementById(`publisher_${id}`);
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
      const publisher = OT.initPublisher(undefined, combinedProps, (err) => {
        if (err) {
          if (onError) onError(err);
          console.log(err);
        } else {
          setPublisher(publisher);
          console.log("Publisher initialised");
        }
      });

      publisher.once("videoElementCreated", handleVideoElementCreated);
    },
    [
      session,
      properties,
      onError,
      handleVideoElementCreated
    ]
  );

  useEffect(
    () => {
      if (!publisher) return;
      if (!session) return;
      if (published) return;

      session.publish(publisher, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Publisher published");
          setPublished(true);
        }
      })
    },
    [session, publisher, published]
  )
  
  return (
    <div className={styles.main}>
      <div
        id={`publisher_${id}`}
        className={styles.videoContainer}
      />
    </div>
  );
}
