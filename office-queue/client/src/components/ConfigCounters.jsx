import React, { useState, useEffect } from "react";
import API from "../services/API";

const ConfigCounters = () => {
  const [counters, setCounters] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCounter, setSelectedCounter] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [counterServices, setCounterServices] = useState({});

  useEffect(() => {
    // Fetch total counters
    API.fetchTotalCounters()
      .then((totalCounters) => {
        const newCounters = Array.from({ length: totalCounters }, (v, i) => ({
          id: i + 1,
          name: `Counter ${i + 1}`,
        }));
        setCounters(newCounters);
        fetchAllCounterServices(newCounters);
      })
      .catch(handleError);

    // Fetch services from API
    API.fetchServices()
      .then((services) => {
        const servicesNames = services.map((service) => service.service_name);
        setServices(servicesNames);
      })
      .catch(handleError);
  }, []);

  const fetchAllCounterServices = async (allCounters) => {
    const updatedCounterServices = {};

    // Fetch services for all counters
    await Promise.all(
      allCounters.map(async (counter) => {
        try {
          const updatedServices = await API.fetchServicesByCounter(counter.id);
          updatedCounterServices[counter.id] = updatedServices;
        } catch (err) {
          console.error(`Errore nel recupero dei servizi per il counter ${counter.id}:`, err);
          alert(`Errore nel recupero dei servizi per il counter ${counter.id}.`);
        }
      })
    );

    setCounterServices(updatedCounterServices);
  };

  const handleError = (error) => {
    console.error("Errore:", error);
    alert("Si è verificato un errore. Controlla la console per dettagli.");
  };

  const handleServiceSelection = (service_name) => {
    setSelectedServices((prev) => {
      const existingService = prev.includes(service_name);
      if (existingService) {
        return prev.filter((name) => name !== service_name);
      }
      return [...prev, service_name];
    });
  };

  const assignServicesToCounter = () => {
    if (selectedCounter && selectedServices.length > 0) {
      const existingServices = counterServices[selectedCounter] || [];

      // Filtra solo i nuovi servizi da assegnare
      const newServices = selectedServices.filter(
        (service_name) => !existingServices.includes(service_name)
      );

      if (newServices.length > 0) {
        // Aggiungi nuovi servizi
        Promise.all(
          newServices.map((service_name) => {
            return API.addServiceToCounter(selectedCounter, service_name)
              .then(() => {
                console.log(`Servizio ${service_name} assegnato al banco ${selectedCounter}`);
              })
              .catch(err => {
                console.error(`Errore assegnazione servizio ${service_name}`, err);
                alert(`Errore assegnazione servizio ${service_name}: ${err.message}`);
              });
          })
        ).then(() => {
          setCounterServices((prev) => ({
            ...prev,
            [selectedCounter]: [...existingServices, ...newServices],
          }));
          setSelectedServices([]); // Resetta i servizi selezionati dopo l'assegnazione
        });
      }
    }
  };

  const removeService = (counter_id, service_name) => {
    API.removeServiceFromCounter(counter_id, service_name)
      .then(() => {
        // Aggiorna direttamente lo stato senza fare una nuova chiamata API
        setCounterServices((prev) => ({
          ...prev,
          [counter_id]: prev[counter_id].filter((name) => name !== service_name), // Rimuovi il servizio dal counter
        }));
        console.log(`Servizio ${service_name} rimosso dal banco ${counter_id}`);
      })
      .catch(err => {
        console.error("Errore nella rimozione del servizio:", err);
        alert(`Errore nella rimozione del servizio ${service_name}: ${err.message}`);
      });
  };

  return (
    <div className="bg-slate-800 text-white px-5 py-4 font-sans rounded-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Counters</h1> 

      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl" >Seleziona il counter per assegnare  iservizi scelti</h2>

      </div>
      {/* Tabella Counters */}
      <div className="grid grid-cols-5 gap-4 font-semibold mb-2">
        <span>Counters</span>
        <span>Services</span>
      </div>

      {counters.map((counter) => (
        <div
          key={counter.id}
          className={`grid grid-cols-5 gap-4 mb-2 items-center ${
            selectedCounter === counter.id ? "bg-slate-600" : ""
          }`}
        >
          <div
            className="cursor-pointer"
            onClick={() => setSelectedCounter(counter.id)}
          >
            {counter.name}
          </div>
          <div>
            {/* Elenca solo i servizi attualmente associati a questo counter */}
            <ul>
              {(counterServices[counter.id] || []).map((service_name) => (
                <li key={service_name} className="flex justify-between items-center">
                  {service_name}
                  <button onClick={() => removeService(counter.id, service_name)} style={{ marginLeft: '10px', color: 'red' }}>
                    &#10005; {/* Icona della crocetta */}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {/* Tabella Servizi per assegnare ai counters */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Servizi disponibili</h2>

        <div className="grid grid-cols-5 gap-4 mb-2">
          {services.map((service_name) => (
            <div key={service_name}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service_name)}
                  onChange={() => handleServiceSelection(service_name)}
                />
                <span>{service_name}</span>
              </label>
            </div>
          ))}
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          onClick={assignServicesToCounter}
          disabled={!selectedCounter || selectedServices.length === 0}
        >
          Assegna Servizi al Counter
        </button>
      </div>
    </div>
  );
};

export default ConfigCounters;
