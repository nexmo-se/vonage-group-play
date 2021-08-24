import { useAudioVideo } from "components/AudioVideoProvider";

import MediaControl from "../MediaControl";

function MuteButton () {
  const { hasAudio, setHasAudio } = useAudioVideo();

  function handleClick () {
    setHasAudio((prevValue) => !prevValue);
  }

  function getIconName () {
    if (hasAudio) {
      return "Vlt-icon-microphone-full"
    } else {
      return "Vlt-icon-microphone-mute-full"
    }
  }

  function getIconColor () {
    if (hasAudio) return "green"
    else return "red";
  }

  function getTooltip () {
    if (hasAudio) return "Mute Microphone"
    else return "Unmute Microphone"
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

export default MuteButton;
