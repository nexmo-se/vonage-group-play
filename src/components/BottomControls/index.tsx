import styles from "./BottomControls.module.css";

import MediaControl from "./components/MediaControl";
import OtherControl from "./components/OtherControl";
import ShareButton from "./components/ShareButton";

function BottomControls () {
  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <ShareButton />
      </div>
      <div className={styles.middle}>
        <MediaControl
          iconName="Vlt-icon-microphone-mute-full"
          iconColor="red"
          tooltip="Unmute Microphone"
        />
        <MediaControl
          iconName="Vlt-icon-video-off-full"
          iconColor="red"
          tooltip="Enable Video"
        />
      </div>
      <div className={styles.right}>
        <OtherControl
          iconName="Vlt-icon-phone-down-full"
          iconColor="red"
          title="Leave Meeting"
        />
      </div>
    </div>
  );
}

export default BottomControls;
