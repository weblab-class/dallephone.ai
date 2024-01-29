import React, { useState } from "react";
import { get, post } from "../../utilities.js";
import { useParams } from "react-router-dom";
import { socket } from "../../client-socket.js";
import OriginalPrompt from "./OriginalPrompt.js";

const GameScreen = () => {
  const { game_id } = useParams();
  const [numPlayers, setNumPlayers] = useState(0); // New state for tracking lobby users

  socket.emit("getNumPlayers", game_id);
  socket.on("numPlayersUpdate", (data) => {
    console.log("Received num players update:", data);
    setNumPlayers(data);
  });

  console.log(numPlayers);

  return (
    <>
      {/* <h1>Game Screen</h1> */}
      <OriginalPrompt num_players={numPlayers} game_id={game_id} />
    </>
  );
};

export default GameScreen;
