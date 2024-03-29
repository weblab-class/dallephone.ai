import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";

import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import EndScreen from "./pages/EndScreen.js";
import Test from "./pages/Test.js";
import Lobby from "./pages/Lobby.js";
import LobbyNotFound from "./pages/LobbyNotFound.js";
import GameScreen from "./pages/GameScreen.js";
import LobbyStarted from "./pages/LobbyStarted.js";
import LobbyFull from "./pages/LobbyFull.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Skeleton
            path="/"
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            userId={userId}
          />
        }
      />
      <Route path="/lobbyNotFound" element={<LobbyNotFound />} />
      <Route path="/lobbyStarted" element={<LobbyStarted />} />
      <Route path="/lobbyFull" element={<LobbyFull />} />
      <Route path="/lobby/:game_id" element={<Lobby />} />
      <Route path="/game/:game_id" element={<GameScreen />} />
      <Route path="/endscreen" element={<EndScreen />} />
      <Route path="/test" element={<Test />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
