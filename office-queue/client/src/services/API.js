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


//counters APIS


// Funzione per assegnare un servizio a un banco
async function addServiceToCounter(counter_id, service_id) {
  const response = await fetch(SERVER_URL + "/api/counters/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Se necessario per la sessione
    body: JSON.stringify({ counter_id, service_id }),
  });

  if (!response.ok) {
    throw new Error("Errore API addServiceToCounter");
  }

  const result = await response.json();
  return result;
}

// Funzione per rimuovere un servizio da un banco
async function removeServiceFromCounter(counter_id, service_name) {
  const response = await fetch(SERVER_URL + "/api/counters/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ counter_id, service_name }),
  });

  if (!response.ok) {
    throw new Error("Errore API removeServiceFromCounter");
  }

  const result = await response.json();
  return result;
}

// Funzione per ottenere i servizi assegnati a un banco
async function fetchServicesByCounter(counter_id) {
  const response = await fetch(SERVER_URL + `/api/counters/${counter_id}/services`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Errore API fetchServicesByCounter");
  }

  const services = await response.json();
  return services;
}

// Funzione per ottenere i banchi associati a un servizio specifico
async function fetchCountersByService(service_name) {
  const response = await fetch(SERVER_URL + `/api/services/${service_name}/counters`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Errore API fetchCountersByService");
  }

  const counters = await response.json();
  return counters;
}

// Funzione per ottenere il numero totale di banchi
async function fetchTotalCounters() {
  const response = await fetch(SERVER_URL + "/api/counters/number", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Errore API fetchTotalCounters");
  }

  const { counters_N } = await response.json();
  return counters_N;
}

async function fetchStats(period, date, counters = "", serviceNames = ""){
  try {
    const queryParams = new URLSearchParams({
      counter_id: counters,
      service_name: serviceNames,
    });
    console.log(period, date);
    
    const response = await fetch(SERVER_URL + `/api/statsCounter/${period}/${date}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error("Error fetching statistics");
    }

    const data = await response.json();
    console.log(data);
    
    return data;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function callNextCustomer(counter_id) {
  const response = await fetch(SERVER_URL + `/api/nextCustomer/${counter_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Errore API callNextCustomer");
  }

  const data = await response.json();
  return data;
}

const API = {
  fetchServices,
  getTicket,
  fetchAllTickets,
  addServiceToCounter,
  removeServiceFromCounter,
  fetchServicesByCounter,
  fetchCountersByService,
  fetchTotalCounters,
  fetchStats,
  callNextCustomer

};

export default API;
