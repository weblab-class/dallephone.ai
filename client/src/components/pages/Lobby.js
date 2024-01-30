import React, { useState, useEffect } from "react";
import OriginalPrompt from "./OriginalPrompt.js";
import { socket } from "../../client-socket.js";
import { useParams, useNavigate } from "react-router-dom";
import { get, post } from "../../utilities";
import { bgStyle, buttonClass } from "./styles.js";

/**
 * Will need to get user ids of all players in the lobby from database
 * currently do not know how to do this, am just using dummy data right now
 * and ensuring that the current user is in it at least.
 *
 * proptypes:
 *
 * States to pass:
 * @param {array} players - array of everyone currently online (anwhere, not just in lobby)
 * @param {uh ask rich ab this} lobbyUsers- all users in the lobby
 * @param {string} game_id - id of the game, 4 capital letters
 */

const Lobby = () => {
  const [lobbyUsers, setLobbyUsers] = useState({}); // New state for tracking lobby users
  const [numPlayers, setNumPlayers] = useState(0); // New state for tracking lobby users
  const { game_id } = useParams();
  const navigate = useNavigate();
  const [isHost, setIsHost] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkGameExistsAndUpdateUser = async () => {
      try {
        const res = await get("/api/getGameIDs");
        if (!res.includes(game_id)) {
          navigate("/lobbyNotFound");
          return;
        } else {
          const started = await get("/api/gameStatus", { game_id: game_id });
          if (started.gameStarted) {
            navigate("/lobbyStarted");
          } else {
            setAuthenticated(true);
          }
        }

        await post("/api/updateGameId", { game_id: game_id });
      } catch (error) {
        console.error("Error:", error);
        navigate("/error");
      }
    };

    checkGameExistsAndUpdateUser();

    socket.on("gameStarted", (code) => {
      if (code === game_id) {
        navigate(`/game/${game_id}`);
      }
    });

    socket.emit("joinLobby", { game_id: game_id, socket_id: socket.id });

    console.log(socket.id);
    socket.emit("checkHost", { game_id: game_id, socket_id: socket.id });

    socket.on(
      "assignHost",
      (data) => {
        if (data.isHost) {
          console.log("I am the host");
          setIsHost(true); // Set a state variable to track if the current user is the host
        }
      },
      []
    );

    socket.on("lobbyUsersUpdate", (data) => {
      console.log("Received lobby users update:", data);
      Object.entries(data["lobbyUsers"]) // Convert object to array of [userId, gameId]
        .filter(([userName, gameId]) => gameId === game_id) // Corrected filter condition
        .map(([userName, gameId], index) => (
          <li key={userName}>
            Player {index + 1}: {userName}
          </li> // Render list item
        ));
      setLobbyUsers(data); // Update the lobbyUsers state

      return () => {
        socket.off("lobbyUsersUpdate");
        socket.off("assignHost");
        socket.off("gameStarted");
        socket.off("checkHost");
        socket.off("joinLobby");
      };
    });
  }, [game_id, navigate]);

  // Function to render the list of online players
  const renderOnlinePlayers = () => {
    return (
      <div>
        <h3>Online Players:</h3>
        <ul>
          {Object.entries(lobbyUsers["lobbyUsers"]) // Convert object to array of [userId, gameId]
            .filter(([userName, gameId]) => gameId === game_id) // Corrected filter condition
            .map(([userName, gameId], index) => (
              <li key={userName}>
                Player {index + 1}: {userName}
              </li> // Render list item
            ))}
        </ul>
      </div>
    );
  };

  const renderStartGameButton = () => {
    if (isHost) {
      return (
        <div className="w-[400px] h-[40px] flex justify-center items-center h-screen">
          <button onClick={handleStartGame} className={buttonClass}>
            Start Game
          </button>
        </div>
      );
    }
    return null;
  };

  const handleStartGame = () => {
    // Emit an event to the server to start the game
    socket.emit("startGame", game_id);
  };

  useEffect(() => {
    if (lobbyUsers["lobbyUsers"]) {
      setNumPlayers(Object.keys(lobbyUsers["lobbyUsers"]).length);
    }
  }, [lobbyUsers]);

  return (
    <div style={bgStyle} className="flex flex-col justify-center items-center h-screen w-screen">
      {authenticated ? (
        numPlayers > 1 ? (
          <>
            {renderOnlinePlayers()}
            {renderStartGameButton()}
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-screen w-screen">
            <p className="text-center text-3xl p-4">Waiting for players</p>
            <p className="text-center text-xl p-4">Send your friends the lobby code: {game_id}</p>
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
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default Lobby;
