import React, { useRef, useEffect } from "react";

export const MediaPlayer = ({ videoTrack, audioTrack }) => {
  const container = useRef(null);
  useEffect(() => {
    if (!container.current) return;
    videoTrack?.play(container.current);
    return () => {
      videoTrack?.stop();
    };
  }, [container, videoTrack]);
  useEffect(() => {
    if (audioTrack) {
      audioTrack.play();
    }
    return () => {
      audioTrack?.stop();
    };
  }, [audioTrack]);

  // コンテナのサイズはwidth:heightは4:3になるようにする
  return (
    <div
      ref={container}
      className="video-player"
      style={{ width: "80px", height: "60px" }}
    ></div>
  );
};
