import React, { useState, useEffect } from "react";
import { useHistory, Redirect, Link } from "react-router-dom";
import { Button, Container } from "@material-ui/core";
import { db } from "../firebase/firebase";
import { useAuthContext } from "../context/authcontext";

const RoomSetting = () => {
  const { user, isAdmin } = useAuthContext();

  if (!isAdmin) {
    return <Redirect to="/"></Redirect>;
  } else {
    return (
      <Container justify="center" spacing={4}>
        <h1>映画部屋を作る画面</h1>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="outlined">トップページに戻る</Button>
        </Link>
      </Container>
    );
  }
};

export default RoomSetting;
