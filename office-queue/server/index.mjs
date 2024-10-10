// imports
import './db.mjs'
import { getTicket } from './ticket-dao.mjs';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';



// init express
const app = new express();
const port = 3001;

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