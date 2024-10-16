/* eslint-disable no-unused-vars */
import React from "react";
import CurrentTickets from "./CurrentTickets";
import ServiceSelection from "./ServiceSelection.jsx"

const DisplayBoard = () => {
  return (
    <div className="w-1/2 h-1/2 flex justify-center items-center flex-col m-auto space-y-6 p-10">
      <h1 className="text-2xl font-bold">Queue Management System</h1>
      <ServiceSelection />
      <CurrentTickets />
    </div>
  );
};

export default DisplayBoard;
