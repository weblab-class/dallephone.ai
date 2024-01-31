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
        const started = await get("/api/gameStatus", { game_id: gameCode });
        if (started.gameStarted) {
          setError("Game already started");
        } else {
          await post("/api/updateGameId", { game_id: gameCode });
          navigate(`/lobby/${gameCode}`);
        }
      } else {
        setError("Room not found");
      }
    } catch (error) {
      console.error("Error joining game:", error);
      setError("Error joining game");
    }
  };

  const inputStyle =
    "border-2 border-emerald-900 bg-white h-[45px] w-[170px] px-2 rounded-l-md text-sm focus:outline-none";
  const buttonStyle =
    "border-y-2 border-r-2 border-emerald-900 text-white h-[45px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold py-2 px-2 rounded-r-md shadow-md hover:shadow-lg transition duration-200";

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center justify-center">
        <input
          type="text"
          value={gameCode}
          onChange={handleInputChange}
          placeholder="Enter Game Code"
          className={inputStyle}
        />
        <button type="submit" className={buttonStyle}>
          Join
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default JoinGameForm;
