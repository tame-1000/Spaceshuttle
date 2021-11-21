import React, { useEffect, useRef, useState, Suspense } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Box, Button, Container, Grid, makeStyles } from "@material-ui/core";
import { ThemeProvider, useTheme } from "@material-ui/styles";
import Peer from "skyway-js";
import { MovieModal } from "./MovieModal";
import { AvatarPlayer } from "./AvatarPlayer";


const MovieShow = (props) => {
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
  //const [localStream, setLocalStream] = useState();
  const [room, setRoom] = useState();
  const localVideoRef = useRef(null);
  let localStream;
  let tmpRoom;


//   useEffect(() => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then((stream) => {
//         setLocalStream(stream);
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//           localVideoRef.current.play().catch((e) => console.log(e));
//         }
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }, []);

  const onJoin = () => {
    if (peer.current) {
      // シグナリングサーバに接続できていない場合
      if (!peer.current.open) {
        return;
      }

      // Roomにjoinする
      tmpRoom = peer.current.joinRoom(roomId, {
        mode: roomMode,
        stream: localStream,
      });

      const setStream = async () => {
        if (ss.isScreenShareAvailable() === false) {
            alert('Chromeの拡張機能をインストールしてください');
            return;
        }
        const stream = navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        let localStream = await stream;
        $('#video')[0].srcObject = localStream;
        tmpRoom.replaceStream(localStream);
      }

      tmpRoom.on("log", (log) => {
        console.log(log);
      });

      // ルームに参加した時
      tmpRoom.once("open", (id) => {
        setStream();
        console.log("=== You joined ===\n");
        console.log("groupname is " + tmpRoom.name);
        console.log("member is " + tmpRoom.member);
        console.log("remote stream is " + tmpRoom.remoteStream)
      });

      // 他のユーザがRoomにjoinしてきた時
      tmpRoom.on("peerJoin", (peerId) => {
        console.log(`=== ${peerId} joined ===\n`);
      });

      // Room に Join している他のユーザのストリームを受信した時
      tmpRoom.on("stream", async (stream) => {  
        console.log("change stream 1");
        if ( typeof(stream) === 'object') {
            console.log("change stream 2");
            const remoteVideo = $('#video')[0];
            remoteVideo.srcObject = stream;
            remoteVideo.playsInline = true;
            remoteVideo.setAttribute('data-peer-id', stream.peerId);
            videosContainer.append(remoteVideo);
    
            await remoteVideo.play().catch(console.error);
          } else {
            console.log("streamなし");
          }

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
        <MovieModal onJoin={onJoin}></MovieModal>
      <Button onClick={() => onLeave()}>Leave</Button>
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

export default MovieShow;
