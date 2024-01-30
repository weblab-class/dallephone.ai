import React, { useState, useEffect } from "react";
import OriginalPrompt from "./OriginalPrompt.js";
import { socket } from "../../client-socket.js";
import { useParams, useNavigate } from "react-router-dom";
import { get, post } from "../../utilities";

import "./Lobby.css";


/**
 * Will need to get user ids of all players in the lobby from database
 * currently do not know how to do this, am just using dummy data right now
 * and ensuring that the current user is in it at least.
 *
 * proptypes:
 *
 * States to pass:
 * @param {array} players - array of everyone currently online (anwhere, not just in lobby)
 * @param {uh ask rich ab this} lobbyUsers- all users in the lobby
 * @param {string} game_id - id of the game, 4 capital letters
 */

const Lobby = () => {
  const [lobbyUsers, setLobbyUsers] = useState({}); // New state for tracking lobby users
  const [numPlayers, setNumPlayers] = useState(0); // New state for tracking lobby users
  const { game_id } = useParams();
  const navigate = useNavigate();
  const [isHost, setIsHost] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkGameExistsAndUpdateUser = async () => {
      try {
        const res = await get("/api/getGameIDs");
        if (!res.includes(game_id)) {
          navigate("/lobbyNotFound");
          return;
        }
        else{
          const started = await get("/api/gameStatus", {game_id: game_id});
          if (started.gameStarted){
            navigate("/lobbyStarted");
          }
          else{
            setAuthenticated(true);
          }
        }
        
        

        await post("/api/updateGameId", { game_id: game_id });
      } catch (error) {
        console.error("Error:", error);
        navigate("/error");
      }
    };

    checkGameExistsAndUpdateUser();

    socket.on("gameStarted", (code) => {
      if (code === game_id){
        navigate(`/game/${game_id}`);
      }
    });

    socket.emit("joinLobby", { game_id: game_id, socket_id: socket.id });

    console.log(socket.id);
    socket.emit("checkHost", { game_id: game_id, socket_id: socket.id });

    socket.on(
      "assignHost",
      (data) => {
        if (data.isHost) {
          console.log("I am the host");
          setIsHost(true); // Set a state variable to track if the current user is the host
        }
      },
      []
    );

    socket.on("lobbyUsersUpdate", (data) => {
      console.log("Received lobby users update:", data);
      Object.entries(data["lobbyUsers"]) // Convert object to array of [userId, gameId]
        .filter(([userName, gameId]) => gameId === game_id) // Corrected filter condition
        .map(([userName, gameId], index) => (
          <li key={userName}>
            Player {index + 1}: {userName}
          </li> // Render list item
        ));
      setLobbyUsers(data); // Update the lobbyUsers state

      return () => {
        socket.off("lobbyUsersUpdate");
        socket.off("assignHost");
        socket.off("gameStarted");
        socket.off("checkHost");
        socket.off("joinLobby");
      };
    });
  }, [game_id, navigate]);

  // Function to render the list of online players
  const renderOnlinePlayers = () => {
    return (
      <div className="p-4 bg-blue-200 rounded-lg mt-10">
        <h3 className="text-lg font-semibold text-emerald-900">Online Players:</h3>
        <ul className="list-disc list-inside">
          {Object.entries(lobbyUsers["lobbyUsers"])
            .filter(([userName, gameId]) => gameId === game_id)
            .map(([userName, gameId], index) => (
              <li key={userName} className="text-md text-gray-700">
                Player {index + 1}: {userName}
              </li>
            ))}
        </ul>
      </div>
    );
  };
  
  const renderStartGameButton = () => {
    if (isHost) {
      return (
        <div className="w-[400px] h-[40px] flex justify-center items-center h-screen">
          <button
            onClick={handleStartGame}
            className="text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold py-2 px-4 rounded shadow-md hover:shadow-lg transition duration-200"
          >
            Start Game
          </button>
        </div>
      );
    }
    return null;
  };

  const handleStartGame = () => {
    // Emit an event to the server to start the game
    socket.emit("startGame", game_id);
  };

  useEffect(() => {
    if (lobbyUsers["lobbyUsers"]) {
      setNumPlayers(Object.keys(lobbyUsers["lobbyUsers"]).length);
    }
  }, [lobbyUsers]);

  const headerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
    width: '100%',
  };


  return (
    
    <div className="lobby-container">
      <div style={headerStyle}>
        <span style={{ fontSize: '56px', marginTop: '100px' }}>DALL-E Phone</span>
      </div>

      {authenticated ? (
        numPlayers > 1 ? (
          <>
            {renderOnlinePlayers()}
            {renderStartGameButton()}
          </>
        ) : (
          <div className="waiting-container">
            <div className="waiting-text">Waiting for players...</div>
            <div className="waiting-wheel"></div>
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default Lobby;
