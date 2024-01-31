import React, { useState, useEffect } from "react";
import EndScreen from "./EndScreen";
import { get } from "../../utilities";

const LoadingGifs = ({ game_id, ids, num_players }) => {
  const [prompts, setPrompts] = useState([]);
  const [images, setImages] = useState([]);
  const [names, setNames] = useState([]); // State to store names of players, array of objects with key-value pairs being {user_id: user_name}
  const [promptsFetched, setPromptsFetched] = useState(false);
  const [imagesFetched, setImagesFetched] = useState(false);
  const [namesFetched, setNamesFetched] = useState(false);

  // prompts
  if (!promptsFetched) {
    get("/api/prompt/game", { game_id: game_id }).then((promptObjs) => {
      setPrompts(promptObjs);
    });
    const timer = setTimeout(() => {
      setPromptsFetched(true); // This will stop further updates to 'data'
    }, 22000); // 22000 ms = 22 seconds
    if (prompts.length === num_players ** 2) {
      setPromptsFetched(true);
    }
  }

  // images
  if (!imagesFetched) {
    get("/api/image/game", { game_id: game_id }).then((imageObjs) => {
      setImages(imageObjs);
    });
    const timer = setTimeout(() => {
      setImagesFetched(true); // This will stop further updates to 'data'
    }, 22000); // 22000 ms = 22 seconds
    if (images.length === num_players ** 2) {
      setImagesFetched(true);
    }
  }

  // names
  if (!namesFetched) {
    get("/api/game/users", { game_id: game_id }).then((players) => {
      setNames(players.map((player) => ({ [player._id]: player.name })));
    });
    const timer = setTimeout(() => {
      setNamesFetched(true); // This will stop further updates to 'data'
    }, 22000); // 22000 ms = 22 seconds
    if (names.length === num_players) {
      setNamesFetched(true);
    }
  }

  if (promptsFetched && imagesFetched && namesFetched) {
    // console.log("prompts", prompts);
    // console.log("images", images);
    // console.log("names", names);
  }

  return promptsFetched && imagesFetched && namesFetched ? (
    <EndScreen ids={ids} images={images} prompts={prompts} />
  ) : (
    <div>
      <h1>COMPILING GIFS</h1>
      <h2>Current Progress:</h2>
      <h3>
        Prompts: {prompts.length}/{num_players ** 2}
      </h3>
      <h3>
        Images: {images.length}/{num_players ** 2}
      </h3>
    </div>
  );
};

export default LoadingGifs;
