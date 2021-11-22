import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "../style.css";

import Layout from "./Layout";

import Top from "./Top";
import Signin from "./Signin";
import Movie from "./Movie";
import RoomSetting from "./RoomSetting";
import Profile from "./Profile";
import Register from "./Register";

const root = document.getElementById("root");
ReactDOM.render(
  <Router>
    <Layout>
      <Route exact path="/" component={Top}></Route>
      <Route exact path="/signin" component={Signin}></Route>
      <Route exact path="/movie/:roomid" component={Movie}></Route>
      <Route exact path="/roomsetting" component={RoomSetting}></Route>
      <Route exact path="/profile" component={Profile}></Route>
      <Route exact path="/register" component={Register}></Route>
    </Layout>
  </Router>,
  root
);