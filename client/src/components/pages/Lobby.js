import React, { useState, useEffect } from "react";
import OriginalPrompt from "./OriginalPrompt.js";
import { socket } from "../../client-socket.js";
import { useParams, useNavigate } from "react-router-dom";
import { get, post } from "../../utilities";

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


  useEffect(() => {
    const checkGameExistsAndUpdateUser = async () => {
      try {
        const res = await get("/api/getGameIDs");
        if (!res.includes(game_id)) {
          navigate("/lobbyNotFound");
          return;
        }
        
        await post("/api/updateGameId", { game_id: game_id });
        

      } catch (error) {
        console.error("Error:", error);
        navigate("/error");
      }
    };

    checkGameExistsAndUpdateUser();

    socket.on("gameStarted", (code) => {
      console.log(code)
      if (code === game_id){
        navigate(`/game/${game_id}`);
      }
    });

    socket.emit('joinLobby', {game_id: game_id, socket_id: socket.id})
    
    console.log(socket.id)
    socket.emit("checkHost", {game_id: game_id, socket_id: socket.id});

    socket.on("assignHost", (data) => {
      if (data.isHost) {
        console.log("I am the host");
        setIsHost(true); // Set a state variable to track if the current user is the host
      }
    }, []);

    
    socket.on("lobbyUsersUpdate", (data) => {
      console.log("Received lobby users update:", data);
      Object.entries(data['lobbyUsers']) // Convert object to array of [userId, gameId]
          .filter(([userId, gameId]) => gameId === game_id) // Corrected filter condition
          .map(([userId, gameId], index) => (
            <li key={userId}>Player {index + 1}: {userId}</li> // Render list item
          ))
      setLobbyUsers(data); // Update the lobbyUsers state

      return() => {
        socket.off("lobbyUsersUpdate");
        socket.off("assignHost");
        socket.off("gameStarted");
        socket.off("checkHost");
        socket.off("joinLobby");
      }
    });
  }, [game_id, navigate]);

  // Function to render the list of online players
  const renderOnlinePlayers = () => {
    return (
      <div>
        <h3>Online Players:</h3>
        <ul>
        {Object.entries(lobbyUsers['lobbyUsers']) // Convert object to array of [userId, gameId]
          .filter(([userId, gameId]) => gameId === game_id) // Corrected filter condition
          .map(([userId, gameId], index) => (
            <li key={userId}>Player {index + 1}: {userId}</li> // Render list item
          ))}
      </ul>
      </div>
    );
  };

  const renderStartGameButton = () => {
    if (isHost) {
      return (
        <button onClick={handleStartGame}>Start Game</button>
      );
    }
    return null;
  };
  
  const handleStartGame = () => {
    // Emit an event to the server to start the game
    socket.emit('startGame', game_id);
  };

  useEffect(() => {
    if (lobbyUsers['lobbyUsers']){
      setNumPlayers(Object.keys(lobbyUsers['lobbyUsers']).length);
    }
  }, [lobbyUsers]);

  return (
    <div>
      {numPlayers > 0 ? (
        <>
          {renderOnlinePlayers()}
          {renderStartGameButton()}
        </>
      ) : (
        <div>Waiting for players...</div>
      )}
    </div>
  );
};

export default Lobby;
