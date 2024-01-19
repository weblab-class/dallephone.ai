import React, { useState, useEffect } from "react";
import Game from "./Game.js";
import { post } from "../../utilities.js";
import { socket } from "../../client-socket.js";
import { set } from "mongoose";
import { all } from "../../../../server/api.js";

/**
 *
 * As written, this does not work yet because you need to fetch all the
 * Original Prompts from the database. I'm not sure how to do that yet because
 * we need to know when everyone has submitted a post request to the server.
 *
 * proptypes:
 * @param {object} user_indices - object mapping user ids to player numbers
 * @param {number} num_players - number of players in the game
 * @param {string} game_id - id of the game
 *
 * states passed:
 * @param {number} playerNum - player number of current user
 * @param {array} originalPrompts - array of prompt OBJECTS (not prompt ids!)
 */

const OriginalPrompt = ({ user_indices, num_players, game_id }) => {
  const [prompt, setPrompt] = useState("");
  const [enteredPrompt, setEnteredPrompt] = useState(false); // useState for enteredPrompt
  const [originalPrompts, setOriginalPrompts] = useState([]);
  const [playerNum, setPlayerNum] = useState(-1); // useState for playerNum
  const [gotPlayerNum, setGotPlayerNum] = useState(false); // useState for gotPlayerNum
  const [allPromptsSubmitted, setAllPromptsSubmitted] = useState(false);

  useEffect(() => {
    // Fetch user data inside useEffect
    get("/api/whoami").then((user) => {
      setPlayerNum(user_indices[user._id]); // Update state with setPlayerNum
      setGotPlayerNum(true); // Update state with setGotPlayerNum
    });
  }, []); // Dependency array to control when the effect runs

  const handleChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (prompt !== "") {
      post("/api/prompt", { original: prompt, content: prompt }).then((prompt) => {
        setEnteredPrompt(true);
        socket.emit("submitPrompt");
      });
    }
  };

  socket.on("allPromptsSubmitted", () => {
    get("/api/prompt/game", { game_id: { game_id } }).then((prompts) => {
      setOriginalPrompts(prompts);
      setAllPromptsSubmitted(true);
    });
  });

  // implement to check that all players have submitted prompts

  if (gotPlayerNum) {
    if (allPromptsSubmitted)
      return (
        <Game originalPrompts={originalPrompts} num_players={num_players} playerNum={playerNum} />
      );
    else if (enteredPrompt) return <div>Waiting for other players to submit prompts...</div>;
    else {
      return (
        <form onSubmit={handleSubmit}>
          <label>
            Prompt:
            <input type="text" value={prompt} onChange={handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }
};

export default OriginalPrompt;
