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

import ImageSrc from "../img/stage2.jpg";

import { auth } from "../firebase/firebase";
import { db } from "../firebase/firebase";

const useStyles = (theme) => {
  return makeStyles({
    container: {
      height: "100%",
      backgroundImage: `url(${ImageSrc})`,
    },
    form: {
      backgroundColor: "#f2f2f2",
      padding: "16px",
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

const Register = () => {
  const theme = useTheme();
  const styles = useStyles(theme)();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_re, setPassword_re] = useState("");

  const history = useHistory();

  const checkInvalidPass = (pass, pass_re) => {
    if (pass !== pass_re) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (email, pass, pass_re) => {
    if (!checkInvalidPass(pass, pass_re)) {
      alert("パスワードが一致していません");
    } else {
      try {
        await auth.createUserWithEmailAndPassword(email, pass);
        await createUserToFirestore(email);
        history.push("/signin");
      } catch (error) {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            alert("メールアドレスの形式が間違っています。");
            break;
          case "auth/email-already-in-use":
            alert("すでに登録されているメールアドレスです。");
            break;
          case "auth/weak-password":
            alert("パスワードは6文字以上にしてください。");
        }
      }
    }
  };

  // Firestoreにユーザーを追加する
  const createUserToFirestore = async (email) => {
    try {
      await db.collection("users").add({ email: email, avatarid: 1 });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container className={styles.container} justifyContent="center">
          <Grid item xs={7} className={styles.form}>
            <Typography component="h1" variant="h5">
              ユーザ登録
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
                label="メールアドレス"
                value={email}
                placeholder="Email"
                autoComplete="email"
                InputProps={{ email: "email" }}
                onChange={(e) => {
                  const currentEmail = e.target.value;
                  setEmail(currentEmail);
                }}
              ></TextField>
              <TextField
                className={styles.textField}
                type="password"
                id="password"
                label="パスワード（6文字以上）"
                placeholder=""
                value={password}
                autoComplete="current-password"
                onChange={(e) => {
                  const currentPassword = e.target.value;
                  setPassword(currentPassword);
                }}
              ></TextField>
              <TextField
                className={styles.textField}
                type="password"
                id="password_re"
                label="パスワード（再入力）"
                placeholder=""
                value={password_re}
                autoComplete="current-password_re"
                onChange={(e) => {
                  const currentPassword_re = e.target.value;
                  setPassword_re(currentPassword_re);
                }}
              ></TextField>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => handleSubmit(email, password, password_re)}
              >
                登録
              </Button>
              {/* <FormControlLabel
                      control={<Checkbox value="remember" color="primary" />}
                      label="Remember me"
                    />
                    */}
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default Register;
