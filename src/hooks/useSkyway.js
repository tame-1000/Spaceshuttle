import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Audience } from "../app/Audience";

window.roomMode = "sfu";

export const useSkyway = ({ peer, roomId }) => {
  //   const audiences = useRef(null);
  const children = new Object();

  const getLocalStream = async () => {
    const localStream = await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .catch(console.error);

    return localStream;
  };

  const localStream = getLocalStream();

  // console.log(peer.id);

  // Render local stream
  children["local-stream"] = <Audience mediaStream={localStream}></Audience>;

//   if (!peer.open) {
//     console.log("peer is closed.");
//     return;
//   }

  const room = peer.joinRoom(roomId, {
    mode: roomMode,
    stream: localStream,
  });

  room.once("open", () => {
    console.log("=== You joined ===\n");
  });
  room.on("peerJoin", (peerId) => {
    console.log(`=== ${peerId} joined ===\n`);
  });

  // Render remote stream for new peer join in the room
  room.on("stream", async (stream) => {
    children[stream.peerId] = <Audience mediaStream={stream}></Audience>;
  });

  // for closing room members
  room.on("peerLeave", (peerId) => {
    delete children[peerId];

    console.log(`=== ${peerId} left ===\n`);
  });

  // for closing myself
  room.once("close", () => {
    console.log("== You left ===\n");

    for (key in children) {
      delete children[key];
    }
  });

  const audiences = [];
  for (key in children) {
    audiences.push(children[key]);
  }

  return [ audiences, room ];
};
