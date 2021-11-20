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
  const [roomlist, setRoomlist] = useState([""]);

  // 最初のレンダリングで動画データを読み込む
  useEffect(() => {
    (async () => {
      const current_roomlist = [];
      // 部屋データを取得し、リストに（roomid, movieid, people, groupname）
      const res_room = await db
        .collection("room")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            data["roomid"] = doc.id; // ルームidを保存
            current_roomlist.push(data);
          });
        });
      // 部屋リストの各要素ごとに、動画データを取得する（title, desc）
      for (let i = 0; i < current_roomlist.length; i++) {
        let movieid = current_roomlist[i].movieid;
        const res_movie = await db
          .collection("movie")
          .doc(movieid)
          .get()
          .then((docSnapshot) => {
            const movie_data = docSnapshot.data();
            // 動画タイトルと説明を保存
            current_roomlist[i]["title"] = movie_data.title;
            current_roomlist[i]["desc"] = movie_data.desc;
          });
      }
      setRoomlist(current_roomlist); // トップページに表示する動画リストのstateを更新
    })();
  }, []);

  // 個別動画ページに飛ぶ関数
  const pushLink = (roomid) => {
    //history.push(`/movie/${roomid}`);
    history.push(`/movie/${roomid}`);
  };

  if (!user) {
    // ログインしていないときはサインインページに
    return <Redirect to="/signin" />;
  } else {
    // ログインしたらトップページを描写
    return (
      <Container>
        <Grid container spacing={5}>
          {roomlist.map((content, index) => (
            <MovieCard
              title={content.title}
              desc={content.desc}
              img={ImageSrc}
              num={content.people}
              index={index}
              key={index}
              roomid={content.roomid}
              onClick={pushLink}
            ></MovieCard>
          ))}
        </Grid>
      </Container>
    );
  }
};

export default Top;
