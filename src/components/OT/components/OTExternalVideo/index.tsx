// External video is a component that host the video URL directly instead of
// normal publisher. We will use mp4 only for this use case
import styles from "./OTExternalVideo.module.css";

import lodash from "lodash";
import { RefProps } from "../../types/OTExternalVideo";
import { forwardRef } from "react";
import { useState, useRef, useEffect, useImperativeHandle } from "react";
import { v4 as uuid } from "uuid";


type EventHandlers = {
  canPlay?: () => void;
  play?: () => void;
  pause?: () => void;
  volumeChange?: () => void;
}

interface OTExternalVideoProps {
  videoSource: string;
  eventHandlers: EventHandlers;
  showControls?: boolean;  
}

export const OTExternalVideo = forwardRef<RefProps, OTExternalVideoProps>(
  (props, ref) => {
    const videoSource = lodash(props).get("videoSource");
    const eventHandlers = lodash(props).get("eventHandlers");
    const showControls = lodash(props).get("showControls", false);

    const [id] = useState<string>(uuid());
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        getVideoElement: () => {
          if (videoRef.current) return videoRef.current;
          else return undefined;
        }
      }),
      []
    )

    useEffect(
      () => {
        if (!videoRef.current) return;
        const videoElement = videoRef.current;

        const canPlayHandler = lodash(eventHandlers).get("canPlay", () => {});
        const playHandler = lodash(eventHandlers).get("play", () => {});
        const pauseHandler = lodash(eventHandlers).get("pause", () => {});
        const volumeChangeHandler = lodash(eventHandlers).get("volumeChange", () => {});

        videoElement.addEventListener("canplay", canPlayHandler);
        videoElement.addEventListener("play", playHandler);
        videoElement.addEventListener("pause", pauseHandler);
        videoElement.addEventListener("volumechange", volumeChangeHandler);

        return function cleanup () {
          if (!videoElement) return;
          videoElement.removeEventListener("canplay", canPlayHandler);
          videoElement.removeEventListener("play", playHandler);
          videoElement.removeEventListener("pause", pauseHandler);
          videoElement.removeEventListener("volumechange", volumeChangeHandler);
        }
      },
      [eventHandlers]
    )

    return (
      <div className={styles.main}>
        <div
          id={`video_${id}`}
          className={styles.videoContainer}
        >
          <video
            ref={videoRef}
            width="100%"
            preload="metadata"
            autoPlay={false}
            controls={showControls}
          >
            <source
              src={videoSource}
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    );
  }
);
