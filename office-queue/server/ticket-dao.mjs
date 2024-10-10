import { db } from "./db.mjs";


export const createTicket = async (service_name) => {
    const issued_time = new Date().toISOString(); //TimeStamp
    const ticket_status = 'pending';
    const sqlQuery1 = 'SELECT * FROM Services WHERE service_name= ?';
    const sqlQuery2 = 'INSERT INTO HistoryTickets (service_name, issued_time , ticket_status) VALUES(?,?,?)';


    //I check if the service is given by the office
    const service = await new Promise((resolve, reject) => {
        db.get(sqlQuery1, [service_name], (err, service) => {
            if (!service) {
                const err = "Service not found";
                reject(err);
            }
            else if (err) {
                reject(err);
            }
            else {
                resolve(service);
            }
        });
    });

    //Insert of the ticket
    const ticket = await new Promise((resolve, reject) => {
        db.run(sqlQuery2, [service_name, issued_time, ticket_status], (err, ticket) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(ticket);
            }
        });
    })
};

