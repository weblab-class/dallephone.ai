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
 * @param {number} num_players - number of players in the game
 *
 * States to pass:
 * @param {object} user_indices - object mapping user ids to player numbers
 * @param {string} game_id - id of the game, 4 capital letters
 */

const Lobby = () => {
  const [players, setPlayers] = useState(0);
  const [user_indices, setUserIndices] = useState({});

  const { game_id } = useParams(); // Access game_id from the URL

  const getUsers = (data) => {
    for (let i = 0; i < data.activeUsers.length; i++) {
      setUserIndices({ ...user_indices, [data.activeUsers[i]._id]: i });
    }
    setPlayers(data.activeUsers.length);
  };

  socket.on("activeUsers", getUsers);

  if (players > 0) {
    if (Object.keys(user_indices).length === players) {
      console.log("user indices", user_indices);
      console.log("numplayers", players);
      console.log("THIS HAS RUN BRO");
      return <OriginalPrompt user_indices={user_indices} num_players={players} game_id={game_id} />;
    }
  } else {
    console.log("user indices", user_indices);
    console.log("numplayers", players);
    return <div>Waiting for players...</div>;
  }
};

export default Lobby;
