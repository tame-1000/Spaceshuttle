import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import '../style.css'

import Layout from "./Layout";

import Top from "./Top";
import Signin from "./Signin";
import Movie from "./Movie";
import MovieSetting from "./MovieSetting";

const root = document.getElementById("root");
ReactDOM.render(
  <Router>
    <Layout>
      <Route exact path="/" component={Top}></Route>
      <Route exact path="/signin" component={Signin}></Route>
      <Route exact path="/movie" component={Movie}></Route>
      <Route exact path="/moviesetting" component={MovieSetting}></Route>
    </Layout>
  </Router>,
  root
);
