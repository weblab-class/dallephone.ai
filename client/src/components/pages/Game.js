import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";
import NewPrompt from "../modules/NewPromptInput";
import Dalle from "../modules/Dalle";

import { socket } from "../../client-socket.js";

/**
 *
 * Proptypes:
 * @param {array} originalPrompts - array of original PromptObjs
 * @param {number} playerNum - player number of current user
 * @param {number} num_players - number of players in the game
 *
 * States to pass:
 * @param {array} imageObjs - array of ALL imageObjs in the current thread
 * @param {array} promptObjs - array of ALL promptObjs in the current thread
 * Will need to update these arrays after entering new prompt, will also need
 * to retrieve previous image from database.
 *
 * pass as props to end screen as images, prompts, and original prompt lists
 */

const Game = ({ originalPrompts, playerNum, num_players }) => {
  const [currentOriginalPrompt, setCurrentOriginalPrompt] = useState(
    originalPrompts[(playerNum + 1) % num_players]
  ); // type: promptObj
  const [imagePrompt, setImagePrompt] = useState(originalPrompts[0]); // previous prompt that displays current image to be guessed
  const [canPlay, setCanPlay] = useState(false); // checks if previous prompts image has displayed
  const [imageObjs, setImageObjs] = useState([]);
  const [promptObjs, setPromptObjs] = useState(originalPrompts);

  // Get previous prompt to use for currently displayed Dalle image:
  useEffect(() => {
    setCanPlay(false);
    get("/api/prompt/original", { original: currentOriginalPrompt.original }).then((prompts) => {
      setImagePrompt(prompts[prompts.length - 1]);
      setCanPlay(true);
    });
  }, [currentOriginalPrompt]);

  const addNewPrompt = (prompt) => {
    if (prompt !== "") {
      post("/api/prompt", { original: currentOriginalPrompt.original, content: prompt }).then(
        (prompt) => {
          socket.emit("submitPrompt");
          setPromptObjs([...promptObjs, prompt]);
        }
      );
    }
  };

  const addNewImage = (image) => {
    setImageObjs([...imageObjs, image]);
  };

  socket.on("allPromptsSubmitted", () => {
    // update current original prompt, which rotates for everyone
    setCurrentOriginalPrompt(originalPrompts[(playerNum + 1) % num_players]);
    console.log("originalPrompts", originalPrompts);
  });

  // console log outputs to check if props are being passed correctly:
  // console.log("playerNum", playerNum);
  // console.log("num_players", num_players);

  return canPlay ? (
    <div>
      <Dalle
        prompt={imagePrompt.content}
        triggerFetch={true} // should this be always true?
        original={imagePrompt.original}
        addNewImage={addNewImage}
      />
      <NewPrompt
        defaultText="Enter a prompt"
        original={imagePrompt.original}
        addNewPrompt={addNewPrompt}
      />
    </div>
  ) : (
    <div>Waiting to retrieve your image...</div>
  );
};

export default Game;
