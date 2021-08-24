import styles from "./OTPublisher.module.css";

import OT from "@opentok/client";
import lodash from "lodash";
import clsx from "clsx";
import { forwardRef } from "react";
import { Publisher, OTError, PublisherProperties } from "@opentok/client";
import { PublisherPropertiesKey, RefProps } from "../../types/OTPublisher";
import { v4 as uuid } from "uuid";

import { useSession } from "../../hooks/session";
import { useImperativeHandle, useEffect, useState } from "react";
import { useRef } from "react";

interface OTPublisherProps {
  className?: string;
  properties?: PublisherProperties;
  onError?: (err: OTError) => void;
}

export const OTPublisher = forwardRef<RefProps, OTPublisherProps>(
  (props, ref) => {
    const className = lodash(props).get("className");
    const properties = lodash(props).get("properties");
    const onError = lodash(props).get("onError");

    const [, setPublished] = useState<boolean>(false);
    const [publisher, setPublisher] = useState<Publisher>();
    const [id] = useState<string>(uuid());
    const { session } = useSession();

    const prevProperties = useRef<PublisherProperties>();

    useImperativeHandle(
      ref,
      () => ({
        getPublisher: () => publisher
      }),
      [publisher]
    )
    
    useEffect(
      () => {
        setPublisher(
          (prevPublisher) => {
            if (!session) return prevPublisher;
            if (prevPublisher) return prevPublisher; // It means we already publish the publish;

            const defaultProperties = {
              publishAudio: true,
              publishVideo: true,
              width: "100%",
              height: "100%",
              insertMode: "append",
              showControls: false,
              fitMode: "contain"
            } as PublisherProperties;

            const combinedProps = lodash(defaultProperties).merge(properties).value();
            const publisher = OT.initPublisher(`publisher_${id}`, combinedProps, (err) => {
              if (err) {
                if (onError) onError(err);
                console.log(err);
              } else {
                console.log("Publisher initialised");
              }
            });
            return publisher;
          }
        )
      },
      [session, properties, onError, id]
    );

    /**
     * This will fire when the publisher is there and properties changes
     */
    useEffect(
      () => {
        if (!publisher) return;

        const shouldUpdate = (key: PublisherPropertiesKey, defaultValue: any) => {
          if (!prevProperties.current) return false;

          const previousValue = lodash(prevProperties.current).get(key, defaultValue);
          const currentValue = lodash(properties).get(key, defaultValue);
          console.log("Should update", key, "is", previousValue !== currentValue)
          return previousValue !== currentValue;
        }

        if (shouldUpdate("videoSource", undefined)) {
          // I need to republish by destroying the publisher
          // and creating a new publisher here
        }

        if (shouldUpdate("publishAudio", true)) {
          const value = lodash(properties).get("publishAudio", true);
          publisher.publishAudio(value);
        }

        if (shouldUpdate("publishVideo", true)) {
          const value = lodash(properties).get("publishVideo", true);
          publisher.publishVideo(value)
        }
      },
      [properties, publisher]
    )

    /**
     * This will keep updating the prevProperties so we can use it if 
     * properties is getting updated.
     */
    useEffect(
      () => {
        prevProperties.current = properties;
      }
    )

    useEffect(
      () => {
        console.log("Publishing");
        setPublished(
          (prevPublished) => {
            if (!session) return false;
            if (!publisher) return false;
            if (prevPublished) return prevPublished;

            session.publish(publisher, (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Publisher published");
              }
            });
            return true;
          }
        )
      },
      [session, publisher]
    )
    
    return (
      <div
        id={`publisher_${id}`}
        className={
          clsx(
            styles.main,
            className
          )
        }
      >
      </div>
    );
  }
)
