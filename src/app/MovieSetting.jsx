import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Box, TextField, Button, Container } from "@material-ui/core";
//import { Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
//import { Formik } from 'formik';
//import * as Yup from 'yup';
import db from "../firebase/firebase";
import Peer from "skyway-js";

const MovieSetting = () => {
  const peer = new Peer({ key: process.env.SKYWAY_KEY, debug: 3 });
  const [groupname, setGroupname] = useState("みんなの部屋");

  useEffect(() => {
    peer.on("open", () => {
      $("#peer-id").text("Peer ID : " + peer.id);
    });
    console.log(peer.id);
  }, []);

  const handleSubmit = async (groupname) => {
    try {
      await db
        .collection("room")
        .add({ peerid: peer.id, groupname: groupname });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container justify="center" spacing={4}>
      <h1>映画部屋を作る画面</h1>
      <p id="peer-id"></p>
      {/* <form>
        <p id="peer-id"></p>
        <label>
          グループ名
        </label>
        <input name="group_name" placeholder="グループ名を入力" autoComplete="off" />
        <input type="submit" value="登録" onClick={createRoomToFirestore}></input>
      </form> */}
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          id="group_name"
          label="グループ名"
          value={groupname}
          placeholder="グループ名を入力"
          autoComplete="off"
          InputProps={{ groupname: "group_name" }}
          onChange={(e) => {
            const currentGroupname = e.target.value;
            setGroupname(currentGroupname);
          }}
        ></TextField>
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => handleSubmit(groupname)}
        >
          登録
        </Button>
      </Box>
    </Container>
  );
};

export default MovieSetting;
