import React              from "react";
import ReactDOM           from "react-dom";
import "./index.css";
import App                from "./App";
import * as serviceWorker from "./serviceWorker";
import firebase           from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBhZ-voT3a03bH-BuzwoQ1poCzWnL25f0Y",
  authDomain: "script-writer-b115a.firebaseapp.com",
  databaseURL: "https://script-writer-b115a.firebaseio.com",
  projectId: "script-writer-b115a",
  storageBucket: "script-writer-b115a.appspot.com",
  messagingSenderId: "638753058731",
  appId: "1:638753058731:web:aa4f0bb0c6c10c5c36ecee",
  measurementId: "G-SQ0TC9BM4Y",
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App/>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
