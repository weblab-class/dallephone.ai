import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../utilities";

const CreateGame = ({ userId }) => {
  const [error, setError] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const navigate = useNavigate();

  const onClick = async () => {
    setMessageVisible(true);
    setTimeout(() => {
      setMessageVisible(false);
    }, 3000);
    if (!userId) {
      setError("Please log in to create a game");
      return;
    }

    try {
      const res = await post("/api/createNewGame");
      const gameCode = res.gameCode;
      if (gameCode) {
        // Redirect to the new game lobby
        navigate(`/lobby/${gameCode}`);
      }
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  };

  return (
    <div>
      <button
        onClick={onClick}
        className="border-2 border-emerald-900 text-white h-[45px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold py-2 px-2 rounded-md shadow-md hover:shadow-lg transition duration-200"
      >
        Create Game
      </button>
      {messageVisible && <p className="font-sans text-center">{error}</p>}
    </div>
  );
};

export default CreateGame;
