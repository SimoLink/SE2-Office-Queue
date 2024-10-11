import { db } from "./db.mjs";

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
}

export default TicketDAO;
