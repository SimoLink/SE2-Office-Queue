import { db } from "./db.mjs";

export class CounterDAO {
    async addService(counter_id,service_name) {
        const sqlQuery1 = 'INSERT INTO Counter (counter_id, service_name) VALUES (?, ?)';
        // I can implement a service_name check here

        const counter = await new Promise((resolve, reject) => {
            db.run(sqlQuery1, [counter_id, service_name], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        counter_id,
                        service_name
                    });
                }
            });
        });

        return counter;
    }

    async removeService(counter_id,service_name) {
        const sqlQuery2 = "DELETE FROM Counter WHERE counter_id=? AND service_name=?";
        const counter = await new Promise((resolve,reject) => {
            db.run(sqlQuery2,[counter_id,service_name],(err) => {
                if(err){
                    reject(err);
                } else{
                    resolve({
                        counter_id,
                        service_name
                    });
                }
            })
        })
        return counter;
    }

    //Services by counter_id
    async getServicesByCounter(counter_id){
        const sqlQuery3 = "SELECT service_name FROM Counter WHERE counter_id=?";
        const services = await new Promise((resolve,reject) =>{
            db.all(sqlQuery3,[counter_id],(err,rows) => {
                if(err){
                    reject(err);
                } else{
                    const serviceNames = rows.map(row => row.service_name);
                    resolve(serviceNames);                   
                }
            })
        })
        return services;
    }

    async getCountersByService(service_name){
        const sqlQuery4 = "SELECT counter_id FROM Counter WHERE service_name = ?";
        const counters = await new Promise((resolve,reject) =>{
            db.all(sqlQuery4,[service_name],(err,rows) => {
                if(err){
                    reject(err);
                } else{
                    const counterIds = rows.map(row => row.counter_id);
                    resolve(counterIds);
                }
            })
        })
        return counters;
    }
}



//TEST
//const counterDAOInstance = new CounterDAO();

/*
counterDAOInstance.addService(1, 'PuzzoSiderurgico').then(result => {
    console.log(result);
}).catch(err => {
    console.error(err);
});
*/


/*
async function testGetServices() {
    try {
        const services = await counterDAOInstance.getServicesByCounter(1);
        console.log(services);  // Questo mostrerà i servizi restituiti
    } catch (err) {
        console.error(err);  // Gestione degli errori
    }
}

testGetServices();
*/

/*

async function testGetCountersByService() {
    const counterDAOInstance = new CounterDAO(); // Assicurati che CounterDAO sia definito

    try {
        const service_name = 'Inquiry';  // Sostituisci con un nome di servizio valido
        const counters = await counterDAOInstance.getCountersByService(service_name);
        console.log(`Counters per il servizio '${service_name}':`, counters);  // Mostra i counter_id
    } catch (err) {
        console.error('Errore durante il recupero dei counters:', err);
    }
}

testGetCountersByService();  
*/


export default CounterDAO;
