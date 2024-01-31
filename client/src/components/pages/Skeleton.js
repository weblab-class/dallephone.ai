import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./Skeleton.css";
import NewPrompt from "../modules/NewPromptInput";
import Dalle from "../modules/Dalle";
import Lobby from "../pages/Lobby";
import JoinGameForm from "../modules/JoinGameForm";
import { useParams, useNavigate, Link } from "react-router-dom"; // Import useNavigate
import { socket } from "../../client-socket.js";

import grid from "../../components/img/grid.svg";
import logo from "../img/logo.jpg";
import openAI from "../img/openAI.png";

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
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50px",
    height: "100%",
    maxHeight: "calc(80vh - 150px)",
  };

  const buttonStyle =
    "text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2 px-4 rounded shadow-md hover:shadow-lg transition duration-200 ease-in-out border-2 border-emerald-900 border-opacity-50";

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
      <Link to="/" style={{ fontSize: "56px", marginTop: "100px" }}>DALL-E Phone</Link>
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
        <div className="border-4 border-green-200 w-1/4 px-8 py-4 mr-8 h-full bg-gradient-to-b from-green-300 from-0% via-green-300 via-70% hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-center text-2xl">Create a Room</h2>
          <div className="text-center flex flex-col items-center justify-center h-5/6">
            <img
              src={openAI}
              alt="openai logo"
              className="animate-spin-slow object-contain h-[280px] w-full "
            />
            <button className={buttonStyle} onClick={createNewGame}>
              Create New Game
            </button>
          </div>
        </div>
        {/* How to play Panel */}
        <div className="border-4 border-emerald-200 w-1/4 py-4 px-8 h-full bg-gradient-to-b from-emerald-300 from-0% via-emerald-300 via-70% hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-center text-2xl pb-4">How to Play</h2>
          <div className="flex items-center justify-center h-5/6">
            <ul className="list-square space-y-3 text-teal-800 font-sans text-xl">
              <li>Invite your friends to a voice call</li>
              <li>Everybody must write a quirky sentence</li>
              <li>You're gonna receive a bizarre AI image</li>
              <li>Try to describe the image for the next player</li>
              <li>Watch the hilarious results of the telephone game!</li>
            </ul>
          </div>
        </div>
        {/* Join Game Panel */}
        <div className="border-4 border-teal-200 w-1/4 py-4 px-8 ml-8 h-full bg-gradient-to-b from-teal-400 from-0% via-teal-400 via-70% hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-center text-2xl">Join a Room</h2>
          <div className="flex flex-col items-center justify-center h-5/6">
            <img
              src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTZodTYxenBxaDA0cDF5dW5oZHpuYm8yMDlicGM3ZDc4M3QzMXZ6NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/iIv51yJF2tC800OUZi/giphy.gif"
              alt="ring gif"
              className="object-contain h-[280px] w-full p-8"
            />
            <JoinGameForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
