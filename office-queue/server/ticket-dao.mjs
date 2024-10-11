import { db } from "./db.mjs";

export class TicketDAO {
  // Metodo per creare un nuovo biglietto
  async createTicket(service_name) {
    const issued_time = new Date().toISOString();
    const ticket_status = 'pending';
    const sqlQuery1 = 'SELECT * FROM Services WHERE service_name = ?';
    const sqlQuery2 = 'INSERT INTO HistoryTickets (service_name, issued_time, ticket_status) VALUES (?, ?, ?)';

    // Verifica se il servizio esiste
    const service = await this.findServiceByName(service_name);
    if (!service) {
      throw new Error("Service not found");
    }

    // Inserimento del ticket
    await this.insertTicket(service_name, issued_time, ticket_status);
  }

  // Metodo per trovare un servizio dal nome
  async findServiceByName(service_name) {
    const sqlQuery = 'SELECT * FROM Services WHERE service_name = ?';
    return new Promise((resolve, reject) => {
      db.get(sqlQuery, [service_name], (err, service) => {
        if (err) {
          reject(err);
        } else {
          resolve(service);
        }
      });
    });
  }

  // Metodo per inserire un ticket
  async insertTicket(service_name, issued_time, ticket_status) {
    const sqlQuery = 'INSERT INTO HistoryTickets (service_name, issued_time, ticket_status) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(sqlQuery, [service_name, issued_time, ticket_status], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export default TicketDAO;

