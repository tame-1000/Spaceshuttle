import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { useHistory, Redirect } from "react-router-dom";
import { Box, Button, Container, Grid, makeStyles } from "@material-ui/core";
import { ThemeProvider, useTheme } from "@material-ui/styles";
import Peer from "skyway-js";
import { MovieModal } from "./MovieModal";
import { FaceTracker } from "./FaceTracker";
import { useAuthContext } from "../context/authcontext";

const setStyles = (theme) => {
  return makeStyles({
    btna: {
      backgroundColor: "red",
    },
  });
};

const Movie = (props) => {
  const { isAdmin } = useAuthContext();
  const history = useHistory();
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
  const [isJoin, setIsJoin] = useState(false);
  const localVideoRef = useRef(null);
  const canvasIdRef = useRef(1);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
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

      console.log(isAdmin);
      // adminのみ画面共有可能に
      const setStream = async () => {
        if (isAdmin) {
          const stream = navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          let localStream = await stream;
          $("#video")[0].srcObject = localStream;
          console.log(localStream.getAudioTracks());
          tmpRoom.replaceStream(localStream);
        }
      };

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
        console.log("~~~~~~~~~~~~~~~~~~~~~~");
        if (stream.peerId == peer.peerId) {
          console.log("|||||||||||||||||||||||||")
        }
        $("#video")[0].srcObject = stream;
        //$("#video")[0].getAudioTracks()[0].forEach(track => track.enabled = true);
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
      // ss.stop();
      setRemoteVideo((prev) => {
        return prev.filter((video) => {
          video.stream.getTracks().forEach((track) => track.stop());
          return false;
        });
      });
      history.push("/");
    }
  };

  const castVideo = () => {
    return remoteVideo.map((video) => {
      return <FaceTracker video={video} canvasId={canvasIdRef.current++} avatarId={1}/>;
    });
  };

  return (
    <Container>
      <Button style={setStyles.btna} onClick={() => onLeave()}>Leave</Button>
      <video id="video" width="960" height="960" autoPlay></video>
      <Grid container>
        <FaceTracker video={ {stream: localStream, peerId: "local-stream"} } canvasId={0} avatarId={1}></FaceTracker>
        {castVideo()}
      </Grid>
      <MovieModal onJoin={onJoin}></MovieModal>
    </Container>
  );
};

export default Movie;
