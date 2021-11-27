import React from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Search,
} from "@material-ui/core";

import HomeIcon from "@material-ui/icons/Home";
import MovieCreationIcon from "@material-ui/icons";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { auth } from "../firebase/firebase";
import { useAuthContext } from "../context/authcontext";

const useStyles = makeStyles({
  // This group of buttons will be aligned to the right
  rightToolbar: {
    marginLeft: "auto",
    marginRight: -12,
  },
  menuButton: {
    height: "100%",
    marginRight: 24,
    marginLeft: -12,
    color: "#fff",
    border: "none",
    "&:hover": {
      border: "solid royalblue 1px",
    },
  },
});

const Nav = (props) => {
  const history = useHistory();
  const { isAdmin } = useAuthContext();
  const style = useStyles();
  const handleLogout = () => {
    auth.signOut();
    history.push("/signin");
  };

  if (props.pathname !== "/signin" && props.pathname !== "/register") {
    return (
      <AppBar position="static">
        <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Link
            to="/"
            style={{ textDecoration: "none", height: "100%", color: "#fff" }}
          >
            <Typography
              component="h2"
              variant="h5"
              color="inherit"
              align="center"
              noWrap
              sx={{ flex: 1 }}
            >
              Space Shuttle
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 5 }} />
          {isAdmin && (
            <Link
              to="/roomsetting"
              style={{ textDecoration: "none", height: "100%" }}
            >
              <Button className={style.menuButton} fullWidth>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <MeetingRoomIcon></MeetingRoomIcon>
                  <span style={{ margin: "0 0.5em" }}>部屋をつくる</span>
                </div>
              </Button>
            </Link>
          )}
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <Button className={style.menuButton} fullWidth>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <AccountCircleIcon></AccountCircleIcon>
                <span style={{ margin: "0 0.5em" }}>アバター設定</span>
              </div>
            </Button>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={handleLogout} className={style.menuButton}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <ExitToAppIcon></ExitToAppIcon>
              <span style={{ margin: "0 0.5em" }}>ログアウト</span>
            </div>
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
  return <></>;
};

export default Nav;
