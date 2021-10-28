import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Button } from "@material-ui/core";

const Movie = () => {
  return (
    <>
      <h1>映画見る画面</h1>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="outlined">トップページに戻る</Button>
      </Link>
    </>
  );
};

export default Movie;
