import React from "react";
import { useLocation } from "react-router-dom";

import Nav from "./Nav";

const Layout = (props) => {
  const location = useLocation();
  return (
    <>
      <Nav location={location} />
      <>{props.children}</>
      {/*<Footer></Footer>*/}
    </>
  );
};

export default Layout;
