import React, { useState } from "react";
import { get, post } from "../../utilities";
import "./NewPromptInput.css";

/**
 * Parent Component for all input fields
 *
 * Proptypes:
 * @param {string} defaultText - placeholder text for input field
 * @param {string} original - original prompt id
 * @param {(original, content)} onSubmit - function to handle submission of prompt
 */

const NewInput = (props) => {
  const [content, setContent] = useState("");

  // handles change in input field
  const handleChange = (event) => {
    setContent(event.target.value);
  };

  // called when the user hits submit button for the prompt
  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(content);
    setContent("");
  };

  return (
    <div>
      <input
        type="text"
        placeholder={props.defaultText}
        value={content}
        onChange={handleChange}
        className="NewPromptInput-input"
      />
      <button type="submit" className="NewPromptInput-button" value="submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

/**
 * New image guess
 *
 * Proptypes:
 * @param {string} defaultText - placeholder text for input field
 * @param {string} original - original prompt id
 * @param {function} addNewPrompt - function to add prompt to database
 */
const NewPrompt = (props) => {
  return <NewInput defaultText="Enter your guess!" onSubmit={props.addNewPrompt} />;
};

export default NewPrompt;
