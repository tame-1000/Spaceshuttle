import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";

export const FaceTracker = ({ video, canvasId, avatarId }) => {
  const useStyles = makeStyles(() => ({
    video: {
      transform: "scaleX(-1)",
      display: "none",
    },
    canvas: {
      display: "none",
    },
    glcanvas:{
      // width: "200",
      // height: "200",
    }
  }));

  const classes = useStyles();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const ctrackerRef = useRef(null);

  let L2D_XRef = useRef(null);
  let L2D_YRef = useRef(null);
  let L2D_ZRef = useRef(null);
  let mlRef = useRef(null);
  let mrRef = useRef(null);
  let moRef = useRef(null);

  const getDistance2 = (position, a, b) => {
    return (
      Math.pow(position[a][0] - position[b][0], 2) +
      Math.pow(position[a][1] - position[b][1], 2)
    );
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = video.stream;

      ctrackerRef.current = new clm.tracker();

      ctrackerRef.current.init();

      ctrackerRef.current.start(videoRef.current);

      // startを2回実行すると良い
      let box = [0, 0, 400, 260];
      ctrackerRef.current.start(videoRef.current, box);

      document.addEventListener("clmtrackrConverged", () =>
        console.log("Converged")
      );
      document.addEventListener("clmtrackrLost", () => console.log("Lost"));

      let parameter = {};

      let glcanvas = new Simple3(canvasId, avatarId);

      function loop() {
        var L2D_X = document.getElementById("L2D_X"+"_"+canvasId);
        var L2D_Y = document.getElementById("L2D_Y"+"_"+canvasId);
        var L2D_Z = document.getElementById("L2D_Z"+"_"+canvasId);
        var ml = document.getElementById("ml"+"_"+canvasId);
        var mr = document.getElementById("mr"+"_"+canvasId);
        var mo = document.getElementById("mo"+"_"+canvasId);
    

        let positions = ctrackerRef.current.getCurrentPosition();

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
          parameter["PARAM_MOUTH_OPEN_Y"] =
            mouthH / lipH - 0.5;
          // eye brow
          parameter["PARAM_BROW_L_Y"] =
            (2 * Math.sqrt(getDistance2(positions, 24, 21))) / lipH - 4;
          parameter["PARAM_BROW_R_Y"] =
            (2 * Math.sqrt(getDistance2(positions, 29, 17))) / lipH - 4;

          L2D_X.value = parameter["PARAM_ANGLE_X"];
          L2D_Y.value = parameter["PARAM_ANGLE_Y"];
          L2D_Z.value = parameter["PARAM_ANGLE_Z"];

          ml.value = parameter["PARAM_BROW_L_Y"];
          mr.value = parameter["PARAM_BROW_R_Y"];
          mo.value = parameter["PARAM_MOUTH_OPEN_Y"];
        }
        // ここで毎フレームloopを呼び出すように設定する．
        requestAnimationFrame(loop);
      }

      requestAnimationFrame(loop);
    }

    return () => {
      if(ctrackerRef.current){
        ctrackerRef.current.stop();
      }
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
      <canvas className={classes.glcanvas} id={"glcanvas" + "_" + canvasId} />
      <div style={{ display: "none" }}>
        PARAM_Y
        <input
          type="range"
          id={"L2D_Y" + "_" + canvasId}
          ref={L2D_YRef}
          defaultValue="0.0"
          min="-70.0"
          max="70.0"
          step="1.0"
        />
        PARAM_X
        <input
          type="range"
          id={"L2D_X" + "_" + canvasId}
          ref={L2D_XRef}
          defaultValue="0.0"
          min="-70.0"
          max="70.0"
          step="1.0"
        />
        PARAM_Z
        <input
          type="range"
          id={"L2D_Z" + "_" + canvasId}
          ref={L2D_ZRef}
          defaultValue="0.0"
          min="-70.0"
          max="70.0"
          step="1.0"
        />
        ml
        <input
          type="range"
          id={"ml" + "_" + canvasId}
          ref={mlRef}
          defaultValue="0.0"
          min="-1.0"
          max="1.0"
          step="1.0"
        />
        mr
        <input
          type="range"
          id={"mr" + "_" + canvasId}
          ref={mrRef}
          defaultValue="0.0"
          min="-1.0"
          max="1.0"
          step="1.0"
        />
        mo
        <input
          type="range"
          id={"mo" + "_" + canvasId}
          ref={moRef}
          defaultValue="0.0"
          min="-1.0"
          max="2.0"
          step="0.5"
        />
        <br />
        サイズ
        <input
          type="range"
          id="SCALE"
          defaultValue="3.0"
          min="0.0"
          max="5.0"
          step="0.1"
        />
        <br />
        位置X
        <input
          type="range"
          id="POS_X"
          defaultValue="0.0"
          min="-3.0"
          max="3.0"
          step="0.1"
        />
        <br />
        位置Y
        <input
          type="range"
          id="POS_Y"
          defaultValue="-0.8"
          min="-3.0"
          max="3.0"
          step="0.1"
        />
      </div>
    </Grid>
  );
};
