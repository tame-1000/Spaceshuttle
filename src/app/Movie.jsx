import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Box, Button, Container, Grid, makeStyles } from "@material-ui/core";
import { ThemeProvider, useTheme } from "@material-ui/styles";
import Peer from "skyway-js";
import { MovieModal } from "./MovieModal";
import { AvatarPlayer } from "./AvatarPlayer";


const Movie = (props) => {
  // roomidを取得
  const roomId = props.match.params.roomid;

  const useStyles = makeStyles(() => ({
    // container: {
    //   width: "100%",
    // },
  }));

  const classes = useStyles();

  // roomIdはpropsとして受け取るように実装する
  // const roomId = "test";

  const peer = useRef(
    new Peer({
      key: process.env.SKYWAY_KEY,
      debug: 3,
    })
  );

  const roomMode = "mesh";

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

      const setStream = async () => {
        const stream = navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        let localStream = await stream;
        $('#video')[0].srcObject = localStream;
        tmpRoom.replaceStream(localStream);
      }

      // ルームに参加した時
      tmpRoom.once("open", () => {
        setStream();
        console.log("=== You joined ===\n");
      });

      // 他のユーザがRoomにjoinしてきた時
      tmpRoom.on("peerJoin", (peerId) => {
        console.log(`=== ${peerId} joined ===\n`);
      });

      // Room に Join している他のユーザのストリームを受信した時
      tmpRoom.on("stream", async (stream) => {  
        setRemoteVideo((prev) => [
          ...prev,
          { stream: stream, peerId: stream.peerId },
        ]);
      });

      // 他のユーザがroomを退出した時
      tmpRoom.on("peerLeave", (peerId) => {
        setRemoteVideo((prev) => {
          return prev.filter((video) => {
            if (video.peerId === peerId) {
              video.stream.getTracks().forEach((track) => track.stop());
            }
            return video.peerId !== peerId;
          });
        });
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
          ss.stop();
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
        <AvatarPlayer
          video={{ stream: localStream, peerId: "local-stream" }}
        ></AvatarPlayer>
        {castVideo()}
      </Grid>
      <MovieModal onJoin={onJoin}></MovieModal>
      <video id="video" muted="true" width="480" height="240" autoPlay></video>

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
