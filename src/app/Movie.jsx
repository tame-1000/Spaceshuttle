import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Box, Button, Container, Grid } from "@material-ui/core";

const Movie = () => {
  const [appID, setAppID] = useState('');
  const [token, setToken] = useState('');
  const [channel, setChannel] = useState('');
  const {
    localAudioTrack,
    localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsers,
  } = useAgora(client);
  
  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        {remoteUsers.map(user => (
          <Grid item xs={2}>
            {/* <MediaPlayer
              videoTrack={user.videoTrack}
              audioTrack={user.audioTrack}
            ></MediaPlayer> */}
          </Grid>
        ))}
      </Grid>
    </ThemeProvider>
    // <Container justify="center" spacing={4}>
    //   <h1>映画見る画面</h1>
    //   <Link to="/" style={{ textDecoration: "none" }}>
    //     <Button variant="outlined">トップページに戻る</Button>
    //   </Link>
    // </Container>
  );
};

export default Movie;
