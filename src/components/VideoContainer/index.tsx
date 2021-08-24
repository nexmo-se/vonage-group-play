import styles from "./VideoContainer.module.css";
import clsx from "clsx";

import { useEffect } from "react";
import { useMedia } from "components/MediaProvider";
import { useLayout } from "components/LayoutProvider";

import Mp4Player from "./components/Mp4Player";
import { OTPublisher, OTSubscribers } from "components/OT";

function VideoContainer () {
  const { layout, setLayout } = useLayout();
  const { mediaUrl } = useMedia();

  /**
   * If we have the mediaUrl and the layout is not dominant,
   * we will make it dominant so that the Mp4Player component
   * will render the video.
   */
  useEffect(
    () => {
      if (mediaUrl && layout !== "dominant") {
        setLayout("dominant");
      } else if (!mediaUrl && layout !== "normal") {
        setLayout("normal");
      }
    },
    [mediaUrl, layout, setLayout]
  )
  
  return (
    <section className={styles.main}>
      {
        layout === "dominant" && (
          <section className={styles.dominant}>
            <Mp4Player />
          </section>
        )
      }
      <section
        className={
          clsx({
            [styles.participants]: true,
            [styles.small]: layout === "dominant"
          })
        }
      >
        <OTPublisher
          className={
            clsx({
              [styles.normal]: layout === "normal"
            })
          }
        />
        <OTSubscribers
          className={
            clsx({
              [styles.normal]: layout === "normal"
            })
          }
        />
      </section>
    </section>
  );
}

export default VideoContainer;
