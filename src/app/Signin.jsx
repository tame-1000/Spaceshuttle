import React, { useState } from "react";
import { useTheme, makeStyles, Theme } from "@material-ui/core";
import {
  Container,
  Grid,
  Card,
  TextField,
  Button,
  Link,
} from "@material-ui/core";
import { auth } from "../firebase/firebase";

const useStyles = (theme) => {
  return makeStyles({
    container: {
      flexGrow: 1,
      padding: theme.spacing(2),
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

const handleSubmit = async (email, password) => {
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

const Signin = () => {
  const theme = useTheme();
  const styles = useStyles(theme)();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [helperEmail, setHelperEmail] = useState("");
  const [helperPassword, setHelperPassword] = useState("");

  return (
    <Container>
      <Card>
        <Grid
          container
          justifyContent="center"
          className={styles.container}
          spacing={1}
        >
          <Grid item xs={12}>
            <h1>ログイン</h1>
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs>
            <Link href="#" variant="body2">
              メールアドレス・パスワードを忘れた方
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Link href="#" variant="body2">
              {"ユーザ登録へ"}
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              className={styles.button}
              size="large"
              onClick={() => handleSubmit(email, password)}
            >
              ログインする
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Signin;
