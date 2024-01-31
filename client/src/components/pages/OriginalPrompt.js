import React, { useState, useEffect } from "react";
import Game from "./Game.js";
import { get, post } from "../../utilities.js";
import { socket } from "../../client-socket.js";
import submitbutton from "../img/white-submit-icon.png";
import { bgStyle } from "./styles.js";

/**
 *
 * As written, this does not work yet because you need to fetch all the
 * Original Prompts from the database. I'm not sure how to do that yet because
 * we need to know when everyone has submitted a post request to the server.
 *
 * proptypes:
 * @param {object} players - array of player objects
 * @param {string} game_id - id of the game
 *
 * states passed:
 * @param {number} playerNum - player number of current user
 * @param {array} originalPrompts - object of prompt OBJECTS (not prompt ids!), maps index to prompt object
 */

const OriginalPrompt = ({ num_players, game_id }) => {
  const [prompt, setPrompt] = useState("");
  const [enteredPrompt, setEnteredPrompt] = useState(false); // useState for enteredPrompt
  const [originalPrompts, setOriginalPrompts] = useState([]);
  const [playerNum, setPlayerNum] = useState(-1); // useState for playerNum
  const [allPromptsSubmitted, setAllPromptsSubmitted] = useState(false); // useState for allPromptsSubmitted
  const [userID, setUserID] = useState(undefined);

  useEffect(() => {
    // Fetch user data inside useEffect
    get("/api/whoami").then((user) => {
      setUserID(user._id);
    });
  }, []); // Dependency array to control when the effect runs

  const handleChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (prompt !== "") {
      post("/api/prompt/original", { content: prompt, game_id: game_id }).then(() => {
        setEnteredPrompt(true);
        console.log("I submitted");
        socket.emit("submitPrompt", { senderID: socket.id, gameID: game_id });
      });
    }
  };

  socket.on("allPromptsSubmitted", () => {
    get("/api/prompt/originalprompts", { game_id: game_id }).then((prompts) => {
      // console.log("all prompts received");
      // console.log(Object.keys(prompts));
      console.log("userID", userID);
      // console.log("creator type", typeof prompts[0].creator);
      // console.log(
      //   "filtered stuff",
      //   Object.keys(prompts).filter((key) => prompts[key].creator === userID)[0]
      // );
      if (userID !== undefined) {
        setOriginalPrompts(prompts);
        setPlayerNum(
          parseInt(Object.keys(prompts).filter((key) => prompts[key].creator === userID)[0])
        );
      }
      // setAllPromptsSubmitted(originalPrompts.length !== 0 && playerNum !== -1);
      if (allPromptsSubmitted) console.log(originalPrompts);
    });
  });

  // implement to check that all players have submitted prompts
  if (userID !== undefined) {
    if (originalPrompts.length !== 0 && playerNum !== -1)
      return (
        <Game
          originalPrompts={originalPrompts}
          num_players={num_players}
          playerNum={playerNum}
          game_id={game_id}
        />
      );
    else if (enteredPrompt) {
      return (
        <div
          style={bgStyle}
          className="flex flex-col justify-center items-center h-screen w-screen"
        >
          <p className="text-center text-3xl p-4">Waiting for other players to submit prompts</p>
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
      );
    } else {
      return (
        <div style={bgStyle} className="flex justify-center items-center h-screen w-screen">
          <div className="flex flex-col items-center">
            <div className="h-[120px]">
              <div className="text-5xl">Write a quirky sentence!</div>
            </div>
            <form onSubmit={handleSubmit} className="flex justify-center">
              <label>
                <input
                  placeholder="Enter a prompt!"
                  type="text"
                  className="shadow-lg shadow-slate-500/50 w-[600px] h-[64px] placeholder-center rounded-l-3xl border-y-2 border-l-2 border-emerald-700 text-emerald-950"
                  style={{ textAlign: "center", fontSize: "1.7rem" }}
                  value={prompt}
                  onChange={handleChange}
                />
              </label>
              <input
                type="image"
                src={submitbutton}
                style={{ backgroundSize: "50% auto" }}
                className="rounded-r-3xl hover:bg-blue-500 shadow-lg shadow-slate-500/50
                bg-center bg-no-repeat bg-slate-500 w-[68px] h-[64px] transform hover:scale-105 transition duration-300 border-y-2 border-r-2 border-emerald-700"
              />
            </form>
          </div>
        </div>
      );
    }
  }
};

export default OriginalPrompt;
