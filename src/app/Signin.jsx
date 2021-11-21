import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
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

import ImageSrc from "../img/seats.jpg";

import { auth } from "../firebase/firebase";

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

const Signin = () => {
  const theme = useTheme();
  const styles = useStyles(theme)();
  const [email, setEmail] = useState("test@mail.com");
  const [password, setPassword] = useState("");
  const [helperEmail, setHelperEmail] = useState("");
  const [helperPassword, setHelperPassword] = useState("");

  const history = useHistory();

  const handleSubmit = async (email, password) => {
    console.log("signin");
    try {
      await auth.signInWithEmailAndPassword(email, password);
      history.push("/");
    } catch (error) {
      console.log(error.code);
      switch (error.code) {
        case "auth/invalid-email":
          alert("メールアドレスの形式が間違っています。");
          break;
        case "auth/user-not-found":
          alert("メールアドレスもしくはパスワードが間違っています。");
          break;
        case "auth/wrong-password":
          alert("メールアドレスもしくはパスワードが間違っています。");
          break;
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container className={styles.container}>
        <Grid item xs={false} sm={4} md={7} sx={{ height: "100vh" }}>
          <CardMedia component="img" height="100%" image={ImageSrc} />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              サインイン
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                className={styles.textField}
                id="email"
                label="Email"
                value={email}
                placeholder="Email"
                helperText={helperEmail}
                autoComplete="email"
                InputProps={{ email: "email" }}
                onChange={(e) => {
                  const currentEmail = e.target.value;
                  setEmail(currentEmail);
                  setHelperEmail("");
                }}
              ></TextField>
              <TextField
                className={styles.textField}
                type="password"
                id="password"
                label="Password"
                placeholder=""
                value={password}
                helperText={helperPassword}
                autoComplete="current-password"
                onChange={(e) => {
                  const currentPassword = e.target.value;
                  setPassword(currentPassword);
                  setHelperPassword("");
                }}
              ></TextField>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => handleSubmit(email, password)}
              >
                サインイン
              </Button>
              {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                */}
              <Grid container>
                <Grid item xs>
                  <Link
                    to="#"
                    variant="body2"
                    style={{ textDecoration: "none" }}
                  >
                    パスワードをお忘れですか？
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    to="/register"
                    variant="body2"
                    style={{ textDecoration: "none" }}
                  >
                    {"ユーザ登録へ"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Signin;
