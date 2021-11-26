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
        {location.pathname !== "/signin" &&
        location.pathname !== "/register" ? (
          <div
            style={{
              paddingTop: "80px",
              backgroundColor: "#F8F8FF",
              minHeight: "100%",
            }}
          >
            {props.children}
          </div>
        ) : (
          <div
            style={{
              height: "100%",
            }}
          >
            {props.children}
          </div>
        )}
      </AuthProvider>
    </>
  );
};

export default Layout;
