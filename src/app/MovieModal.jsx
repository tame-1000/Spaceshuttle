import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import {
  makeStyles,
  Container,
  Grid,
  Button,
  Typography,
  TextField,
  Box,
} from "@material-ui/core";

export const MovieModal = (props) => {
  const useStyles = makeStyles(() => ({
    text: {
      textAlign: "center",
      margin: "2em 0",
    },
    button: {
      margin: "2em auto",
    },
  }));

  const modalStyles = {
    content: {
      width: "40%",
      height: "20%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const classes = useStyles();
  const [isJoin, setIsJoin] = useState(false);

  const closeModal = () => {
    setIsJoin(true);
  };

  const onClose = () => {
    props.onJoin();
    closeModal();
  };

  return (
    <Modal
      isOpen={!isJoin}
      onRequestClose={closeModal}
      ariaHideApp={false}
      contentLabel="ConfirmJoin"
      style={modalStyles}
    >
      <Container>
        <Typography className={classes.text}>
          このRoomに参加しますか？
        </Typography>
        <Typography className={classes.text}>
          <Button onClick={onClose} variant="outlined" color="primary">
            Join
          </Button>
        </Typography>
      </Container>
    </Modal>
  );
};
