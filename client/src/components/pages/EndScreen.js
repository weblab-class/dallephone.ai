import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";
import { bgStyle } from "./styles.js";

import "../../utilities.css";

/**
 * End Screen Page display of prompts and images in order
 *
 * Proptypes:
 * @param {array} prompts- 1D array of all prompt objects (Prompt has attributes of original, creator, content)
 * @param {array} images- 1D array of all image objects (Image has attributes of original, creator, content)
 * @param {array} ids - function to handle submission of prompt
 */

const EndScreen = ({ game_id, ids }) => {
  /**
   * For each id, show the prompts and images that have that id, in the order: prompts[0], images[0], prompts[1], images[1], etc.
   *
   * Proptypes:
   * @param {array} filteredPrompts- 1D array of all prompt objects with the given id
   * @param {array} filteredImages- 1D array of all image objects with the given id
   */
  const [prompts, setPrompts] = useState([]);
  const [images, setImages] = useState([]);
  const [dataFetched, setDataFetched] = useState(false); // State to track if data has been fetched

  if (!dataFetched) { // Only fetch data if it hasn't been fetched yet
    get("/api/prompt/game", { game_id: game_id }).then((promptObjs) => {
      setPrompts(promptObjs);
    });
    get("/api/image/game", { game_id: game_id }).then((imageObjs) => {
      setImages(imageObjs);
    });
    const timer = setTimeout(() => {
      setDataFetched(true); // This will stop further updates to 'data'
    }, 22000); // 22000 ms = 22 seconds

  }

  if (prompts.length > 0 && images.length > 0) {
    return (
      <div style={bgStyle}>
        <h1> DA BEAST</h1>
        {ids.map((id) => {
          const filteredPrompts = prompts.filter((prompt) => prompt.original === id);
          const filteredImages = images.filter((image) => image.original === id);

          return (
            <React.Fragment key={id}>
              {filteredPrompts.map((prompt, index) => (
                <div key={`prompt-${id}-${index}`}>
                  <h3>Prompt Content:</h3>
                  <p>{prompt.content}</p>
                  {filteredImages[index] && (
                    <div>
                      <h3>Image Content:</h3>
                      <img src={filteredImages[index].content} alt={`Image for ${id}`} />
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
    );
  } else {
    return <div>Loading...</div>; // Or any other placeholder content
  }
};

export default EndScreen;