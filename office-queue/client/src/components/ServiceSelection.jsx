import React, { useState } from "react";


const mockServices = [
    { id: "1", name: "Shipping" },
    { id: "2", name: "Transport" },
    { id: "3", name: "Law" },
];



const ServiceSelection = () => {

    const [selectedService, setSelectedService] = useState("");
    const [ticketNumber, setTicketNumber] = useState(1); 
    const [allTickets, setAllTickets] = useState([]); 
    const [ticketGenerated, setTicketGenerated] = useState(false);



    const handleServiceSelect = (event) => {
        setSelectedService(event.target.value);
    };



    const handleGenerateTicket = () => {
        if (selectedService) {
            const newTicket = {
                service: selectedService,
                ticketNumber: ticketNumber,
            };
            setAllTickets([...allTickets, newTicket]);
            setTicketNumber(ticketNumber + 1);
            setTicketGenerated(true);
        } else {
            alert("Please select a service.");
        }
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
              {mockServices.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name}
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
    
        
          {ticketGenerated && (
            <div className="mt-6 bg-yellow-200 text-zinc-800 py-3 px-5 rounded text-center">
              <h3 className="text-xl font-bold mb-2">Ticket Generated</h3>
              <p className="text-lg">Service: {selectedService}</p>
              <p className="text-lg">Ticket Number: {ticketNumber - 1}</p> {/* Display previous ticket number */}
            </div>
          )}
        </div>
      );
};


export default ServiceSelection;