import { useSession } from "../../hooks/session"

import { OTSubscriber } from "../OTSubscriber";

export function OTSubscribers () {
  const { streams } = useSession();

  return (
    <>
      {
        streams.map(
          (stream) => (
            <OTSubscriber
              key={stream.streamId}
              stream={stream}
            />
          )
        )
      }
    </>
  )
}