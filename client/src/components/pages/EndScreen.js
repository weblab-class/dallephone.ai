import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";
import { Link } from "react-router-dom";
import { bgStyle } from "./styles.js";

import "../../utilities.css";

/**
 * End Screen Page display of prompts and images in order
 *
 * Proptypes:
 * @param {array} prompts- 1D array of all prompt objects (Prompt has attributes of original, creator, content)
 * @param {array} images- 1D array of all image objects (Image has attributes of original, creator, content)
 * @param {array} names - array ob objects mapping user_id to user name
 * @param {array} ids - function to handle submission of prompt
 */

const EndScreen = ({ ids, images, prompts, names }) => {
  /**
   * For each id, show the prompts and images that have that id, in the order: prompts[0], images[0], prompts[1], images[1], etc.
   *
   * Proptypes:
   * @param {array} filteredPrompts- 1D array of all prompt objects with the given id
   * @param {array} filteredImages- 1D array of all image objects with the given id
   */

  const speechBubbleStyle = "bg-white rounded-lg shadow-md border border-gray-200 m-4 p-4 inline-block";
  const imageBubbleStyle = "p-4 m-4";

  const headerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
    width: "100%",
  };

  if (prompts.length > 0 && images.length > 0) {
    return (
      <div style={bgStyle} className="bg-repeat bg-cover bg-fixed">
      <div style={headerStyle}>
        <Link to="/" style={{ fontSize: "56px", marginTop: "100px", marginBottom: "100px" }}>
          DALL-E Phone
        </Link>
      </div>
        {ids.map((id) => {
          const filteredPrompts = prompts.filter((prompt) => prompt.original === id);
          const filteredImages = images.filter((image) => image.original === id);

          return (
            <React.Fragment key={id}>
              {filteredPrompts.map((prompt, index) => (
                <div key={`prompt-${id}-${index}`}>
                  <div className={`${speechBubbleStyle} speech-bubble`}>
                    <p>{prompt.creator} wrote: {prompt.content}</p>
                  </div>
                  {filteredImages[index] && (
                    <div className={`${speechBubbleStyle} speech-bubble`}>
                      <p>DALL-E created:</p>
                      <img 
                        src={filteredImages[index].content} 
                        alt={`Image for ${id}`} 
                        style={{ maxWidth: '300px', height: 'auto' }} // Adjust size as needed
                      />
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
    console.log("shit was not passed properly");
    console.log("prompts", prompts);
    console.log("images", images);
  }
};

export default EndScreen;
