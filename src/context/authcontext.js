import React from "react";
import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../firebase/firebase";

const AuthContext = createContext();

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const value = {
    user,
    isAdmin,
    loading,
  };

  useEffect(() => {
    // マウント時に1度のみ実行
    // Firebaseログイン中はuserにユーザ名、ログアウト中はnull
    const unsubscribed = auth.onAuthStateChanged((user) => {
      setUser(user);
      // ログインユーザ名をstateに
      if (user.uid == "1ELDuwAE3pZdw0XXo0F627TuK822") setIsAdmin(true);
      setLoading(false);
    });
    return () => {
      // ログアウト時
      unsubscribed();
    };
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
