import React, { useState } from "react";
import { get, post } from "../../utilities";
import submitbutton from "../img/white-submit-icon.png";

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
    <div className="flex justify-center p-2">
      <input
        type="text"
        placeholder={props.defaultText}
        value={content}
        onChange={handleChange}
        className="shadow-lg shadow-slate-500/50 w-[512px] h-[64px] placeholder-center rounded-l-3xl border-y-2 border-l-2 border-emerald-700 text-emerald-950"
        style={{ textAlign: "center", fontSize: "1.7rem" }}
      />
      <button
        type="submit"
        onClick={handleSubmit}
        style={{ backgroundSize: "50% auto" }}
        className="rounded-r-3xl hover:bg-blue-500 shadow-lg shadow-slate-500/50
                bg-center bg-no-repeat bg-slate-500 w-[68px] h-[64px] transform hover:scale-105 transition duration-300 border-y-2 border-r-2 border-emerald-700"
      >
        <img src={submitbutton} />
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
 * @param {boolean} enteredPrompt - whether prompt was submitted or not
 */
const NewPrompt = (props) => {
  return props.enteredPrompt ? (
    <div className="text-center text-lg">Waiting for others to submit prompts</div>
  ) : (
    <NewInput defaultText="Enter your guess!" onSubmit={props.addNewPrompt} />
  );
};

export default NewPrompt;
