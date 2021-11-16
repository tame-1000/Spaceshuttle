import { Button, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";

export const MovieModal = ({onJoin}) => {
  const useStyles = makeStyles(() => ({
    overlay: {
      /*　画面全体を覆う設定　*/
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",

      /*　画面の中央に要素を表示させる設定　*/
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      zIndex: "2",
      width: "50%",
      padding: "1em",
      background: "#fff",
    },
  }));

  const classes = useStyles();

  const [show, setShow] = useState(true);

  if (show) {
    return (
      <div id="overlay" className={classes.overlay}>
        <div id="content" className={classes.content}>
          <p>このRoomに参加しますか？</p>
          <p>
            <Button onClick={() => {
                onJoin();
                setShow(false);
            }}>Join</Button>
          </p>
        </div>
      </div>
    );
  } else {
    return null;
  }
};
