/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import API from "/src/services/API.js";  // Importa la funzione dal file API.js

const StatisticBoard = () => {
  const [period, setPeriod] = useState("day");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);  // Default to today
  const [counters, setCounters] = useState("");
  const [serviceNames, setServiceNames] = useState("");
  const [stats, setStats] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Funzione per gestire la chiamata API
  const loadStats = async () => {
    if (date) {
      try {
        const data = await API.fetchStats(period, date, counters, serviceNames);
        
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

        <label>
          Counter IDs (comma-separated):
          <input
            className="border p-2 ml-2"
            type="text"
            value={counters}
            onChange={(e) => setCounters(e.target.value)}
            placeholder="Optional"
          />
        </label>

        <label>
          Service Names (comma-separated):
          <input
            className="border p-2 ml-2"
            type="text"
            value={serviceNames}
            onChange={(e) => setServiceNames(e.target.value)}
            placeholder="Optional"
          />
        </label>

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
