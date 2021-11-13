import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Box, Button, Container, Grid, makeStyles } from "@material-ui/core";
import { ThemeProvider,useTheme } from "@material-ui/styles";
import Peer from "skyway-js";
import { MovieModal } from "./MovieModal";
import { AvatarPlayer } from "./AvatarPlayer";

const Movie = () => {
  const useStyles = makeStyles(() => ({
    // container: {
    //   width: "100%",
    // },
  }));

  const classes = useStyles();

  // roomIdはpropsとして受け取るように実装する
  const roomId = "test"

  const peer = useRef(new Peer({ 
    key: process.env.SKYWAY_KEY,
    debug:3,
   }));

  const roomMode = "sfu";

  const [remoteVideo, setRemoteVideo] = useState([]);
  const [localStream, setLocalStream] = useState();
  const [room, setRoom] = useState();
  const localVideoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch((e) => console.log(e));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const onJoin = () => {
    if (peer.current) {
      // シグナリングサーバに接続できていない場合
      if (!peer.current.open) {
        return;
      }

      // Roomにjoinする
      const tmpRoom = peer.current.joinRoom(roomId, {
        mode: roomMode,
        stream: localStream,
      });

      // ルームに参加した時
      tmpRoom.once("open", () => {
        console.log("=== You joined ===\n");
      });

      // 他のユーザがRoomにjoinしてきた時
      tmpRoom.on("peerJoin", (peerId) => {
        console.log(`=== ${peerId} joined ===\n`);
      });

      // Room に Join している他のユーザのストリームを受信した時
      tmpRoom.on("stream", async (stream) => {
        setRemoteVideo([
          ...remoteVideo,
          { stream: stream, peerId: stream.peerId },
        ]);
      });

      // 他のユーザがroomを退出した時
      tmpRoom.on("peerLeave", (peerId) => {
        setRemoteVideo(
          remoteVideo.filter((video) => {
            if (video.peerId === peerId) {
              video.stream.getTracks().forEach((track) => track.stop());
            }
            return video.peerId !== peerId;
          })
        );
        console.log(`=== ${peerId} left ===\n`);
      });

      setRoom(tmpRoom);
    }
  };
  const onLeave = () => {
    if (room) {
      room.close();
      setRemoteVideo((prev) => {
        return prev.filter((video) => {
          video.stream.getTracks().forEach((track) => track.stop());
          return false;
        });
      });
    }
  };

  const castVideo = () => {
    return remoteVideo.map((video) => {
      return <AvatarPlayer video={video} key={video.peerId} />;
    });
  };

  return (
    <Container>
      <Button onClick={() => onLeave()}>Leave</Button>
      <Grid container>
        <AvatarPlayer video={ {stream: localStream, peerId: "local-stream"} }></AvatarPlayer>
        {castVideo()}
      </Grid>
      <MovieModal onJoin={onJoin}></MovieModal>
    </Container>
    // <Container justify="center" spacing={4}>
    //   <h1>映画見る画面</h1>
    //   <Link to="/" style={{ textDecoration: "none" }}>
    //     <Button variant="outlined">トップページに戻る</Button>
    //   </Link>
    // </Container>
  );
};

export default Movie;
