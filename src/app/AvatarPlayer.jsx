import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import clm from "clmtrackr"

export const AvatarPlayer = ({ video }) => {
  const useStyles = makeStyles(() => ({
    video: {
      transform: "scaleX(-1)"
    },
    canvas: {
      transform: "scaleX(-1)",
    }
  }));

  const classes = useStyles();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  let ctracker = null;

  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      videoRef.current.srcObject = video.stream;

      ctracker = new clm.tracker();
      ctracker.init();

      let box = [0, 0, 400, 260];
      ctracker.start(videoRef.current, box);

      document.addEventListener('clmtrackrConverged', () => console.log('Converged'))
      document.addEventListener('clmtrackrLost', () => console.log('Lost'))

      let cc = canvasRef.current.getContext("2d");

      function drawLoop() {
        requestAnimationFrame(drawLoop); // ここで毎フレームdrawLoopを呼び出すように設定します。
        cc.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // 毎フレーム出力用のキャンバスをクリアします。これをしないと重ね書きのようになってしまいます。
        ctracker.draw(canvasRef.current); // 判定結果をcanvasに描画します。
        console.log(ctracker.getCurrentPosition())
      }

      drawLoop();
    }

    return () => {
      ctracker.stop();
    };
  }, [video]);

  return (
    <Grid item>
      <video
        className={classes.video}
        ref={videoRef}
        playsInline
        autoPlay
        width={300}
        height={300}
      ></video>
      {/* {canvas} */}
      <canvas className={classes.canvas} ref={canvasRef} width={400} height={300}></canvas>
    </Grid>
  );
};
