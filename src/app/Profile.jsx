import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuthContext } from "../context/authcontext";
import { useTheme, makeStyles, Theme, Avatar } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/styles";
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
} from "@material-ui/core";

const useStyles = (theme) => {
  return makeStyles({
    container: {
      height: "100%",
    },
    textField: {
      width: "90%",
      height: 100,
    },
    button: {
      width: "100%",
    },
    borderBox: {
      border: "1px",
    },
  });
};

import AvatarBox from "../component/AvatarBox";
import { db } from "../firebase/firebase";

const Profile = () => {
  const history = useHistory();
  const { user } = useAuthContext();
  const theme = useTheme();
  const styles = useStyles(theme);

  const [avatar, setAvatar] = useState("1");

  const list = [
    [1, "avator1"],
    [2, "avator2"],
    [3, "avator3"],
    [4, "avator4"],
    [5, "avator5"],
    [6, "avator6"],
  ];

  return (
    <Container>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h2>アバター選択</h2>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={3}>
            {list.map((content, index) => (
              <Grid item xs={4} key={index}>
                <AvatarBox
                  onClick={setAvatar}
                  className={content[0] == avatar && styles.borderBox}
                  id={content[0]}
                  name={content[1]}
                ></AvatarBox>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {avatar}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button variant="contained" fullWidth>
              トップページに戻る
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
