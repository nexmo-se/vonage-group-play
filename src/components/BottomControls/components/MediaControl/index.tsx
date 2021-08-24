import IconPath from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";
import styles from "./MediaControl.module.css";

import lodash from "lodash";

interface MediaControlProps {
  iconColor?: string;
  iconName: string;
  tooltip: string;
  onClick?: () => void;
}

function MediaControl (props: MediaControlProps) {
  const iconColor = lodash(props).get("iconColor", "white");
  const iconName = lodash(props).get("iconName");
  const onClick = lodash(props).get("onClick");

  function handleClick () {
    if (onClick) onClick();
  }

  return (
    <div
      className={styles.main}
      onClick={handleClick}
    >
      <svg className={`Vlt-icon Vlt-icon--small Vlt-${iconColor}`}>
        <use xlinkHref={`${IconPath}#${iconName}`} />
      </svg>
    </div>
  );
}

export default MediaControl;
