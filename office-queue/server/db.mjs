import sqlite from 'sqlite3';

// apertura db
export const db = new sqlite.Database('officedb.db', (err) => {
  if (err) throw err;
});


db.serialize(() => {
  
  // Services Table
  db.run(`
    CREATE TABLE IF NOT EXISTS Services (
      service_name VARCHAR(100) PRIMARY KEY,
      service_time INT NOT NULL
    )
  `);
  
  // Counter Table
  db.run(`
    CREATE TABLE IF NOT EXISTS Counter (
      counter_id INT,
      service_name VARCHAR(100),
      PRIMARY KEY (counter_id, service_name),
      FOREIGN KEY (service_name) REFERENCES Services(service_name)
    )
  `);

  // Queue Table
  db.run(`
    CREATE TABLE IF NOT EXISTS Queue (
      ticket_id INTEGER PRIMARY KEY,
      queue_name VARCHAR(100), -- Links to service_name in Services
      FOREIGN KEY (queue_name) REFERENCES Services(service_name)
    )
  `);

  // History Tickets Table
  db.run(`
    CREATE TABLE IF NOT EXISTS HistoryTickets (
      ticket_id INTEGER PRIMARY KEY, -- Unique ticket ID
      service_name VARCHAR(100), -- Links to Services
      counter_id INT, -- Links to Counter
      issued_time TIMESTAMP, -- Time when the ticket was issued
      ticket_status VARCHAR(50), -- 'pending', 'served', etc.
      FOREIGN KEY (service_name) REFERENCES Services(service_name),
      FOREIGN KEY (counter_id) REFERENCES Counter(counter_id)
    )
  `);
});

