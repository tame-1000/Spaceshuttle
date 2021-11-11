import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Box, Button, Container, Grid } from "@material-ui/core";
import { useAgora } from "../hooks/useAgora";
import AgoraRTC from "agora-rtc-sdk-ng";
import { ThemeProvider,useTheme } from "@material-ui/styles";
import { MediaPlayer } from "./MediaPlayer";
import { AudienceList } from "./AudienceList";

if(!window.peer){
  window.peer=new Peer({
    key: process.env.SKYWAY_KEY,
    debug: 3,
  });
}

const Movie = ({roomId}) => {

  return (
    <Box>
      <Button variant="outlined">Primary</Button>
      <AudienceList roomId={roomId}></AudienceList>
    </Box>
    // <Container justify="center" spacing={4}>
    //   <h1>映画見る画面</h1>
    //   <Link to="/" style={{ textDecoration: "none" }}>
    //     <Button variant="outlined">トップページに戻る</Button>
    //   </Link>
    // </Container>
  );
};

export default Movie;
