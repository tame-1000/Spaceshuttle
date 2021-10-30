import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Button, Container } from "@material-ui/core";

const MovieSetting = () => {
  return (
    <Container alignItems="center" justify="center" spacing={4}>
      <h1>映画部屋を作る画面</h1>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="outlined">トップページに戻る</Button>
      </Link>
    </Container>
  );
};

export default MovieSetting;
