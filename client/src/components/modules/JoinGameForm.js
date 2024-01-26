import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../utilities";

const JoinGameForm = ({ userId }) => {
  const [gameCode, setGameCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const code = event.target.value.toUpperCase();
    if (code.length <= 4) {
      setGameCode(code);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (gameCode.length !== 4) {
      setError("Enter a 4 digit capital letter code");
      return;
    }

    try {
      const res = await get("/api/getGameIDs");
      if (res.includes(gameCode)) {
        // Update user's gameId and redirect
        await post("/api/updateGameId", { game_id: gameCode });
        navigate(`/lobby/${gameCode}`);
      } else {
        setError("Room not found");
      }
    } catch (error) {
      console.error("Error joining game:", error);
      setError("Error joining game");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={gameCode}
          onChange={handleInputChange}
          placeholder="Enter Game Code"
        />
        <button type="submit">Join Game</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default JoinGameForm;