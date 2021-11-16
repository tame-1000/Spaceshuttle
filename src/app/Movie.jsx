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
          })
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

  $(function() {

    // Call object
    let existingCall = null;

    // localStream
    let localStream = null;

    // Create Peer object
    const peer = new Peer({key: process.env.SKYWAY_KEY, debug: 3});

    // Prepare screen share object
    const ss = ScreenShare.create({debug: true});

    // Get peer id from server
    peer.on('open', () => {
      $('#my-id').text(peer.id);
    });

    // Set your own stream and answer if you get a call
    peer.on('call', call => {
      call.answer(localStream);
      end_call(call);
      console.log('event:recall');
    });

    // Error handler
    peer.on('error', err => {
      alert(err.message);
      show_group_call();
    });

  // Callボタンを押した処理
  $('#connect').on('click', () => {
    const call = peer.call($('#otherpeerid').val(), localStream);
    end_call(call);
  });

  // 終了ボタンを押した処理
  $('#disconnect').on('click', () => {
    existingCall.close();
    show_group_call();
  });

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
        $('#video')[0].srcObject = stream;

        if (existingCall !== null) {
          const peerid = existingCall.peer;
          existingCall.close();
          const call = peer.call(peerid, stream);
          end_call(call);
        }
        localStream = stream;
      })
      .catch(error => {
          console.log(error);
      });
  });

  // End screenshare
  $('#stop-screen').on('click', () => {
    ss.stop();
    localStream.getTracks().forEach(track => track.stop());
  });

  function show_group_call() {
    // Update UI
    $('#end-container').hide();
    $('#group-container').show();
  }

  function end_call(call) {
    // Close any existing calls
    if (existingCall) {
      existingCall.close();
    }

    // Wait for peer's media stream
    call.on('stream', stream => {
      $('#video')[0].srcObject = stream;
      $('#group-container').hide();
      $('#end-container').show();
    });

    // If the peer closes their connection
    call.on('close', show_group_call);

    // Save call object
    existingCall = call;

    // Update UI
    $('#their-id').text(call.peer);
    $('#group-container').hide();
    $('#end-container').show();
  }
});

  return (
    <Container>
      <Button onClick={() => onLeave()}>Leave</Button>
      <Grid container>
        <AvatarPlayer video={ {stream: localStream, peerId: "local-stream"} }></AvatarPlayer>
        {castVideo()}
      </Grid>
      <MovieModal onJoin={onJoin}></MovieModal>
      <p><a href="#" id="disconnect">Disconnect</a></p>
      <video id="video" muted="true" width="480" height="240" autoplay></video>

      <p><a href="#" id="start-screen">Set Screen</a></p>

      <div id="group-container">
          <p>My peer id: <span id="my-id">...</span></p>
          
          <label for="otherpeerid">Recipient peer id:</label>
          <input id="otherpeerid"/>
          <a href="#" id="connect">Connect</a>
      </div>

      <div id="end-container">
          <p>Connected to: <span id="their-id">...</span></p>
          <p><a href="#" id="stop-screen">End screenshare</a></p>        
    </div>
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
