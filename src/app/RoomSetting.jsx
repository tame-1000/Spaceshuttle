import React, { useState, useEffect } from "react";
import { useHistory, Redirect, Link } from "react-router-dom";
import Modal from "react-modal";

import { db, storage } from "../firebase/firebase";
import { useAuthContext } from "../context/authcontext";
import RoomCard from "../component/RoomCard";

import { useTheme, makeStyles, Theme, Avatar } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/styles";
import {
  Container,
  Grid,
  Button,
  Typography,
  TextField,
  Box,
} from "@material-ui/core";

const useStyles = (theme) => {
  return makeStyles({
    form: {
      backgroundColor: "#f2f2f2",
      padding: "16px",
    },
    formBlock: {
      width: "100%",
      height: "30px",
      margin: "2em 0",
    },
    button: {
      width: "100%",
      height: "50px",
      margin: "2em 0",
    },
  });
};

const modalStyles = {
  content: {
    width: "70%",
    height: "60%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    overflowY: "scroll",
  },
};

const RoomSetting = () => {
  const { user, isAdmin } = useAuthContext();
  const [movieList, setMovieList] = useState([]);
  const [groupname, setGroupname] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [movie, setMovie] = useState();

  const theme = useTheme();
  const styles = useStyles(theme)();
  const history = useHistory();

  // 最初のレンダリングで動画データを読み込む
  useEffect(() => {
    const current_movielist = [];
    (async () => {
      // 動画データを取得し、リストに（title, desc）
      const res_movie = await db
        .collection("movie")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            data["movieid"] = doc.id; // 動画idを保存
            data[
              "image"
            ] = `https://storage.googleapis.com/tame1000-f44bc.appspot.com/${doc.id}.png`;
            current_movielist.push(data); // （title, desc, movieid）
          });
        });
      setMovieList(current_movielist);
    })();
  }, []);

  const onChangeGroupName = (e) => {
    const currentGroupName = e.target.value;
    setGroupname(currentGroupName);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const cardClick = (movieid) => {
    closeModal();
    setMovie(movieid);
  };

  const registerDB = async () => {
    try {
      const roomRef = await db.collection("room").doc();
      await roomRef.set({
        groupname: groupname,
        peerid: roomRef.id,
        movieid: movie,
        people: 1,
      });
      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };
  console.log(movie);

  if (!isAdmin) {
    return <Redirect to="/"></Redirect>;
  } else {
    return (
      <Container>
        <Typography component="h1" variant="h5">
          ユーザ登録
        </Typography>
        <Grid container spacing={5}>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <Box component="form" noValidate spacing={3}>
              <TextField
                className={styles.formBlock}
                id="groupname"
                label="ルーム名"
                value={groupname}
                placeholder="Groupname"
                autoComplete="groupname"
                InputProps={{ groupname: "groupname" }}
                onChange={(e) => onChangeGroupName(e)}
                fullWidth
              />
              <TextField
                className={styles.formBlock}
                style={{ color: "black" }}
                id="movieid"
                label={movie}
                fullWidth
                disabled
              />
              <Button
                onClick={openModal}
                className={styles.formBlock}
                variant="contained"
              >
                動画を選ぶ
              </Button>
            </Box>
          </Grid>
          <Grid item xs={4}></Grid>

          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <Button
              type="button"
              fullWidth
              className={styles.button}
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={registerDB}
            >
              部屋をつくる
            </Button>
          </Grid>
          <Grid item xs={4}></Grid>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
            style={modalStyles}
            contentLabel="MovieList"
          >
            <Grid container spacing={3}>
              {movieList.map((content, index) => {
                return (
                  <RoomCard
                    title={content.title}
                    desc={content.desc}
                    img={content.image}
                    index={index}
                    key={index}
                    movieid={content.movieid}
                    onClick={cardClick}
                  ></RoomCard>
                );
              })}
            </Grid>
          </Modal>
        </Grid>
      </Container>
    );
  }
};

export default RoomSetting;
