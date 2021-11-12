import { useRef } from "react";

export const RemoteVideo = ({video}) => {
    const videoRef = useRef(null);
  
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = video.stream;
        videoRef.current.play().catch((e) => console.log(e));
      }
    }, [video]);

    return <video ref={videoRef} playsInline autoPlay></video>;
  };