const SERVER_URL = "http://localhost:3001";

// Funzione per ottenere i servizi dal server
async function fetchServices() {
  const response = await fetch(SERVER_URL + "/api/services", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Se necessario per la sessione
  });

  if (!response.ok) {
    throw new Error("Errore API fetchServices");
  }

  const services = await response.json();
  return services;
}

async function getTicket(service_name) {
  const response = await fetch(SERVER_URL + "/api/historyTickets/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ service_name }),
  });

  if (!response.ok) {
    throw new Error("Errore API getTicket");
  }

  const ticket = await response.json();
  return ticket;
}

async function fetchAllTickets() {
  const response = await fetch(SERVER_URL + "/api/historyTickets/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Errore API fetchAllTickets");
  }

  const tickets = await response.json();
  return tickets;
}

const API = {
  fetchServices,
  getTicket,
  fetchAllTickets,
};

export default API;
