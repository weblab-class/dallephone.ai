import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./Skeleton.css";
import NewPrompt from "../modules/NewPromptInput";
import Dalle from "../modules/Dalle";
import Lobby from "../pages/Lobby";
import { useNavigate } from "react-router-dom"; // Import useNavigate

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "235996742175-sitk3csm3imr5ccgfb06f9a0f5pbbmg4.apps.googleusercontent.com";

const Skeleton = ({ userId, handleLogin, handleLogout }) => {
  const [prompt, setPrompt] = useState("");
  const [triggerFetch, setTriggerFetch] = useState(false);
  const navigate = useNavigate(); // For redirecting to the new game lobby

  //Some dalle helper functions for
  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTriggerFetch(true);
  };

  //Reset game_id to #### when user logs in
  useEffect(() => {
    if (userId) {
      const body = { game_id: "####" };
      // User is logged in, update their gameid
      post("/api/updateGameId", body);
    }
  }, [userId]);

  const createNewGame = async () => {
    try {
      const res = await post("/api/createNewGame");
      const gameCode = res.gameCode;
      if (gameCode) {
        // Redirect to the new game lobby
        navigate(`/lobby/${gameCode}`);
      }
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  };

  //Website Frontend
  return (
    <div>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {userId ? (
          <button
            onClick={() => {
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </button>
        ) : (
          <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
        )}
      </GoogleOAuthProvider>
      <button onClick={createNewGame}>Create New Game</button>
    </div>
  );
};

export default Skeleton;
