import React, { useState } from "react";
import { useTheme, makeStyles, Theme } from "@material-ui/core";
import { Container, Grid, Card, TextField, Button } from "@material-ui/core";

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

const Signin = () => {
  const theme = useTheme();
  const styles = useStyles(theme)();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [helperName, setHelperName] = useState("");
  const [helperPassword, setHelperPassword] = useState("");
  const [sendFlag, setSendFlag] = useState(false);

  let isValid = () => {
    return /^[0-9a-zA-Z]{0,6}$/.test(val);
  };

  let checkSend = () => {
    if (name.length === 0) {
      return false;
    }
    if (password.length === 0) {
      return false;
    }
    if (isValid(password)) {
      return true;
    }
    return false;
  };

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
              id="username"
              label="UserName"
              value={name}
              placeholder="UserName"
              helperText={helperName}
              autoComplete="username"
              InputProps={{ name: "username" }}
              onChange={(e) => {
                const currentName = e.target.value;
                if (isValid(currentName)) {
                  setName(currentName);
                  setHelperName("");
                } else {
                  setHelperName("invalid Name");
                }
                setSendFlag(!checkSend(currentName, password));
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
                if (isValid(currentPassword)) {
                  setPassword(currentPassword);
                  setHelperPassword("");
                } else {
                  setHelperPassword("invalid Password");
                }
                setSendFlag(!checkSend(name, currentPassword));
              }}
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              size="large"
              disabled={sendFlag}
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
