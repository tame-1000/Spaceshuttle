import React, { useState, useEffect } from "react";
import { useHistory, Redirect, Link } from "react-router-dom";
import { db } from "../firebase/firebase";
import { useAuthContext } from "../context/authcontext";

import { Container, Grid, Button } from "@material-ui/core";

import RoomCard from "../component/RoomCard";
import ImageSrc from "../img/seats.jpg";

const RoomSetting = () => {
  const { user, isAdmin } = useAuthContext();
  const [movieList, setMovieList] = useState([]);

  // 最初のレンダリングで動画データを読み込む
  useEffect(() => {
    const current_movielist = [];
    (async () => {
      // 動画データを取得し、リストに（title, desc）
      const mres_ovie = await db
        .collection("movie")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            data["movieid"] = doc.id; // 動画idを保存
            current_movielist.push(data); // （title, desc, movieid）
          });
        });
      setMovieList(current_movielist);
    })();
  }, []);

  // 個別動画ページに飛ぶ関数
  const pushLink = (movieid) => {
    console.log(movieid);
  };

  if (!isAdmin) {
    return <Redirect to="/"></Redirect>;
  } else {
    return (
      <Container>
        <h1>部屋をつくる</h1>
        <Grid container spacing={5}>
          {movieList.map((content, index) => {
            console.log(content);
            return (
              <RoomCard
                title={content.title}
                desc={content.desc}
                img={ImageSrc}
                index={index}
                key={index}
                movieid={content.movieid}
                onClick={pushLink}
              ></RoomCard>
            );
          })}
        </Grid>
      </Container>
    );
  }
};

export default RoomSetting;
