import styles from "./BottomControls.module.css";

import MuteButton from "./components/MuteButton";
import OtherControl from "./components/OtherControl";
import ShareButton from "./components/ShareButton";
import VideoButton from "./components/VideoButton";

function BottomControls () {
  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <ShareButton />
      </div>
      <div className={styles.middle}>
        <MuteButton />
        <VideoButton />
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
