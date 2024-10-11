import { db } from "./db.mjs";


export const getTicket = async(service_name) => {
    const sqlQuery1= 'SELECT * FROM Services WHERE service_name= ?';

    //i check if the service is given by the office

     const service = await new Promise((resolve,reject) => {
        db.get(sqlQuery1,[service_name],(err,service) =>{
            if (!service){
                const err= "Service not found";
                reject(err);
            }
            else if (err){
                reject(err);
            }
            else{
                resolve(service);
            }
        });
    });
};