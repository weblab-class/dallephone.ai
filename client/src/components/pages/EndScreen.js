import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";
import { Link } from "react-router-dom";
import { bgStyle } from "./styles.js";

import "../../utilities.css";

const EndScreen = ({ ids, images, prompts, names }) => {
  const buttonStyle =
    "mx-auto text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2 px-4 rounded shadow-md hover:shadow-lg transition duration-200 ease-in-out border-2 border-emerald-900 border-opacity-50 my-4 mb-8 block";

  const speechBubbleStyle = `
  bg-white rounded-lg shadow-md border border-gray-200 m-4 p-4 w-300 h-300`;

  const imageBubbleStyle = "p-4 m-4";
  const headerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
    width: "100%",
  };

  const bubbleContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const [currentBubbleIndex, setCurrentBubbleIndex] = useState(1);

  useEffect(() => {
    if (currentBubbleIndex < ids.length) {
      const interval = setInterval(() => {
        setCurrentBubbleIndex((prevIndex) => prevIndex + 1);
      }, 7000); // 7-second delay between each bubble

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentBubbleIndex, ids]);

  if (prompts.length > 0 && images.length > 0) {
    return (
      <div style={bgStyle}>
        <div style={headerStyle}>
          <Link to="/" style={{ fontSize: "56px", marginTop: "100px", marginBottom: "100px" }}>
            DALL-E Phone
          </Link>
        </div>
        {ids.slice(0, currentBubbleIndex).map((id, idx) => {
          const filteredPrompts = prompts.filter((prompt) => prompt.original === id);
          const filteredImages = images.filter((image) => image.original === id);

          return (
            <React.Fragment key={id}>
              <div style={bubbleContainerStyle}>
                {filteredPrompts.map((prompt, index) => (
                  <React.Fragment key={`fragment-${id}-${index}`}>
                    <div
                      key={`prompt-${id}-${index}`}
                      className={`${speechBubbleStyle} speech-bubble mr-2 w-[360px] h-[360px] p-4 text-center text-3xl flex justify-center items-center`}
                    >
                      <p className="font-sans">
                        {index >= 1
                          ? `${names[prompt.creator]} guessed: ${prompt.content}`
                          : `${names[prompt.creator]} wrote: ${prompt.content}`}
                      </p>
                    </div>
                    {filteredImages[index] && (
                      <div
                        key={`image-${id}-${index}`}
                        className={`${speechBubbleStyle} speech-bubble ml-2`}
                      >
                        <p className="text-center">DALL-E created:</p>
                        <img
                          src={filteredImages[index].content}
                          alt={`Image for ${id}`}
                          style={{ maxWidth: "300px", height: "auto" }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          );
        })}
        {currentBubbleIndex === ids.length && (
          <div className="text-center">
            <Link to="/">
              <button className={buttonStyle}>Return to Home</button>
            </Link>
          </div>
        )}
      </div>
    );
  } else {
    console.log("shit was not passed properly");
    console.log("prompts", prompts);
    console.log("images", images);
  }
};

export default EndScreen;
