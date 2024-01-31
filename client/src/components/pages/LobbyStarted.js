import React from "react";
import { Link } from "react-router-dom";
import { bgStyle } from "./styles.js";
import "./Lobby.css";

const NotFound = () => {
  const headerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50px", // Reduced height
    width: "100%",
  };

  const buttonStyle =
  "text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2 px-4 rounded shadow-md hover:shadow-lg transition duration-200 ease-in-out border-2 border-emerald-900 border-opacity-50";


  return (
    <div style={bgStyle} className="flex flex-col justify-center items-center h-screen w-screen">
      <div style={headerStyle}>
        {/* Further reduced marginTop */}
        <Link to="/" style={{ fontSize: "56px", marginBottom: "80px" }}>
          DALL-E Phone
        </Link>
      </div>
      <div style={{ marginBottom: '30px' }}>
      <p className="text-center text-2xl">That lobby's game has already started!</p>{" "}
      </div>

      <Link to="/">
        <button className={buttonStyle}>
          Return to Home
        </button>
      </Link>

      
    </div>
  );
};

export default NotFound;
