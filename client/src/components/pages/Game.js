import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";
import NewPrompt from "../modules/NewPromptInput";
import Dalle from "../modules/Dalle";

import { socket } from "../../client-socket.js";
import EndScreen from "./EndScreen.js";

/**
 *
 * Proptypes:
 * @param {array} originalPrompts - array of original PromptObjs
 * @param {number} playerNum - player number of current user
 * @param {number} num_players - number of players in the game
 * @param {number} game_id - game_id
 *
 * States to pass:
 * @param {array} imageObjs - array of ALL imageObjs in the current thread
 * @param {array} promptObjs - array of ALL promptObjs in the current thread
 * Will need to update these arrays after entering new prompt, will also need
 * to retrieve previous image from database.
 *
 * pass as props to end screen as images, prompts, and original prompt lists
 */

const Game = ({ originalPrompts, playerNum, num_players, game_id }) => {
  const [currentOriginalPrompt, setCurrentOriginalPrompt] = useState(
    originalPrompts[(playerNum + 1) % num_players]
  ); // type: promptObj
  const [currentIndex, setCurrentIndex] = useState((playerNum + 1) % num_players); // index of current original prompt in originalPrompts array
  const [imagePrompt, setImagePrompt] = useState(undefined); // previous prompt that displays current image to be guessed
  const [imageObjs, setImageObjs] = useState([]);
  const [promptObjs, setPromptObjs] = useState(originalPrompts);

  useEffect(() => {
    console.log("playerNum", playerNum);
    console.log("numPlayers", num_players);
    console.log("currentIndex", currentIndex);
    console.log("currentOriginalPrompt", currentOriginalPrompt);
    console.log("originalPrompts", originalPrompts);
  }, []);

  // Get previous prompt to use for currently displayed Dalle image:
  useEffect(() => {
    get("/api/prompt/original", {
      original: currentOriginalPrompt.original,
      game_id: game_id,
    }).then((prompts) => {
      setImagePrompt(prompts[prompts.length - 1]);
    });
  }, [currentOriginalPrompt]);

  const addNewPrompt = (prompt) => {
    if (prompt !== "") {
      post("/api/prompt", {
        original: currentOriginalPrompt.original,
        content: prompt,
        game_id: game_id,
      }).then((promptObj) => {
        socket.emit("submitPrompt");
        // setPromptObjs([...promptObjs, promptObj]); // maybe combine this to socket as callback?
      });
    }
  };

  const addNewImage = (image) => {
    // setImageObjs([...imageObjs, image]);
    return null;
  };

  socket.on("allPromptsSubmitted", () => {
    // update current original prompt, which rotates for everyone
    const index = (currentIndex + 1) % num_players;
    setCurrentOriginalPrompt(originalPrompts[index]);
    setCurrentIndex(index); // how to make these run synchronously?
  });

  // console log outputs to check if props are being passed correctly:
  // console.log("playerNum", playerNum);
  // console.log("num_players", num_players);
  if (currentIndex !== playerNum) {
    return typeof imagePrompt !== "undefined" ? (
      <div>
        <Dalle
          prompt={imagePrompt.content}
          triggerFetch={true} // should this be always true?
          original={imagePrompt.original}
          addNewImage={addNewImage}
          game_id={game_id}
        />
        <NewPrompt
          defaultText="Enter a prompt"
          original={imagePrompt.original}
          addNewPrompt={addNewPrompt}
          game_id={game_id}
        />
      </div>
    ) : (
      <div>Waiting to retrieve your image...</div>
    );
  } else {
    const ids = originalPrompts.map((prompt) => prompt.original);
    // const expectedEntries = num_players * num_players;
    // console.log("promptObjs", promptObjs);
    // console.log("imageObjs", imageObjs);
    return (
      <div>
        <Dalle
          prompt={imagePrompt.content}
          triggerFetch={true} // should this be always true?
          original={imagePrompt.original}
          addNewImage={addNewImage}
          game_id={game_id}
          shouldDisplay={false}
        />
        <EndScreen game_id={game_id} ids={ids} />;
      </div>
    );
  }
};

export default Game;
