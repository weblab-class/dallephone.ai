import React from "react";
import { bgStyle } from "./styles";

const NotFound = () => {
  return (
    <div style={bgStyle} className="h-screen w-screen flex items-center justify-center">
      <p className="text-center text-2xl">That lobby's game has already started!</p>
    </div>
  );
};

export default NotFound;
