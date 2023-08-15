import { useRef, useEffect } from "react";

function RTCVideo({ mediaStream }){
  const viewRef = useRef(null);

  useEffect(() => {
    if (!viewRef.current)
        return;
    viewRef.current.srcObject = mediaStream ? mediaStream : null;
  }, [mediaStream]);

  return <video ref={viewRef} autoPlay></video>;
};

export default RTCVideo;