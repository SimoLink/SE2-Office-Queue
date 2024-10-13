import {db} from "./db.mjs" 

// Function to get all services
export class ServicesDAO {
    
    async getServices() {
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
      async getServiceById(service_name) {
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
      async getServiceByName(service_name) {
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
      async getServiceTime (service_name) {
      return new Promise((resolve, reject) => {
          const query = 'SELECT service_time FROM services WHERE service_name = ?';
          db.get(query, [service_name], (err, row) => {
          if (err) {
              reject(err); // Rigetta la Promise in caso di errore
          } else {
              resolve(row.service_time); // Risolvi la Promise con il risultato (row)
          }
          });
      });
  };

  async getNumberInQueue (service_name) {
      return new Promise((resolve, reject) => {
          const query = 'SELECT COUNT(*) AS num FROM Queue WHERE queue_name = ?';
          db.get(query, [service_name], (err, row) => {
          if (err) {
              reject(err); // Rigetta la Promise in caso di errore
          } else {
            console.log('getNumberInQueue ', row.num);

              resolve(row.num); // Risolvi la Promise con il risultato (row)
          }
          });
      });
  };

  async getCounterForService(service_name){
    return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS num FROM Counter WHERE service_name = ?';
    db.get(query, [service_name], (err, row) => {
    if (err) {
        reject(err); // Rigetta la Promise in caso di errore
    } else {
        console.log('getCounterForService ', row.num);
        
        resolve(row.num); // Risolvi la Promise con il risultato (row)
    }
    });
});
  }
  async getKi(service_name) {
      return new Promise((resolve, reject) => {
          const query = 'SELECT counter_id, COUNT(service_name) AS total_services FROM Counter WHERE counter_id IN (SELECT counter_id FROM Counter WHERE service_name = ?) GROUP BY counter_id';
          db.all(query, [service_name], (err, row) => {
          if (err) {
              reject(err); // Rigetta la Promise in caso di errore
          } else {
              console.log('getCounterForService ', row);
              
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
export default ServicesDAO;
