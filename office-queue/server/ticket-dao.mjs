import { db } from "./db.mjs";
import ServicesDAO from "./services-dao.mjs";
import evaluateWaitingTime from "./util.mjs";

const servicesDao = new ServicesDAO();

export class TicketDAO {

  async getTodayTickets() {
    const today = new Date().toISOString().split('T')[0]; 

    const sqlQuery = `
      SELECT * FROM HistoryTickets
      WHERE DATE(issued_time) = ?
    `;

    const tickets = await new Promise((resolve, reject) => {
      db.all(sqlQuery, [today], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    if (tickets.length > 0) {
      return tickets;
    } else {
      return [];
    }
  }

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
      console.log(service.service_name);

      try {
        const service_time = await servicesDao.getServiceTime(service.service_name);
        const ticket_number = await servicesDao.getNumberInQueue(service.service_name);
        if (ticket_number !== 0) {
          const counter_number = await servicesDao.getCounterForService(service.service_name);
          const ki = await servicesDao.getKi(service.service_name);

          // Calcola il tempo di attesa per il servizio corrente
          let time = evaluateWaitingTime(service_time, ticket_number, ki, 1, counter_number);
          times.set(service.service_name, time);

          console.log(`Tempo di attesa per ${service.service_name}:`, time);

        }
        //else return;
      } catch (error) {
        console.error(`Errore nel recuperare i dati per il servizio ${service.service_name}:`, error);
      }
    }

    if(!times){
      console.log('Nessun servizio trovato!');
      return;      
    }else{
      // Ora che tutte le promesse sono risolte, possiamo continuare
      console.log('Tutti i tempi sono stati calcolati', times);
    }


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

    if(bestService !== undefined){

      console.log('Il servizio con il service_time minore è:', bestService);
    }else{
      console.log('Nessun servizio trovato!', bestService);
      return;
    }

    // Otteniamo l'id del ticket da eliminare
    const sqlQuery3 = `
      SELECT ticket_id
      FROM Queue
      WHERE queue_name = ?
      ORDER BY ticket_id ASC
      LIMIT 1;
    `;

    const selectedTicket = await new Promise((resolve, reject) => {
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

    if (selectedTicket) {
      const sqlQuery4 = `
        DELETE FROM Queue
        WHERE ticket_id = ?
      `;

      await new Promise((resolve, reject) => {
        db.run(sqlQuery4, [selectedTicket], (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });

      console.log(`Ticket with ID ${selectedTicket} deleted successfully.`);

      const sqlQuery5 = 'UPDATE HistoryTickets SET ticket_status = ? WHERE ticket_id = ?';

      await new Promise((resolve, reject) => {
        db.run(sqlQuery5, ['served', selectedTicket], (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
      
      // TODO: CALL CUSTOMER FUNCTION

      return selectedTicket;
    } else {
      return undefined;
      // throw new Error('No ticket found to delete.');
    }
  }

}


export default TicketDAO;
