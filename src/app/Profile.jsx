import React from "react";
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
    
    return (
    <Container >
      <Grid container spacing={5}>
        <Grid item xs={7} >
          <Grid container spacing={3}>
              <Grid item xs={12}>
                アバターアイコン一覧
              </Grid>
              <Grid item xs={4}>
                <Avatar>
                    1
                </Avatar>
              </Grid>
              <Grid item xs={4}>
                <Avatar>
                    2
                </Avatar>
              </Grid>
              <Grid item xs={4}>
                <Avatar>
                    3
                </Avatar>
              </Grid>
              <Grid item xs={4}>
                <Avatar>
                    4
                </Avatar>
              </Grid>
              <Grid item xs={4}>
                <Avatar>
                    5
                </Avatar>
              </Grid>
              <Grid item xs={4}>
                <Avatar>
                    6
                </Avatar>
              </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={3}>
              <Grid item xs={12}>
                アバター全体図
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