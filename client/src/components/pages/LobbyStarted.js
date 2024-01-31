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

  return (
    <div style={bgStyle} className="flex flex-col justify-center items-center h-screen w-screen">
      <div style={headerStyle}>
        {/* Further reduced marginTop */}
        <Link to="/" style={{ fontSize: "56px", marginBottom: "80px"}}>DALL-E Phone</Link>
      </div>
      <p className="text-center text-2xl">That lobby's game has already started!</p>    </div>
  );
};

export default NotFound;
