import React from "react";
import { useLocation } from "react-router-dom";

import { AuthProvider } from "../context/authcontext";
import Nav from "./Nav";

const Layout = (props) => {
  const location = useLocation();
  return (
    <>
      <AuthProvider>
        <Nav pathname={location.pathname}></Nav>
        <div
          style={{
            paddingTop: "80px",
            height: "100%",
            backgroundColor: "#F8F8FF",
          }}
        >
          {props.children}
        </div>
      </AuthProvider>
    </>
  );
};

export default Layout;
