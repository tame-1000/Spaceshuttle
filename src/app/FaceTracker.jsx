import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import clm from "clmtrackr";
import { Live2DCanvas } from "./Live2DCanvas";

/**
 * 顔座標のindex
 * scaleX(-1) している場合(前面カメラ利用時)、座標が鏡のように左右入れ替わるので
 * それを補填する
 */
const faceCoordinateIndexForMapping = [
  // 輪郭
  { from: 0, to: 14 },
  { from: 1, to: 13 },
  { from: 2, to: 12 },
  { from: 3, to: 11 },
  { from: 4, to: 10 },
  { from: 5, to: 9 },
  { from: 6, to: 8 },
  { from: 7, to: 7 },
  { from: 8, to: 6 },
  { from: 9, to: 5 },
  { from: 10, to: 4 },
  { from: 11, to: 3 },
  { from: 12, to: 2 },
  { from: 13, to: 1 },
  { from: 14, to: 0 },
  // 左眉
  { from: 19, to: 15 },
  { from: 20, to: 16 },
  { from: 21, to: 17 },
  { from: 22, to: 18 },
  // 左目
  { from: 24, to: 29 },
  { from: 27, to: 32 },
  { from: 26, to: 31 },
  { from: 66, to: 70 },
  { from: 23, to: 28 },
  { from: 63, to: 67 },
  { from: 64, to: 68 },
  { from: 25, to: 30 },
  { from: 65, to: 69 },
  // 右眉
  { from: 18, to: 22 },
  { from: 17, to: 21 },
  { from: 16, to: 20 },
  { from: 15, to: 19 },
  // 右目
  { from: 29, to: 24 },
  { from: 32, to: 27 },
  { from: 31, to: 26 },
  { from: 69, to: 65 },
  { from: 30, to: 25 },
  { from: 68, to: 64 },
  { from: 67, to: 63 },
  { from: 28, to: 23 },
  { from: 70, to: 66 },
  // 鼻
  { from: 33, to: 33 },
  { from: 41, to: 41 },
  { from: 62, to: 62 },
  { from: 37, to: 37 },
  { from: 34, to: 40 },
  { from: 35, to: 39 },
  { from: 36, to: 38 },
  { from: 42, to: 43 },
  { from: 43, to: 42 },
  { from: 38, to: 36 },
  { from: 39, to: 35 },
  { from: 40, to: 34 },
  // 口
  { from: 47, to: 47 },
  { from: 46, to: 48 },
  { from: 45, to: 49 },
  { from: 44, to: 50 },
  { from: 61, to: 59 },
  { from: 60, to: 60 },
  { from: 56, to: 58 },
  { from: 57, to: 57 },
  { from: 55, to: 51 },
  { from: 54, to: 52 },
  { from: 53, to: 53 },
  { from: 52, to: 54 },
  { from: 51, to: 55 },
  { from: 50, to: 44 },
  { from: 58, to: 56 },
  { from: 59, to: 61 },
  { from: 49, to: 45 },
  { from: 48, to: 46 },
];

export const FaceTracker = ({ video }) => {
  const useStyles = makeStyles(() => ({
    video: {
      transform: "scaleX(-1)",
    },
    canvas: {
      display: "none",
    },
  }));

  const classes = useStyles();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [params,setParams]=useState({});
  // let params={};

  const swapPosition = (positions) => {
    if (positions === false) {
      return false;
    }

    let afterSwappingPosition = [];
    for (let i = 0; i < faceCoordinateIndexForMapping.length; i++) {
      afterSwappingPosition[faceCoordinateIndexForMapping[i].to] =
        positions[faceCoordinateIndexForMapping[i].from];
    }

    return afterSwappingPosition;
  };

  const drawFacePosition = (ctx, p) => {
    for (let i = 0; i < p.length; i++) {
      ctx.fillText(i, p[i][0], p[i][1]);
    }
  };

  const getDistance2 = (position, a, b) => {
    return (
      Math.pow(position[a][0] - position[b][0], 2) +
      Math.pow(position[a][1] - position[b][1], 2)
    );
  };

  let cc=null;
  let ctracker=null;

  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      videoRef.current.srcObject = video.stream;

      ctracker = new clm.tracker();
      ctracker.init();

      let box = [0, 0, 400, 260];
      ctracker.start(videoRef.current, box);

      document.addEventListener("clmtrackrConverged", () =>
        console.log("Converged")
      );
      document.addEventListener("clmtrackrLost", () => console.log("Lost"));

      cc = canvasRef.current.getContext("2d");

      let parameter = {};

      function drawLoop() {
        // ここで毎フレームdrawLoopを呼び出すように設定する．
        requestAnimationFrame(drawLoop);

        // 毎フレーム出力用のキャンバスをクリアする．これをしないと重ね書きのようになってしまう．
        cc.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        let positions = ctracker.getCurrentPosition();
        // const positions = swapPosition(positionsFromCtracker);

        if (positions) {
          let faceR = Math.sqrt(getDistance2(positions, 37, 2));
          let faceL = Math.sqrt(getDistance2(positions, 37, 12));
          let mouthH = Math.sqrt(getDistance2(positions, 57, 60));
          let lipH = Math.sqrt(getDistance2(positions, 53, 57));

          parameter["PARAM_ANGLE_X"] =
            Math.asin((faceL - faceR) / (faceL + faceR)) * (180 / Math.PI) * 2;
          parameter["PARAM_ANGLE_Y"] =
            Math.asin(
              ((positions[0][1] +
                positions[14][1] -
                positions[27][1] -
                positions[32][1]) *
                2) /
                (positions[14][0] - positions[0][0])
            ) *
            (180 / Math.PI);
          parameter["PARAM_ANGLE_Z"] =
            -Math.atan(
              (positions[32][1] - positions[27][1]) /
                (positions[32][0] - positions[27][0])
            ) *
            (180 / Math.PI);
          // mouth
          parameter["PARAM_MOUTH_OPEN_Y"] = mouthH / lipH - 0.5;
          parameter["PARAM_MOUTH_FORM"] =
            2 *
              Math.sqrt(
                getDistance2(positions, 50, 44) /
                  getDistance2(positions, 30, 25)
              ) -
            1;
          // eye ball
          parameter["PARAM_EYE_BALL_X"] =
            Math.sqrt(
              getDistance2(positions, 27, 23) / getDistance2(positions, 25, 23)
            ) - 0.5;
          parameter["PARAM_EYE_BALL_Y"] =
            Math.sqrt(
              getDistance2(positions, 27, 24) / getDistance2(positions, 26, 24)
            ) - 0.5;
          // eye brow
          parameter["PARAM_BROW_L_Y"] =
            (2 * Math.sqrt(getDistance2(positions, 24, 21))) / lipH - 4;
          parameter["PARAM_BROW_R_Y"] =
            (2 * Math.sqrt(getDistance2(positions, 29, 17))) / lipH - 4;
        }

        console.log(parameter);
        setParams((prevParams)=>parameter);
        console.log(params);

        if (positions !== false) {
          drawFacePosition(cc, positions);
        }
        // console.log(ctracker.getCurrentPosition());
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
      <canvas
        className={classes.canvas}
        ref={canvasRef}
        width={400}
        height={300}
      ></canvas>
      <Live2DCanvas params={params}></Live2DCanvas>
    </Grid>
  );
};
