import React from "react";
import { useHistory } from "react-router-dom";
import { AppBar } from "@material-ui/core";
import { Toolbar } from "@material-ui/core";
import { Button } from "@material-ui/core";

import { auth } from "../firebase/firebase";

const Nav = (location) => {
  const history = useHistory();
  const handleLogout = () => {
    auth.signOut();
    history.push("/signin");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button onClick={handleLogout}>ログアウト</Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Nav;
