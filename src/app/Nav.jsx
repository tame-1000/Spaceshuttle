import React from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { AppBar } from "@material-ui/core";
import { Toolbar } from "@material-ui/core";
import { Button } from "@material-ui/core";

import { auth } from "../firebase/firebase";

const useStyles = makeStyles({
  // This group of buttons will be aligned to the right
  rightToolbar: {
    marginLeft: "auto",
    marginRight: -12,
  },
  menuButton: {
    marginRight: 16,
    marginLeft: -12,
  },
});

const Nav = (location) => {
  const history = useHistory();
  const style = useStyles();
  const handleLogout = () => {
    auth.signOut();
    history.push("/signin");
  };

  return (
    <div style={{ height: "10%" }}>
      <AppBar position="static">
        <Toolbar>
          <Button onClick={handleLogout}>ログアウト</Button>
          <section className={style.rightToolbar}>
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <Button variant="outlined" fullWidth>
                アバター設定
              </Button>
            </Link>
          </section>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Nav;
