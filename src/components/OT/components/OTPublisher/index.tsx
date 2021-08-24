import styles from "./OTPublisher.module.css";

import OT from "@opentok/client";
import lodash from "lodash";
import clsx from "clsx";
import { forwardRef } from "react";
import { Publisher, OTError, PublisherProperties } from "@opentok/client";
import { PublisherPropertiesKey, RefProps } from "../../types/OTPublisher";
import { v4 as uuid } from "uuid";

import { useSession } from "../../hooks/session";
import { useImperativeHandle, useCallback, useEffect, useState } from "react";
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

    const [publisher, setPublisher] = useState<Publisher>();
    const [published, setPublished] = useState<boolean>(false);
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
        if (published) return; // do not re-publish

        const defaultProperties = {
          insertDefaultUI: false,
          publishAudio: true,
          publishVideo: true
        } as PublisherProperties
        
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
      <div
        className={
          clsx(
            styles.main,
            className
          )
        }
      >
        <div
          id={`publisher_${id}`}
          className={styles.videoContainer}
        />
      </div>
    );
  }
)
