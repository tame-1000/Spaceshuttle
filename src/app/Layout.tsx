import React from "react";
import { useLocation } from "react-router-dom";
import { AppBar } from '@material-ui/core';
import { Toolbar } from '@material-ui/core';


const Layout = (props) => {
  const location = useLocation();
  return (
    <>
    <AppBar position="static">
      <Toolbar>Navbar</Toolbar>
    </AppBar>
      <>{props.children}</>
      {/*<Footer></Footer>*/}
    </>
  );
};

export default Layout;
