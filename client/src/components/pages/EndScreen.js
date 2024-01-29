import React, { useState } from "react";
import { get, post } from "../../utilities.js";

import "../../utilities.css";
import "./EndScreen.css";

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

  get("/api/prompt/game", { game_id: game_id }).then((promptObjs) => {
    setPrompts(promptObjs);
  });
  get("/api/image/game", { game_id: game_id }).then((imageObjs) => {
    setImages(imageObjs);
  });

  if (prompts.length > 0 && images.length > 0) {
    return (
      <div>
        <h1> DA BEAST</h1>

        {ids.map((id) => {
          const filteredPrompts = Object.values(prompts).filter((prompt) => prompt.original === id);
          const filteredImages = Object.values(images).filter((image) => image.original === id);

          // console.log("prompts", prompts);
          // console.log("images", images);
          // console.log("ids", ids);
          // console.log("filtered prompts", filteredPrompts);
          // console.log("filtered images", filteredImages);

          return (
            <>
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
            </>
          );
        })}
      </div>
    );
  }
};

export default EndScreen;
