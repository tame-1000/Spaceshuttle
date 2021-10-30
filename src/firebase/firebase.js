import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAydXOHswUDjqkah7589nYo-MdMQJIYrpg",
  authDomain: "tame1000-f44bc.firebaseapp.com",
  projectId: "tame1000-f44bc",
  storageBucket: "tame1000-f44bc.appspot.com",
  messagingSenderId: "617651539363",
  appId: "1:617651539363:web:a6ca584bc98d34776d9e16",
  measurementId: "G-F54NXPKFJE",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
