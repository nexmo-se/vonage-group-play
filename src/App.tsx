import "@vonagevolta/volta2/dist/css/volta.min.css";

import MainPage from "components/MainPage";
import BottomControls from "components/BottomControls";
import VideoContainer from "components/VideoContainer";
import LayoutProvider from "components/LayoutProvider";
import MediaProvider from "components/MediaProvider";
import AudioVideoProvider from "components/AudioVideoProvider";
import { OTSession } from "components/OT";

function App() {
  return (
    <OTSession
      apiKey="46212282"
      sessionId="1_MX40NjIxMjI4Mn5-MTYyOTQ0OTUzMjk1NH5lK29zb1VmbU5wdWlHMEJmaWpyRkVMSjB-fg"
      token="T1==cGFydG5lcl9pZD00NjIxMjI4MiZzaWc9YzYxNmYxZTI3NDE2OTNhMWY3ODY5ZDkxZjI3OGIwYTRmMjE5NWUxYzpzZXNzaW9uX2lkPTFfTVg0ME5qSXhNakk0TW41LU1UWXlPVFEwT1RVek1qazFOSDVsSzI5emIxVm1iVTV3ZFdsSE1FSm1hV3B5UmtWTVNqQi1mZyZjcmVhdGVfdGltZT0xNjI5NDQ5NTMzJm5vbmNlPTAuMzQ3Mjg4MTI2MzQwMDI1Mzcmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTYzMDA1NDMzMyZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ=="
    >
      <MainPage>
        <LayoutProvider>
          <MediaProvider>
            <AudioVideoProvider>
              <VideoContainer />
              <BottomControls />
            </AudioVideoProvider>
          </MediaProvider>
        </LayoutProvider>
      </MainPage>
    </OTSession>
  );
}

export default App;
