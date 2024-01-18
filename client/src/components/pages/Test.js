import React, { useState, useEffect } from "react";

import "../../utilities.css";
import { get } from "../../utilities";
import "./Skeleton.css";

import EndScreen from "./EndScreen.js";

/**
 * Rich's testing server
 *
 * Proptypes:
 * @param {array} prompts- 1D array of all prompt objects (Prompt has attributes of original, creator, content) with id='hi'
 * @param {array} images- 1D array of all image objects (Image has attributes of original, creator, content) wit id='hi'
 * @param {array} originalPrompts - 1D array of all original prompt objects (Prompt has attributes of original, creator, content) with id='hi'
 */

const Test = () => {
  const [prompts, setPrompts] = useState("");
  const [images, setImages] = useState("");

  useEffect(() => {
    get("api/prompt/original", { original: "hi" }).then((prompts) => {
      setPrompts(prompts);
    });

    get("api/image", { original: "hi" }).then((images) => {
      setImages(images);
    });
  }, []); // Empty dependency array means this runs once on mount

  const ids = ["hi"];
  return (
    <div>
      <h1>Good luck on your project :)</h1>
      <EndScreen prompts={prompts} images={images} ids={ids} />
    </div>
  );
};

export default Test;
