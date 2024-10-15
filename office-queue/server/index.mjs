// imports
import './db.mjs'
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import TicketDAO from './ticket-dao.mjs';
import ServicesDAO from './services-dao.mjs'
import StatsDAO from './stats-dao.mjs';
import evaluateWaitingTime from './util.mjs';

// init express
const app = new express();
const port = 3001;

const ticketDao = new TicketDAO();
const servicesDao = new ServicesDAO();
const statsDao = new StatsDAO();

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
    .then(services => res.json(services))
    .catch(err => res.status(500));
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
    then(newTicket => res.status(201).json({
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

// GET endpoint to view how many customers each counter has served, further divided by service type.
app.get('/api/statsCounter/:period/:date', (req, res) => {
  const period = req.params.period;
  const date = req.params.date;

  const counterIds = req.query.counter_id ? req.query.counter_id.split(',').map(Number) : [];

  const serviceNames = req.query.service_name ? req.query.service_name.split(',') : [];

  statsDao.getCounterServiceStats(period, date, counterIds, serviceNames)
    .then(result => {
      if (result !== undefined && result.length > 0) {
        console.log(result);
        return res.status(200).json({
          message: `Stats per ${period} successfully fetched`,
          data: result
        });
      } else {
        return res.status(200).json({
          message: 'No stats',
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

// create evaluateWaitingTime API
app.get('/api/evaluateWaitingTime/:service', async (req, res) => {
  const service_name = req.params.service;

  try {
    const service_time = await servicesDao.getServiceTime(service_name);
    const ticket_number = await servicesDao.getNumberInQueue(service_name);

    if (ticket_number !== 0) {
      const counter_number = await servicesDao.getCounterForService(service_name);
      const ki = await servicesDao.getKi(service_name);

      // Calcola il tempo di attesa per il servizio corrente
      let time = evaluateWaitingTime(service_time, ticket_number, ki, 1, counter_number);

      console.log(`Tempo di attesa per ${service_name}:`, time);

      if (time !== undefined) {
        return res.status(200).json({
          message: `Waiting time estimated: ${time} minutes, customers in queue: ${ticket_number}.`,
        });
      } else {
        return Error;
      }

    } else {
      return res.status(200).json({
        message: `Waiting time estimated: 0 minutes, customers in queue: ${ticket_number}.`,
      });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Error while evaluating waiting time',
      details: err,
    });
  }


});