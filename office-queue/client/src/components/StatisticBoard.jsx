import React, { useState, useEffect } from "react";
import API from "/src/services/API.js";  // Importa la funzione dal file API.js

const StatisticBoard = () => {
  const [period, setPeriod] = useState("day");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);  // Default to today
  const [counters, setCounters] = useState([]); // Modificato per essere un array
  const [availableServices, setAvailableServices] = useState([]); // Stato per i servizi disponibili
  const [selectedServices, setSelectedServices] = useState([]);   // Stato per i servizi selezionati
  const [stats, setStats] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Funzione per gestire la chiamata API
  const loadStats = async () => {
    if (date) {
      try {
        const serviceNames = selectedServices.join(","); // Trasformare i servizi selezionati in stringa separata da virgole
        const counterIDs = counters.join(","); // Trasformare i counter selezionati in stringa
        const data = await API.fetchStats(period, date, counterIDs, serviceNames);
        
        if (data.data) {
          setStats(data.data);
          setErrorMessage("");  // Reset del messaggio di errore in caso di successo
        } else {
          setErrorMessage("No stats available for the selected criteria.");
          setStats([]);
        }
      } catch (error) {
        setErrorMessage("Error fetching statistics. Please try again.");
        console.error(error);
      }
    }
  };

  // Funzione per caricare i servizi disponibili dall'API
  const loadServices = async () => {
    try {
      const services = await API.fetchServices(); // Usa la funzione che chiama l'API per ottenere i servizi
      setAvailableServices(services);
    } catch (error) {
      setErrorMessage("Error fetching services.");
      console.error(error);
    }
  };

  // Funzione per gestire la selezione/deselezione di un servizio
  const toggleServiceSelection = (service) => {
    setSelectedServices((prevSelectedServices) => {
      if (prevSelectedServices.includes(service)) {
        // Se il servizio è già selezionato, lo rimuoviamo
        return prevSelectedServices.filter((s) => s !== service);
      } else {
        // Altrimenti lo aggiungiamo
        return [...prevSelectedServices, service];
      }
    });
  };

  // Funzione per gestire la selezione/deselezione di un counter
  const toggleCounterSelection = (counter) => {
    setCounters((prevSelectedCounters) => {
      if (prevSelectedCounters.includes(counter)) {
        // Se il counter è già selezionato, lo rimuoviamo
        return prevSelectedCounters.filter((c) => c !== counter);
      } else {
        // Altrimenti lo aggiungiamo
        return [...prevSelectedCounters, counter];
      }
    });
  };

  // Effetto per caricare i servizi quando il componente viene montato
  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div className="w-1/2 h-1/2 flex flex-col justify-center items-center m-auto space-y-6 p-10">
      <h1 className="text-2xl font-bold">Statistic Dashboard</h1>

      {/* Form per selezionare il periodo, data, counters e service names */}
      <form className="flex flex-col space-y-4" onSubmit={(e) => { e.preventDefault(); loadStats(); }}>
        <label>
          Period:
          <select
            className="border p-2 ml-2"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </label>

        <label>
          Date:
          <input
            className="border p-2 ml-2"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        {/* Selezione dei counters tramite bottoni */}
        <div>
          <label>Counters:</label>
          <div className="flex flex-wrap">
            {[1, 2, 3].map((counter) => (
              <button
                key={counter}
                type="button"
                className={`p-2 m-1 border ${counters.includes(counter) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => toggleCounterSelection(counter)} // Usa il counter
              >
                {counter}
              </button>
            ))}
          </div>
        </div>
        
        {/* Selezione dei servizi tramite bottoni */}
        <div>
          <label>Services:</label>
          <div className="flex flex-wrap">
            {availableServices.map((service, index) => (
              <button
                key={index}
                type="button"
                className={`p-2 m-1 border ${selectedServices.includes(service.service_name) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => toggleServiceSelection(service.service_name)} // Usa il campo `service_name`
              >
                {service.service_name}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Fetch Stats
        </button>
      </form>

      {/* Visualizzazione delle statistiche o del messaggio di errore */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {stats.length > 0 && (
        <table className="table-auto border-collapse border border-gray-400 w-full mt-6">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Counter ID</th>
              <th className="border border-gray-300 px-4 py-2">Service Name</th>
              <th className="border border-gray-300 px-4 py-2">Total Served</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{stat.counter_id}</td>
                <td className="border border-gray-300 px-4 py-2">{stat.service_name}</td>
                <td className="border border-gray-300 px-4 py-2">{stat.total_served}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StatisticBoard;
