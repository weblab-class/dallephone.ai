import React, { useState, useEffect } from "react";
import OriginalPrompt from "./OriginalPrompt.js";
import { socket } from "../../client-socket.js";
import { useParams } from "react-router-dom";
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
  const [players, setPlayers] = useState({});
  const [lobbyUsers, setLobbyUsers] = useState({}); // New state for tracking lobby users
  const { game_id } = useParams();
  const navigate = useNavigate();

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

    const getUsers = (data) => {
      setPlayers(data.activeUsers.sort((a, b) => b._id.localeCompare(a._id)));
    };
    socket.on("activeUsers", getUsers);

    socket.emit('joinLobby', game_id)
    
    socket.on("lobbyUsersUpdate", (data) => {
      console.log("Received lobby users update:", data);
      Object.entries(data['lobbyUsers']) // Convert object to array of [userId, gameId]
          .filter(([userId, gameId]) => gameId === game_id) // Corrected filter condition
          .map(([userId, gameId], index) => (
            <li key={userId}>Player {index + 1}: {userId}</li> // Render list item
          ))
      setLobbyUsers(data); // Update the lobbyUsers state
    });
    console.log("connected to socket");
  }, [game_id, navigate]);
  
  console.log({game_id});
  console.log(lobbyUsers);

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

  return (
    <div>
      {players > 0 ? (
        <>
          {renderOnlinePlayers()}
          <OriginalPrompt user_indices={lobbyUsers} num_players={players} game_id={game_id} />
        </>
      ) : (
        <div>Waiting for players...</div>
      )}
    </div>
  );
};

export default Lobby;
