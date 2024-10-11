/* eslint-disable no-unused-vars */
import React from "react";
import CurrentTickets from "./CurrentTickets";

const DisplayBoard = () => {
  return (
    <div>
      <h1 className="bg-slate-400 text-2xl">Queue Management System</h1>
      <CurrentTickets />
    </div>
  );
};

export default DisplayBoard;
