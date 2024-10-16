/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import API from "../services/API";

const ServiceSelection = ({ onTicketGenerated }) => {
  const [selectedService, setSelectedService] = useState("");
  const [ticketNumber, setTicketNumber] = useState(null);
  const [services, setServices] = useState([]);
  const [ticketGenerated, setTicketGenerated] = useState(false);

  // New state to control the visibility of the ticket details
  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await API.fetchServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleServiceSelect = (event) => {
    setSelectedService(event.target.value);
  };

  const handleGenerateTicket = async () => {
    if (selectedService) {
      try {
        const ticket = await API.getTicket(selectedService);
        setTicketNumber(ticket.ticket.ticket_id);
        setTicketGenerated(true);
        setShowTicket(true); // Show the ticket details
        onTicketGenerated();
      } catch (error) {
        console.error("Error generating ticket:", error);
      }
    } else {
      alert("Please select a service.");
    }
  };

  // Handler to close the ticket details
  const handleCloseTicket = () => {
    setShowTicket(false); // Hide the ticket details
    setTicketGenerated(false); // Optionally reset the generated state
  };

  return (
    <div className="bg-slate-800 text-white px-5 py-4 font-sans rounded-md w-full">
      <h2 className="text-2xl font-bold mb-4">Select a Service</h2>

      <div className="mb-4">
        <label htmlFor="service" className="block text-lg mb-2">
          Choose a service:
        </label>
        <select
          id="service"
          value={selectedService}
          onChange={handleServiceSelect}
          className="bg-white text-black px-4 py-2 rounded-md w-full"
        >
          <option value="">-- Select Service --</option>
          {services.map((service, index) => (
            <option key={index} value={service.service_name}>
              {service.service_name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerateTicket}
        className="bg-green-600 text-white px-6 py-2 rounded-md font-bold hover:bg-green-700"
      >
        Get Ticket
      </button>

      {/* Show ticket with close button */}
      {showTicket && ticketGenerated && ticketNumber !== null && (
        <div className="mt-6 bg-yellow-200 text-zinc-800 py-3 px-5 rounded text-center relative">
          <button
            onClick={handleCloseTicket}
            className="absolute top-2 right-2 text-xl font-bold text-zinc-800 hover:text-red-600"
          >
            &times; {/* X character */}
          </button>
          <h3 className="text-xl font-bold mb-2">Ticket Generated</h3>
          <p className="text-lg">Service: {selectedService}</p>
          <p className="text-lg">Ticket Number: {ticketNumber}</p>{" "}
          {/* Ticket Number */}
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
