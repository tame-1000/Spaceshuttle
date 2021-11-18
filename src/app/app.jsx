import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "../style.css";

import Layout from "./Layout";

import Top from "./Top";
import Signin from "./Signin";
import Movie from "./Movie";
import MovieSetting from "./MovieSetting";
import Profile from "./Profile";
import Register from "./Register"

const root = document.getElementById("root");

const coreSource = document.createElement("source");
source.src = "../cubismSDK/Core/live2dcubismcore.js";
source.type = "module";
document.body.appendChild(coreSource);

const demoSource = document.createElement("source");
source.src = "../cubismSDK/Demo/dist/bundle.js";
source.type = "module";
document.body.appendChild(demoSource);

ReactDOM.render(
  <Router>
    <Layout>
      <Route exact path="/" component={Top}></Route>
      <Route exact path="/signin" component={Signin}></Route>
      <Route exact path="/movie" component={Movie}></Route>
      <Route exact path="/moviesetting" component={MovieSetting}></Route>
      <Route exact path="/profile" component={Profile}></Route>
      <Route exact path="/register" component={Register}></Route>
    </Layout>
  </Router>,
  {root},
  {coreSource},
  {demoSource}
);
