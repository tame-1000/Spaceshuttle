import React from "react";
import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../firebase/firebase";

const AuthContext = createContext();

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState("");

  const value = {
    user,
  };

  useEffect(() => {
    // マウント時に1度のみ実行
    // Firebaseログイン中はuserにユーザ名、ログアウト中はnull
    const unsubscribed = auth.onAuthStateChanged((user) => {
      setUser(user);
      // ログインユーザ名をstateに
    });
    return () => {
      // ログアウト時
      unsubscribed();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
