import React, { useState } from "react";
import { get, post } from "../../utilities";
import NewPrompt from "../modules/NewPromptInput";
import Dalle from "../modules/Dalle";

/**
 *
 * Proptypes:
 * @param {array} originalPrompts - array of original PromptObjs
 * @param {number} playerNum - player number of current user
 *
 * States:
 * @param {array} images - array of ALL imageObjs in the current thread
 * @param {array} prompts - array of ALL promptObjs in the current thread
 * Will need to update these arrays after entering new prompt, will also need
 * to retrieve previous image from database.
 *
 * pass as props to end screen as images, prompts, and original prompt lists
 */

const Game = ({ originalPrompts, playerNum }) => {
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [prompts, setPrompts] = useState(originalPrompts);

  const addNewPrompt = (prompt) => {
    setCurrentPrompt(prompt);
  };

  const addNewImage = (prompt) => {
    console.log(prompt);
  };

  return (
    <div>
      <Dalle
        prompt={currentPrompt}
        triggerFetch={currentPrompt !== ""}
        original={currentPrompt}
        addNewImage={addNewImage}
      />
      <NewPrompt
        defaultText="Enter a prompt"
        original={currentPrompt}
        addNewPrompt={addNewPrompt}
      />
    </div>
  );
};

export default Game;
