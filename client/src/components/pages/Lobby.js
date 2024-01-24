import React, { useState } from "react";
import OriginalPrompt from "./OriginalPrompt.js";
import { socket } from "../../client-socket.js";
import { useParams } from "react-router-dom";

/**
 * Will need to get user ids of all players in the lobby from database
 * currently do not know how to do this, am just using dummy data right now
 * and ensuring that the current user is in it at least.
 *
 * proptypes:
 *
 * States to pass:
 * @param {array} players - array of player objects
 * @param {string} game_id - id of the game, 4 capital letters
 */

const Lobby = () => {
  const [players, setPlayers] = useState({});

  const { game_id } = useParams(); // Access game_id from the URL

  const getUsers = (data) => {
    console.log("data", data.activeUsers);
    setPlayers(data.activeUsers.sort((a, b) => b._id.localeCompare(a._id)));
  };

  socket.on("activeUsers", getUsers);

  if (players.length > 0) {
    console.log("players", players);
    return <OriginalPrompt players={players} game_id={game_id} />;
  } else {
    console.log("players", players);
    return <div>Waiting for players...</div>;
  }
};

export default Lobby;
