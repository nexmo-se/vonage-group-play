import { useAudioVideo } from "components/AudioVideoProvider";

import MediaControl from "../MediaControl";

function VideoButton () {
  const { hasVideo, setHasVideo } = useAudioVideo();

  function handleClick () {
    setHasVideo((prevValue) => !prevValue)
  }

  function getIconName () {
    if (hasVideo) {
      return "Vlt-icon-video-active-full"
    } else {
      return "Vlt-icon-video-off-full"
    }
  }

  function getIconColor () {
    if (hasVideo) return "green";
    else return "red";
  }

  function getTooltip () {
    if (hasVideo) return "Disable Video";
    else return "Enable Video";
  }

  return (
    <MediaControl
      iconName={getIconName()}
      iconColor={getIconColor()}
      tooltip={getTooltip()}
      onClick={handleClick}
    />
  )
}

export default VideoButton;
