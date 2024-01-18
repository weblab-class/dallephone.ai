import { get, set } from "mongoose";
import React, { useState, useEffect } from "react";

/**
 * Will need to get user ids of all players in the lobby from database
 * currently do not know how to do this, am just using dummy data right now
 * and ensuring that the current user is in it at least.
 */

const Lobby = () => {
  const [players, setPlayers] = useState(0);
  const [readyToStart, setReadyToStart] = useState(false);

  useEffect(() => {
    get("/api/activeUsers").then((data) => {
      setPlayers(data.activeUsers.keys().length);
      setReadyToStart(true);
    });
  }, []);

  if (readyToStart) return <OriginalPrompt user_indices={user_indices} num_players={players} />;
};

export default Lobby;
