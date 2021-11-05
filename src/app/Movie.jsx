import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Box, Button, Container, Grid } from "@material-ui/core";
import { useAgora } from "../hooks/useAgora";
import AgoraRTC from "agora-rtc-sdk-ng";
import { ThemeProvider,useTheme } from "@material-ui/styles";
import { MediaPlayer } from "./MediaPlayer";

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });

const Movie = () => {
  const appID = process.env.APP_ID;
  const channel = process.env.CHANNEL;
  const token = process.env.TOKEN;
  // const [appID, setAppID] = useState("");
  // const [token, setToken] = useState("");
  // const [channel, setChannel] = useState("");

  const {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
  } = useAgora(client)

  useEffect(() => {
    join(appID, channel,token);

    return () => {
      leave();
    };
  }, []);

  return (
      <Grid container>
        {remoteUsers.map((user) => (
          <Grid item>
            <MediaPlayer
              videoTrack={user.videoTrack}
              audioTrack={user.audioTrack}
            ></MediaPlayer>
          </Grid>
        ))}
      </Grid>
    // <Container justify="center" spacing={4}>
    //   <h1>映画見る画面</h1>
    //   <Link to="/" style={{ textDecoration: "none" }}>
    //     <Button variant="outlined">トップページに戻る</Button>
    //   </Link>
    // </Container>
  );
};

export default Movie;
