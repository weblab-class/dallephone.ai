import React from "react";
import "./Prompt.css";

/*
User enters prompt to generate Dalle Image

Proptypes:

*/

const Prompt = (props) => {
  return (
    <div className="prompt">
      <h1>Prompt</h1>
      <input type="text" />
      <button>Submit</button>
    </div>
  );
};
