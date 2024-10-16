/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import API from "../services/API";

const CurrentTickets = ({ tickets }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Showing the current time "HH:MM"
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-800 text-white px-5 py-4 font-sans rounded-md w-full ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Current Tickets</h1>
        <span className="text-xl">
          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-4 font-semibold mb-2">
        <span>Ticket</span>
        <span>Service</span>
        <span>Counter</span>
        <span>Status</span>
        <span>Est. Wait</span>
      </div>

      {tickets.length === 0 ? (
        <p className="text-center">No tickets are currently in the system.</p>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            className="grid grid-cols-5 gap-4 mb-2 items-center"
          >
            <div
              className={`${
                ticket.status === "SERVING"
                  ? "bg-rose-500 text-zinc-800 py-1 px-3 rounded text-center"
                  : "bg-black text-white py-1 px-3 rounded text-center"
              }`}
            >
              {ticket.ticket_id}
            </div>
            <span>{ticket.service_name}</span>
            <span>{ticket.counter_id || "N/A"}</span>
            <span className="relative inline-flex items-center">
              {ticket.status === "SERVING" ? (
                <>
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Serving
                </>
              ) : (
                <>
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Waiting
                </>
              )}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default CurrentTickets;
