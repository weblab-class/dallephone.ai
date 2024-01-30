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
        const started = await get("/api/gameStatus", {game_id: gameCode});
        if(started.gameStarted){
          setError("Game already started");
        }
        else{
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

  const inputStyle = 'border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none';
  const buttonStyle = 'text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold py-2 px-4 rounded shadow-md hover:shadow-lg transition duration-200';

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center justify-center mt-4">
        <input
          type="text"
          value={gameCode}
          onChange={handleInputChange}
          placeholder="Enter Game Code"
          className={inputStyle}
        />
        <button type="submit" className={buttonStyle}>
          Join Game
        </button>
      </form>
      {error && <p className="error text-red-500">{error}</p>}
    </div>
  );
};

export default JoinGameForm;
