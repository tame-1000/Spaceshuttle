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

      // Call objectの作成
      let existingCall = null;

      // localStream
      let localStream = null;

      // Prepare screen share object
      const ss = ScreenShare.create({debug: true});

      $("#room_id").text("Room ID : " + roomId);

        // Start screenshare
      $('#start-screen').on('click', () => {
        //Chrome extensionが入ってなかったら
        if (ss.isScreenShareAvailable() === false) {
          alert('Screen Share cannot be used. Please install the Chrome extension.');
          return;
        }

        //画面設定
        ss.start({
          width: "640",
          height: "480",
          frameRate: "60",
        })
          .then(stream => {
            const setSS = stream;
            $('#video')[0].srcObject = setSS;
            if (existingCall !== null) {
              const peerid = existingCall.peer;
              existingCall.close();
              const call = peer.call(peerid, stream);
            }
            localStream = stream;
          })
          .catch(error => {
              console.log(error);
          });
      });
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
      <p id="room_id"></p>
      <p><a href="#" id="disconnect">Disconnect</a></p>
      <video id="video" muted="true" width="480" height="240" autoplay></video>

      <p><a href="#" id="start-screen">Set Screen</a></p>

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
