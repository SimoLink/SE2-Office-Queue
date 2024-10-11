import { db } from "./db.mjs";
import ServicesDAO from "./services-dao.mjs";
import evaluateWaitingTime from "./util.mjs";

const servicesDao = new ServicesDAO();

export class TicketDAO {
  // Metodo per creare un ticket
  async createTicket(service_name) {
    const issued_time = new Date().toISOString(); //TimeStamp
    const ticket_status = 'pending';
    const sqlQuery1 = 'SELECT * FROM Services WHERE service_name = ?';
    const sqlQuery2 = 'INSERT INTO HistoryTickets (service_name, issued_time, ticket_status) VALUES (?, ?, ?)';

    // Controllo se il servizio è fornito dall'ufficio
    const service = await new Promise((resolve, reject) => {
      db.get(sqlQuery1, [service_name], (err, service) => {
        if (!service) {
          const err = "Service not found";
          reject(err);
        } else if (err) {
          reject(err);
        } else {
          resolve(service);
        }
      });
    });

    // Inserimento del ticket
    const ticket = await new Promise((resolve, reject) => {
      db.run(sqlQuery2, [service_name, issued_time, ticket_status], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            service_name,
            issued_time,
            ticket_status,
          });
        }
      });
    });

    return ticket;
  }

//NEW
async nextCustomer(counter_id) {
  const sqlQuery1 = 'SELECT * FROM Counter WHERE counter_id = ?';

  const serviceList = await new Promise((resolve, reject) => {
    db.all(sqlQuery1, [counter_id], (err, res) => {
      if (!res) {
        const err = "Service not found";
        reject(err);
      } else if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

  const times = new Map();

  for (const service of serviceList) {
    // Otteniamo service_time, ticket_number, counter_number e ki per ogni servizio
    try {
      const service_time = await servicesDao.getServiceTime(service.service_name);
      const ticket_number = await servicesDao.getNumberInQueue(service.service_name);
      if(ticket_number !== 0){
        const counter_number = await servicesDao.getCounterForService(service.service_name);
        const ki = await servicesDao.getKi(service.service_name);
  
        // Calcola il tempo di attesa per il servizio corrente
        let time = evaluateWaitingTime(service_time, ticket_number, ki, 1, counter_number);
        times.set(service.service_name, time);
  
        console.log(`Tempo di attesa per ${service.service_name}:`, time);
        
      } else return;
    } catch (error) {
      console.error(`Errore nel recuperare i dati per il servizio ${service.service_name}:`, error);
    }
  }

  // Ora che tutte le promesse sono risolte, possiamo continuare
  console.log('Tutti i tempi sono stati calcolati', times);

  let maxValue = -Infinity;  // Valore massimo iniziale
  let maxPairs = [];  // Array per memorizzare tutte le coppie con il valore massimo

  // Itera sulla Map per trovare tutte le chiavi con il valore massimo
  times.forEach((value, key) => {
    if (value > maxValue) {
      maxValue = value;
      maxPairs = [[key, value]];  // Resetto e aggiungo la nuova coppia con valore massimo
    } else if (value === maxValue) {
      maxPairs.push([key, value]);  // Aggiungo coppia se ha lo stesso valore massimo
    }
  });

  console.log('Coppie con il valore massimo:', maxPairs);

  const serviceNames = maxPairs.map(pair => pair[0]);  // Otteniamo i nomi dei servizi con il valore massimo

  const sqlQuery2 = `
    SELECT service_name, service_time
    FROM Services
    WHERE service_name IN (${serviceNames.map(() => '?').join(', ')})
    ORDER BY service_time ASC
    LIMIT 1;
  `;

  const bestService = await new Promise((resolve, reject) => {
    db.get(sqlQuery2, serviceNames, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

  console.log('Il servizio con il service_time minore è:', bestService);

  // Elimina il ticket dalla tabella Queue
  const sqlQuery3 = `
    DELETE FROM Queue
    WHERE queue_name = ?
    RETURNING ticket_id;
  `;

  const deletedTicketId = await new Promise((resolve, reject) => {
    db.get(sqlQuery3, [bestService.service_name], (err, res) => {
      if (err) {
        reject(err);
      } else if (res && res.ticket_id) {
        resolve(res.ticket_id);
      } else {
        reject('Nessun ticket trovato per questo servizio');
      }
    });
  });

  console.log(`Ticket eliminato: ${deletedTicketId}`);
  return deletedTicketId;
}

}
export default TicketDAO;
