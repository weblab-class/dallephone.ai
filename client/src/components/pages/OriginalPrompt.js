import React, { useState, useEffect } from "react";
import Game from "./Game.js";
import { get, post } from "../../utilities.js";
import { socket } from "../../client-socket.js";

/**
 *
 * As written, this does not work yet because you need to fetch all the
 * Original Prompts from the database. I'm not sure how to do that yet because
 * we need to know when everyone has submitted a post request to the server.
 *
 * proptypes:
 * @param {object} players - array of player objects
 * @param {string} game_id - id of the game
 *
 * states passed:
 * @param {number} playerNum - player number of current user
 * @param {array} originalPrompts - object of prompt OBJECTS (not prompt ids!), maps index to prompt object
 */

const OriginalPrompt = ({ players, game_id }) => {
  const [prompt, setPrompt] = useState("");
  const [enteredPrompt, setEnteredPrompt] = useState(false); // useState for enteredPrompt
  const [originalPrompts, setOriginalPrompts] = useState([]);
  const [playerNum, setPlayerNum] = useState(-1); // useState for playerNum
  const [allPromptsSubmitted, setAllPromptsSubmitted] = useState(false); // useState for allPromptsSubmitted
  const [userID, setUserID] = useState(undefined);

  useEffect(() => {
    // Fetch user data inside useEffect
    get("/api/whoami").then((user) => {
      setUserID(user._id);
    });
  }, []); // Dependency array to control when the effect runs

  const handleChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (prompt !== "") {
      post("/api/prompt/original", { content: prompt, game_id: game_id }).then(() => {
        setEnteredPrompt(true);
        console.log("I submitted");
        socket.emit("submitPrompt");
      });
    }
  };

  socket.on("allPromptsSubmitted", () => {
    get("/api/prompt/originalprompts", { game_id: game_id }).then((prompts) => {
      // console.log("all prompts received");
      // console.log(Object.keys(prompts));
      // console.log("userID", typeof userID);
      // console.log("creator type", typeof prompts[0].creator);
      // console.log(
      //   "filtered stuff",
      //   Object.keys(prompts).filter((key) => prompts[key].creator === userID)[0]
      // );
      if (userID !== undefined) {
        setOriginalPrompts(prompts);
        setPlayerNum(
          parseInt(Object.keys(prompts).filter((key) => prompts[key].creator === userID)[0])
        );
      }
      // setAllPromptsSubmitted(originalPrompts.length !== 0 && playerNum !== -1);
      if (allPromptsSubmitted) console.log(originalPrompts);
    });
  });

  // implement to check that all players have submitted prompts
  if (userID !== undefined) {
    if (originalPrompts.length !== 0 && playerNum !== -1)
      return (
        <Game
          originalPrompts={originalPrompts}
          num_players={players.length}
          playerNum={playerNum}
          game_id={game_id}
        />
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
