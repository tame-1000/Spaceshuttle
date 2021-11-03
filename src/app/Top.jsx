import React from "react";
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
} from "@material-ui/core";

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
    button: {
      width: "100%",
    },
  });
};

const Top = () => {
  const history = useHistory();
  const { user } = useAuthContext();
  const theme = useTheme();
  const styles = useStyles(theme)();

  if (!user) {
    return <Redirect to="/signin" />;
  } else {
    return (
      <>
        <Grid container justifyContent="space-around" className={styles.container} >
        <Grid item xs={12} md={3} component={Paper} square>
          <Link to="/moviesetting" style={{ textDecoration: "none" }}>
            <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
              <Button variant="contained" color="primary">
                部屋を作る
              </Button>
            </Box>
        </Link>
        </Grid>
            
        <Grid item xs={12} md={3} component={Paper} square>
          <Link to="/movie" style={{ textDecoration: "none" }}>
            <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
              <Button variant="contained" color="primary">
                映画を見る
              </Button>
            </Box>
          </Link>
        </Grid>
            
        <Grid item xs={12} md={3} component={Paper} square>
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button variant="outlined" color="primary">
                プロフィール
              </Button>
            </Box>
          </Link>
        </Grid>
      </Grid>
      </>
    );
  }
};

export default Top;
