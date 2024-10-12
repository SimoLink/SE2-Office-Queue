// imports
import './db.mjs'
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import TicketDAO from './ticket-dao.mjs';
import ServicesDAO from './services-dao.mjs'


// init express
const app = new express();
const port = 3001;

const ticketDao = new TicketDAO();
const servicesDao = new ServicesDAO();
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