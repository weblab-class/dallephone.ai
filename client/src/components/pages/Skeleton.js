import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./Skeleton.css";
import NewPrompt from "../modules/NewPromptInput";
import Dalle from "../modules/Dalle";
import Lobby from "../pages/Lobby";
import JoinGameForm from "../modules/JoinGameForm";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { socket } from "../../client-socket.js";

import grid from "../../components/img/grid.svg";
import logo from "../img/logo.jpg";
import grid from "../../components/img/grid.svg";
import logo from "../img/logo.jpg";

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

  useEffect(() => {
    if (socket.id != undefined) {
      // If the user is logged in, emit the leaveLobby event
      socket.emit("leaveLobby", socket.id);
    }
  }, [socket.id]);

  //Reset game_id to #### when user logs in
  useEffect(() => {
    if (userId != undefined) {
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

  const bg = {
    backgroundImage: `url(${grid})`,
    height: "100vh",
    width: "100vw",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
    width: "100%",
  };

  const panelStyle = {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: "150px",
  };

  const buttonStyle =
    "text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2 px-4 rounded shadow-md hover:shadow-lg transition duration-200 border-2 border-emerald-900 border-opacity-50";

  const googleButtonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "60px",
  };

  // Website Frontend
  return (
    <div style={bg}>
      {/* Header Section */}
      <div style={headerStyle}>
        <span style={{ fontSize: "56px", marginTop: "100px" }}>DALL-E Phone</span>
      </div>

      <div style={googleButtonContainerStyle}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {userId ? (
            <button
              className={buttonStyle}
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
      </div>

      {/* Panels Section */}
      <div style={panelStyle} className="flex flex-wrap">
        {/* Create New Game Panel */}
        <div className="border-4 w-1/4 p-4 mr-2">
          <button className={buttonStyle} onClick={createNewGame}>
            Create New Game
          </button>
        </div>
        <div className="border-4 w-1/4 p-4">How to play</div>
        {/* Join Game Panel */}
        <div className="border-4 w-1/4 p-4 ml-2">
          <JoinGameForm />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
