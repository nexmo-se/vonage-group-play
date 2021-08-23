import { v4 as uuid } from "uuid";

import { useMedia } from "components/MediaProvider";
import { useModal } from "components/Modal";
import { useState } from "react";

import Modal from "components/Modal";
import OtherControl from "../OtherControl";
import Input from "components/Input";

function ShareButton () {
  const [id] = useState<string>(uuid());
  const [active, setActive] = useState<boolean>();
  const [tempUrl, setTempUrl] = useState<string>("https://d3ftwi7xooeeyo.cloudfront.net/big_buck_bunny.mp4");
  const { userType, setMediaUrl, broadcastUnpublish } = useMedia();
  const { open, close, isOpen } = useModal(`provide-video_${id}`);

  function handleClick () {
    if (active) {
      setActive(false);
      broadcastUnpublish();
    } else open();
  }

  function toggleModal () {
    if (isOpen) close();
    else open();
  }

  function handleShareClick () {
    if (!tempUrl) return;
    setMediaUrl(tempUrl);
    setActive(true);
    setTempUrl("");
    toggleModal();
  }

  return (
    <>    
      <OtherControl
        iconName="Vlt-icon-screen-share-full"
        title="Share"
        onClick={handleClick}
        active={active}
        disabled={userType === "subscriber"}
      />
      <Modal id={`provide-video_${id}`}>
        <Modal.Header title="Provide video" />
        <Modal.Content>
          <p>Please provide mp4 link for us to play.</p>
          <Input
            id="mp4-input"
            value={tempUrl}
            onChange={setTempUrl}
          />
        </Modal.Content>
        <Modal.Footer>
          <button
            className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary"
            onClick={toggleModal}
          >
            Cancel
          </button>
          <button
            className="Vlt-btn Vlt-btn--app Vlt-btn--secondary"
            onClick={handleShareClick}
          >
            Share
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ShareButton;
