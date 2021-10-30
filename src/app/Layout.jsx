import React from "react";
import { useLocation } from "react-router-dom";

import { AuthProvider } from "../context/authcontext";
import Nav from "./Nav";

const Layout = (props) => {
  const location = useLocation();
  return (
    <>
      <AuthProvider>
        <Nav></Nav>
        <>{props.children}</>
        {/*<Footer></Footer>*/}
      </AuthProvider>
    </>
  );
};

export default Layout;
