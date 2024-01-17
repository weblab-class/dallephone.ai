import React, {useState} from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

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

const EndScreen = ({ prompts, images, ids }) => {

  /**
 * For each id, show the prompts and images that have that id, in the order: prompts[0], images[0], prompts[1], images[1], etc.
 *
 * Proptypes:
 * @param {array} filteredPrompts- 1D array of all prompt objects with the given id
 * @param {array} filteredImages- 1D array of all image objects with the given id
 */
  return (
    <div>
      <h1> DA BEAST</h1>

      {ids.map(id => {
        const filteredPrompts = Object.values(prompts).filter(prompt => prompt.original === id);
        const filteredImages =  Object.values(images).filter(image => image.original === id);

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
};

export default EndScreen;
