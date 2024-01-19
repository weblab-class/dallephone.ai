import React, { useState } from "react";
import OriginalPrompt from "./OriginalPrompt.js";
import { socket } from "../../client-socket.js";
import { set } from "mongoose";

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
 * @param {string} game_id - id of the game
 */

const Lobby = () => {
  const [players, setPlayers] = useState(0);
  const [user_indices, setUserIndices] = useState({});

  const game_id = "hi"; // (future) TODO: enter code to get or generate game id to pass on

  const getUsers = (data) => {
    for (let i = 0; i < data.activeUsers.length; i++) {
      setUserIndices({ ...user_indices, [data.activeUsers[i]._id]: i });
    }
    setPlayers(data.activeUsers.length);
  };

  socket.on("activeUsers", getUsers);

  if (players > 0) {
    if (Object.keys(user_indices).length === players)
      return <OriginalPrompt user_indices={user_indices} num_players={players} game_id={game_id} />;
  }
};

export default Lobby;
