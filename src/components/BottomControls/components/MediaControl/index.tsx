import IconPath from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";
import styles from "./MediaControl.module.css";

interface MediaControlProps {
  iconColor?: string;
  iconName: string;
  tooltip: string;
}

function MediaControl ({ iconColor, iconName, tooltip }: MediaControlProps) {
  return (
    <div className={styles.main}>
      <svg className={`Vlt-icon Vlt-icon--small Vlt-${iconColor}`}>
        <use xlinkHref={`${IconPath}#${iconName}`} />
      </svg>
    </div>
  );
}

export default MediaControl;
