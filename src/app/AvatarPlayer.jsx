import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef } from "react";

export const AvatarPlayer = ({ video }) => {
  const useStyles = makeStyles(() => ({
    video: {
      width: "80vh",
      height: "auto",
    },
  }));

  const classes = useStyles();

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = video.stream;
      videoRef.current.play().catch((e) => console.log(e));
    }
  }, [video]);

  return (
    <Grid item xs={2}>
      <video
        className={classes.video}
        ref={videoRef}
        playsInline
        autoPlay
      ></video>
    </Grid>
  );
};
