import React, { useState, useEffect } from "react";
import EndScreen from "./EndScreen";
import { get } from "../../utilities";
import "./LoadingGifs.css";
import openAI from "../img/openAI.png";

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
      setNames(
        players.reduce((acc, player) => {
          acc[player._id] = player.name;
          return acc;
        }, {})
      );
    });
    const timer = setTimeout(() => {
      setNamesFetched(true); // This will stop further updates to 'data'
    }, 22000); // 22000 ms = 22 seconds
    if (names.length === num_players) {
      //
      setNamesFetched(true);
    }
  }

  //Dynamically adjusts progress bar

  return promptsFetched && imagesFetched && namesFetched ? ( // DELETE THE FALSE LATER.. THIS IS SO I CAN STYLE THE CSS FOR NOW
    <EndScreen ids={ids} images={images} prompts={prompts} names={names} />
  ) : (
    <div className="flex flex-col justify-center items-center h-full w-screen">
      <h1 className="text-4xl ellipsis p-8">Compiling images together</h1>
      <div className="w-5/12 h-11 bg-slate-100 rounded border-2 border-blue-600 overflow-hidden">
        <div id="progress" className="h-full bg-sky-400 animate-loading-progress"></div>
      </div>
      <img
        src={openAI}
        alt="openai logo"
        className="animate-spin-slow object-contain h-[200px] w-full mt-12 p-8"
      />
    </div>
  );
};

export default LoadingGifs;
