/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useState } from "react";

const mockTickets = [
  {
    ticket_id: "1",
    service_name: "Shipping",
    counter_id: "1",
    issued_time: "2024-10-10T09:55:00",
  },
  {
    ticket_id: "2",
    service_name: "Shipping",
    counter_id: "2",
    issued_time: "2024-10-10T09:55:00",
    status: "WAITING",
  },
  {
    ticket_id: "3",
    service_name: "Transport",
    counter_id: "1",
    issued_time: "2024-10-10T09:55:00",
    status: "WAITING",
  },
];

const CurrentTickets = () => {
  const [currentTickets, setCurrentTickets] = useState([]);

  useEffect(() => {
    setCurrentTickets(mockTickets);
  }, [currentTickets]);

  //   useEffect(() => {
  //     // Function to fetch current tickets
  //     const fetchCurrentTickets = () => {
  //       fetch('http://localhost:3000/api/current-tickets')
  //         .then((response) => response.json())
  //         .then((data) => setCurrentTickets(data))
  //         .catch((error) => console.error('Error fetching current tickets:', error));
  //     };

  return (
    <div className="w-1/2 h-1/2 bg-slate-800 text-white">
      <h2 className="text-emerald-50">Now Serving</h2>
      {currentTickets.length === 0 ? (
        <p>No tickets are currently being served.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ticket Number</th>
              <th>Service</th>
              <th>Counter</th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td>{ticket.ticket_id}</td>
                <td>{ticket.service_name}</td>
                <td>{ticket.counter_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CurrentTickets;
