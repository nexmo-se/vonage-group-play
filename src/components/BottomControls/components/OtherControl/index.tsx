import IconPath from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";
import styles from "./OtherControl.module.css";

import lodash from "lodash";
import clsx from "clsx";

interface OtherControlProps {
  iconName: string;
  iconColor?: string;
  title: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

function OtherControl (props: OtherControlProps) {
  const iconName  = lodash(props).get("iconName");
  const title = lodash(props).get("title");
  const iconColor = lodash(props).get("iconColor", "white");
  const onClick = lodash(props).get("onClick");
  const active = lodash(props).get("active", false);
  const disabled = lodash(props).get("disabled", false);

  function handleClick () {
    if (onClick && !disabled) onClick();
  }

  function generateIconColor () {
    if (active) return "purple"
    else if (disabled) return "grey-dark"
    else return iconColor;
  }

  return (
    <div
      className={
        clsx({
          "Vlt-btn": true,
          "Vlt-btn--tertiary": true,
          "Vlt-btn--app": true,
          [styles.main]: true,
          [styles.selected]: active,
          [styles.disabled]: disabled
        })
      }
      onClick={handleClick}
    >
      <svg className={`Vlt-icon Vlt-icon--small Vlt-${generateIconColor()}`}>
        <use xlinkHref={`${IconPath}#${iconName}`} />
      </svg>
      <br />
      {title}
    </div>
  );
}

export default OtherControl;