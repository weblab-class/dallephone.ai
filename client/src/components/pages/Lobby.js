import { get } from "../../utilities.js";
import React, { useState, useEffect } from "react";
import OriginalPrompt from "./OriginalPrompt.js";

/**
 * Will need to get user ids of all players in the lobby from database
 * currently do not know how to do this, am just using dummy data right now
 * and ensuring that the current user is in it at least.
 *
 * States to pass:
 * @param {object} user_indices - object mapping user ids to player numbers
 * @param {string} game_id - id of the game
 */

const Lobby = () => {
  const [players, setPlayers] = useState(0);
  const [readyToStart, setReadyToStart] = useState(false);

  useEffect(() => {
    get("/api/activeUsers").then((data) => {
      setPlayers(data.activeUsers.length);
      setReadyToStart(true);
    });
  }, []);

  // TODO: enter code to get or generate game id to pass on

  if (readyToStart)
    return <OriginalPrompt user_indices={user_indices} num_players={players} game_id={game_id} />;
};

export default Lobby;
