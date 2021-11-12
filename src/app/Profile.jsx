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
    });
  };

  
import { auth } from "../firebase/firebase";
const Profile = () => {
    const history = useHistory();
    const { user } = useAuthContext();
    const theme = useTheme();
    const styles = useStyles(theme)();

    const [avatar, setAvatar] = useState(0);
    
    return (
    <Container >
      <Grid container spacing={5}>
        <Grid item xs={7} >
          <Grid container spacing={3}>
              <Grid item xs={12}>
                アバターアイコン一覧
              </Grid>
              <Grid item xs={4}>
                <Avatar onClick={(e) => {setAvatar(0)}}>
                    1
                </Avatar>
              </Grid>
              <Grid item xs={4} >
                <Avatar onClick={(e) => {setAvatar(1)}}>
                    2
                </Avatar>
              </Grid>
              <Grid item xs={4}>
                <Avatar onClick={(e) => {setAvatar(2)}}>
                    3
                </Avatar>
              </Grid>
              <Grid item xs={4}>
                <Avatar onClick={(e) => {setAvatar(3)}}>
                    4
                </Avatar>
              </Grid>
              <Grid item xs={4}>
                <Avatar onClick={(e) => {setAvatar(4)}}>
                    5
                </Avatar>
              </Grid>
              <Grid item xs={4}>
                <Avatar onClick={(e) => {setAvatar(5)}}>
                    6
                </Avatar>
              </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={3}>
              <Grid item xs={12}>
                アバター全体図{avatar}
              </Grid>
              <Grid item xs={12}>
                アバター全身？画像
              </Grid>
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <Link to="/" style={{ textDecoration: "none" }}>
                <Button variant="contained" fullWidth >トップページに戻る</Button>
            </Link>
        </Grid>
      </Grid>
    </Container>
    );
}

export default Profile;