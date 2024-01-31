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
    <form onSubmit={handleSubmit} className="flex justify-center p-2">
      <input
        type="text"
        placeholder={props.defaultText}
        value={content}
        onChange={handleChange}
        className="shadow-lg shadow-slate-500/50 w-[512px] h-[64px] placeholder-center rounded-l-3xl border-y-2 border-l-2 border-emerald-700 text-emerald-950"
        style={{ textAlign: "center", fontSize: "1.7rem" }}
      />
      <input
        type="image"
        src={submitbutton}
        style={{ backgroundSize: "50% auto" }}
        className="rounded-r-3xl hover:bg-blue-500 shadow-lg shadow-slate-500/50
                bg-center bg-no-repeat bg-slate-500 w-[68px] h-[64px] transform hover:scale-105 transition duration-300 border-y-2 border-r-2 border-emerald-700"
      />
    </form>
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
  const centerDiv = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  return props.enteredPrompt ? (
    <div style={centerDiv}>
      <div className="text-center text-lg">
        <br></br>
      </div>
      <div className="text-center text-lg">Waiting for others to submit prompts</div>
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-slate-50 animate-spin dark:text-emerald-600 fill-emerald-900"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  ) : (
    <NewInput defaultText="Enter your guess!" onSubmit={props.addNewPrompt} />
  );
};

export default NewPrompt;
