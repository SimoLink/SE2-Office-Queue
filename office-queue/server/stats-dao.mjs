import { db } from "./db.mjs";
import dayjs from 'dayjs'; 

export class StatsDAO {

  async getCounterServiceStats(period, date, counterIds = [], serviceNames = []) {
    return new Promise((resolve, reject) => {
      let sqlQuery;
      let params = [date]; 

      switch (period) {
        case 'day':
          sqlQuery = `
            SELECT counter_id, service_name, COUNT(*) AS total_served
            FROM HistoryTickets
            WHERE ticket_status = 'served'
            AND DATE(issued_time) = ?
          `;
          break;

        case 'week':
          const endDate = dayjs(date).add(6, 'day').format('YYYY-MM-DD');
          
          sqlQuery = `
            SELECT counter_id, service_name, COUNT(*) AS total_served
            FROM HistoryTickets
            WHERE ticket_status = 'served'
            AND DATE(issued_time) BETWEEN ? AND ?
          `;
          params = [date, endDate];  
          break;

          case 'month':
            const monthDate = dayjs(date).format('YYYY-MM');  // Format the date as 'YYYY-MM'
            sqlQuery = `
              SELECT counter_id, service_name, COUNT(*) AS total_served
              FROM HistoryTickets
              WHERE ticket_status = 'served'
              AND strftime('%Y-%m', issued_time) = ?
            `;
            params = [monthDate];  // Pass the formatted month date
            break;
  

        default:
          throw new Error('Invalid period specified');
      }

      if (counterIds.length > 0) {
        const counterPlaceholders = counterIds.map(() => '?').join(', ');
        sqlQuery += ` AND counter_id IN (${counterPlaceholders})`;
        params = [...params, ...counterIds];  
      }

      if (serviceNames.length > 0) {
        const servicePlaceholders = serviceNames.map(() => '?').join(', ');
        sqlQuery += ` AND service_name IN (${servicePlaceholders})`;
        params = [...params, ...serviceNames];  
      }

      sqlQuery += ` GROUP BY counter_id, service_name`;

      db.all(sqlQuery, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          console.log(`Statistiche per  ${counterIds} ${period} ${date}:`, rows);
          resolve(rows);
        }
      });
    });
  }
}

export default StatsDAO;