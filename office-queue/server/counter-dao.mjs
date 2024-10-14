import { db } from "./db.mjs";

export class CounterDAO {
    async addService(counter_id,service_name) {
        const sqlQuery1 = 'INSERT INTO Counter (counter_id, service_name) VALUES (?, ?)';
        // Potrei implementare un controllo su service_name qui, se necessario

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
}

/*

//TEST
const counterDAOInstance = new CounterDAO();

counterDAOInstance.removeService(1, 'Shipping').then(result => {
    console.log(result);
}).catch(err => {
    console.error(err);
});
*/

export default CounterDAO;
