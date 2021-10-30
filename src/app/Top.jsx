import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Button } from "@material-ui/core";

const Top = () => {
  return (
    <>
      <h1>トップページ</h1>
      <Link to="/moviesetting" style={{ textDecoration: "none" }}>
        <Button variant="outlined">部屋を作る</Button>
      </Link>
      <Link to="/movie" style={{ textDecoration: "none" }}>
        <Button variant="contained">映画を見る</Button>
      </Link>
      <Link to="/signin" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="secondary">
          サインイン
        </Button>
      </Link>
    </>
  );
};

export default Top;
