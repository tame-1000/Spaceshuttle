import { Box, Grid } from "@material-ui/core";
import React, { useEffect } from "react";

export const Audience = ({ mediaStream }) => {
  const mediaPlayer = useRef(null);

  useEffect(() => {
    asyncFunc();

    return ()=>{
        mediaPlayer.current.srcObject.getTracks().forEach(track => track.stop());
        mediaPlayer.current.srcObject = null;
    }
  }, []);

  const asyncFunc = async () => {
    mediaPlayer.current.srcObject = mediaStream;
    mediaPlayer.current.playsInline = true;
    // mediaPlayer.current.setAttribute("data-peer-id", mediaStream.peerId);
    await mediaPlayer.current?.play().catch(console.error);
  };

  return (
    <Grid item>
      <video ref={mediaPlayer}></video>
    </Grid>
  );
};
