import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Box, TextField, Button, Container } from "@material-ui/core";
//import { Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
//import { Formik } from 'formik';
//import * as Yup from 'yup';
import db from "../firebase/firebase";
import Peer from "skyway-js";

const MovieSetting = () => {
  const peer = new Peer({key: process.env.SKYWAY_KEY, debug: 3});

  peer.on('open', () => {
    $('#peer-id').text("Peer ID : " + peer.id);
  });

  const handleSubmit = async (group_name) => {
    try {
      await db.collection("room").add({ peerid: peer.id, group_name: group_name });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container justify="center" spacing={4}>
      <h1>映画部屋を作る画面</h1>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="outlined">トップページに戻る</Button>
      </Link>
      <p id="peer-id"></p>
      {/* <form>
        <p id="peer-id"></p>
        <label>
          グループ名
        </label>
        <input name="group_name" placeholder="グループ名を入力" autoComplete="off" />
        <input type="submit" value="登録" onClick={createRoomToFirestore}></input>
      </form> */}
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}
      >
        <TextField
          id="group_name"
          label="グループ名"
          value={group_name}
          placeholder="グループ名を入力"
          autoComplete="off"
          InputProps={{ group_name: "group_name" }}
        ></TextField>
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => handleSubmit(group_name)}
        >
          登録
        </Button>
      </Box>
    </Container>
  );
};

export default MovieSetting;
