import styles from "./BottomControls.module.css";

import LeaveButton from "./components/LeaveButton";
import MuteButton from "./components/MuteButton";
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
        <LeaveButton />
      </div>
    </div>
  );
}

export default BottomControls;
