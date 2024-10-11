import {db} from "./db.mjs" 

// Function to get all services
export default function ServicesDAO() {
    
    this.getServices = () => {
        return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM services';
          db.all(query, [], (err, rows) => {
            if (err) {
              reject(err); // Rigetta la Promise in caso di errore
            } else {
              resolve(rows); // Risolvi la Promise con i risultati (rows)
            }
          });
        });
      };
      
      // Function to get a service by ID
      this.getServiceById = (service_name) => {
        return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM services WHERE service_name = ?';
          db.get(query, [service_name], (err, row) => {
            if (err) {
              reject(err); // Rigetta la Promise in caso di errore
            } else {
              resolve(row); // Risolvi la Promise con il risultato (row)
            }
          });
        });
      };
      
      // Function to get a service by name
      this.getServiceByName = (service_name) => {
        return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM services WHERE service_name = ?';
          db.get(query, [service_name], (err, row) => {
            if (err) {
              reject(err); // Rigetta la Promise in caso di errore
            } else {
              resolve(row); // Risolvi la Promise con il risultato (row)
            }
          });
        });
      };

// Function to add a new service
/*function addService(service_name, service_time, callback) {
    const query = 'INSERT INTO services (service_name, service_time) VALUES (?, ?)';
    db.run(query, [service_name, service_time], function(err) {
        if (err) {
            callback(err, null);
        } else {
            // Return the ID of the newly inserted row
            callback(null, { service_id: this.lastID, service_name, service_time });
        }
    });
}

// Function to update an existing service
function updateService(service_id, service_name, service_time, callback) {
    const query = 'UPDATE services SET service_name = ?, service_time = ? WHERE service_id = ?';
    db.run(query, [service_name, service_time, service_id], function(err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { service_id, service_name, service_time });
        }
    });
}*/
}