import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities.js";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../client-socket.js";
import OriginalPrompt from "./OriginalPrompt.js";

const GameScreen = () => {
    const { game_id } = useParams();
    const [numPlayers, setNumPlayers] = useState(0); // New state for tracking lobby users
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();
    
    socket.emit("getNumPlayers", game_id);
    socket.on("numPlayersUpdate", (data) => {
    console.log("Received num players update:", data);
    setNumPlayers(data);
    });

    
  useEffect(() => {
    const checkGameExistsAndUpdateUser = async () => {
      try {
        const res = await get("/api/getGameIDs");
        if (!res.includes(game_id)) {
          navigate("/lobbyNotFound");
          return;
        } else {
          
          
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/error");
      }
    };

    checkGameExistsAndUpdateUser();

    const flip=socket.emit("getInGamePlayers", {game_id:game_id, socket_id: socket.id});
    if (!flip) {
        navigate("/lobbyStarted");
    } else {
      setAuthenticated(true);
      post("/api/updateGameStatus", { game_id: game_id });
    }

  }, []);

  console.log(numPlayers);

  return (
    <div>
      {authenticated ? (
        <>
          <OriginalPrompt num_players={numPlayers} game_id={game_id} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GameScreen;
