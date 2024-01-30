import React from "react";
import { bgStyle } from "./styles";

const NotFound = () => {
  return (
    <div style={bgStyle} className="h-screen w-screen flex-col flex items-center justify-center">
      <h1 className="text-center text-2xl">404 Not Found</h1>
      <p className="text-center text-lg">The page you requested does not exist.</p>
    </div>
  );
};

export default NotFound;
