import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { useHistory, Redirect } from "react-router-dom";
import { useTheme, makeStyles, Theme, Avatar } from "@material-ui/core";
import { useAuthContext } from "../context/authcontext";
import {
  Container,
  Grid,
  Card,
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  CardMedia,
  CardActionArea,
  CardContent,
} from "@material-ui/core";

import MovieCard from "../component/MovieCard";
import ImageSrc from "../img/seats.jpg";
import { auth } from "../firebase/firebase";
import { db } from "../firebase/firebase";

const useStyles = (theme) => {
  return makeStyles({
    container: {
      height: "70%",
      margin: "16px 0",
    },
    textField: {
      width: "90%",
      height: 100,
    },
    personIcon: {
      marginTop: "1em",
    },
  });
};

const Top = () => {
  const history = useHistory();
  const { user } = useAuthContext();
  const theme = useTheme();
  const styles = useStyles(theme);
  const [list, setList] = useState([""]);

  // 最初のレンダリングで動画データを読み込む
  useEffect(() => {
    (async () => {
      const li = [];
      const res = await db
        .collection("movie")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            li.push(doc.data());
          });
        });
      console.log(li);
      setList(li);
    })();
  }, []);

  if (!user) {
    return <Redirect to="/signin" />;
  } else {
    return (
      <Container>
        <Grid container spacing={5}>
          {list.map((content, index) => (
            <MovieCard
              title={content.title}
              desc={content.desc}
              img={ImageSrc}
              num={content.people}
              index={index}
              key={index}
            ></MovieCard>
          ))}
        </Grid>
      </Container>
    );
  }
};

export default Top;
