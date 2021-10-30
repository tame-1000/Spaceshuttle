import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";

const Top = () => {
  return (
    <div>
      <Grid container alignItems="center" justify="center" spacing={4}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h1>トップページ</h1>
        </Grid>
        <Grid item xs={4} style={{ textAlign: "center" }}>
          <Link to="/moviesetting" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              部屋を作る
            </Button>
          </Link>
        </Grid>
        <Grid item xs={4} style={{ textAlign: "center" }}>
          <Link to="/movie" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              映画を見る
            </Button>
          </Link>
        </Grid>

        <Grid item xs={4} style={{ textAlign: "center" }}>
          <Link to="/signin" style={{ textDecoration: "none" }}>
            <Button variant="outlined" color="primary">
              サインイン画面（仮）
            </Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};

export default Top;
