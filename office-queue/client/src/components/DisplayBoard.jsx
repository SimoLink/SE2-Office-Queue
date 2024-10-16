/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import CurrentTickets from "./CurrentTickets";
import ServiceSelection from "./ServiceSelection.jsx";
import API from "../services/API.js";

const DisplayBoard = () => {
  const [tickets, setTickets] = useState([]);
  const fetchAllTickets = async () => {
    try {
      const data = await API.fetchAllTickets();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  useEffect(() => {
    fetchAllTickets();
  }, []);

  return (
    <div className="w-1/2 h-1/2 flex justify-center items-center flex-col m-auto space-y-6 p-10">
      <h1 className="text-2xl font-bold">Queue Management System</h1>
      <CurrentTickets tickets={tickets} />
      <ServiceSelection onTicketGenerated={fetchAllTickets} />
    </div>
  );
};

export default DisplayBoard;
