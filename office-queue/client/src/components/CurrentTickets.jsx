/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useState } from "react";
import {ListGroup} from 'react-bootstrap';
import {Badge} from 'react-bootstrap';

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
    <div>
      <h2 className="text-emerald-50">Now Serving</h2>
      {currentTickets.length === 0 ? (
        <p>No tickets are currently being served.</p>
      ) : (
        <ListGroup variant="flush">
          <ListGroup.Item>Cras justo odio <Badge bg="primary" pill>14</Badge></ListGroup.Item>
          <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
          <ListGroup.Item>Morbi leo risus</ListGroup.Item>
          <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
        </ListGroup>
        // <table>
        //   <thead>
        //     <tr>
        //       <th>Ticket Number</th>
        //       <th>Service</th>
        //       <th>Counter</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {currentTickets.map((ticket) => (
        //       <tr key={ticket.ticket_id}>
        //         <td>{ticket.ticket_id}</td>
        //         <td>{ticket.service_name}</td>
        //         <td>{ticket.counter_id}</td>
        //       </tr>
        //     ))}
        //   </tbody>
        // </table>
      )}
    </div>
  );
};

export default CurrentTickets;
