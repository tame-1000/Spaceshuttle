import { Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { Audience } from "./Audience";

window.roomMode = "sfu";

export const useAgora = ({ peer, roomId }) => {
  //   const audiences = useRef(null);
  const [children, setChildren] = useState({});
  const room = null;

  useEffect(async () => {
    const localStream = getLocalStream();

    // Render local stream
    setChildren(
      (children[stream.peerId] = (
        <Audience mediaStream={localStream}></Audience>
      ))
    );

    if (!peer.open) {
      console.log("peer is closed.");
      return;
    }

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
      setChildren(
        (children[stream.peerId] = <Audience mediaStream={stream}></Audience>)
      );
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
  }, []);

  const getLocalStream = async () => {
    const localStream = await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .catch(console.error);

    return localStream;
  };

  const audiences = [];
  for (key in children) {
    audiences.push(children[key]);
  }

  return { audiences, room };
};
