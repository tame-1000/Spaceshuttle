// import React from "react";
// import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
// import { Button, Container } from "@material-ui/core";

// const Movie = () => {
//   return (
//     <Container justify="center" spacing={4}>
//       <h1>映画見る画面</h1>
//       <Link to="/" style={{ textDecoration: "none" }}>
//         <Button variant="outlined">トップページに戻る</Button>
//       </Link>
//     </Container>
//   );
// };

// export default Movie;

import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Button, Container } from "@material-ui/core";

const Movie = () => {
  $(function() {
    // API key (bc26d227-0bf2-460a-b2cb-129a0dfafdc2 can only be used on localhost)
    const APIKEY = '748c1040-b86c-4a42-875a-80125e8d3691';

    // Call object
    let existingCall = null;

    // localStream
    let localStream = null;

    // Create Peer object
    const peer = new Peer({key: APIKEY, debug: 3});

    // Prepare screen share object
    const ss = ScreenShare.create({debug: true});

    // Get peer id from server
    peer.on('open', () => {
      $('#my-id').text(peer.id);
      console.log(peer.id);
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
    <Container justify="center" spacing={4}>
      <h1>映画見る画面</h1>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="outlined">トップページに戻る</Button>
      </Link>
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
  );
};

export default Movie;