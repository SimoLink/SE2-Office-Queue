// imports
import './db.mjs'
//import { TicketDAO } from './ticket-dao.mjs';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import ServicesDAO from './services-dao.mjs'
import CounterDAO from './counter-dao.mjs';

import TicketDAO from './ticket-dao.mjs';

import ServicesDAO from './services-dao.mjs'
import CounterDAO from './counter-dao.mjs'


// init express
const app = new express();
const port = 3001;
const counters_N=5;
const ticketDao = new TicketDAO();
const servicesDao = new ServicesDAO();
const counterDao = new CounterDAO();

app.use(express.json());
app.use(morgan('dev'));

// Configurazione CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// GET endpoint to fetch the list of available services
app.get('/api/services', (req, res) => {

   servicesDao.getServices()
   .then(services =>  res.json(services))
   .catch (err => res.status(500));
})

// POST endpoint to create a new ticket for a specific service
app.post('/api/historyTickets/create', (req, res) => {
  const { service_name } = req.body;

  // Validate the input
  if (!service_name) {
      return res.status(400).json({ message: 'Service name is required' });
  }

  // Call the DAO function to create a new ticket and respost with ticket

  ticketDao.createTicket(service_name).
  then(newTicket =>  res.status(201).json({
    message: 'Ticket created successfully',
    ticket: newTicket
  })).catch((err) => res.status(500).json(err));

 
});

// GET endpoint to call the next customer in queue
app.get('/api/nextCustomer/:counterId', (req, res) => {

  const counterId = parseInt(req.params.counterId);

  ticketDao.nextCustomer(counterId)
    .then(result => {
      if (result !== undefined) {
        console.log(result);
        return res.status(201).json({
          message: `Next customer with ticket id ${result} successfully called`,
          data: result
        });
      } else {        
        return res.status(200).json({
          message: 'Zero customers in queue.',
        });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: 'Error while processing the request',
        details: err
      });
    });
});


//-------------------------------

// POST endpoint to assign a service to a counter
app.post('/api/counters/add', (req, res) => {
  const { counter_id, service_id } = req.body;

  if (!counter_id || !service_id) {
      return res.status(400).json({ message: 'Counter ID and Service ID are required' });
  }

  counterDao.addService(counter_id, service_id) //TO DO - CORRECT DAO NAMES
  .then(result => res.json(result))
  .catch(err => res.status(500).json({ message: 'Error assigning service to counter', error: err.message }));
  });


// DELETE endpoint to remove a service from a counter
app.delete('/api/counters/delete', (req, res) => {
  const { counter_id, service_id } = req.body;

  if (!counter_id || !service_id) {
      return res.status(400).json({ message: 'Counter ID and Service ID are required' });
  }

  counterDao.removeService(counter_id, service_id).then(result => res.json(result))
  .catch(err => res.status(500).json({ message: 'Error removing service from counter', error: err.message }));
   
  
});

// GET endpoint to get services by counter ID
app.get('/api/counters/:counter_id/services', (req, res) => {
  const counter_id = parseInt(req.params.counter_id);

  if (!counter_id) {
      return res.status(400).json({ message: 'Invalid counter ID' });
  }
  counterDao.getServicesByCounter(counter_id).then(services => res.json(services))
  .catch(err => res.status(500).json({ message: 'Error fetching services for counter', error: err.message }));

});

// GET endpoint to get counters by service ID
app.get('/api/services/:service_id/counters', (req, res) => {
  const service_id = parseInt(req.params.service_id);

  if (!service_id) {
      return res.status(400).json({ message: 'Invalid service ID' });
  }
  counterDao.getCountersByService(service_id).then(counters => res.json(counters))
  .catch(err => res.status(500).json({ message:'Error fetching counters for service', error: err.message }));

});

// GET endpoint to get the total number of counters
app.get('/api/counters/number', (req, res) => {
 
      res.json({ counters_N });
 
});