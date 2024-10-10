import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite3.Database('officedb.db'); // Modifica con il percorso al tuo database

// Funzione per generare un salt
const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Funzione per hashare la password
const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
};

// Funzione per inserire un nuovo utente nel database
const insertUser = async (email, name, password, role) => {
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  
  const sql = 'INSERT INTO user (email, name, hash, salt, role) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [email, name, hash, salt, role], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Un nuovo utente è stato inserito con l'id ${this.lastID}`);
  });
};

const email = 'davide';
const name = 'Davide Licitra';
const password = 'test';
const role = 'Officer'; 

const email1 = 'Paolo';
const name1 = 'Paolo Paolone';
const password1 = 'test';
const role1 = 'Manager'; 

insertUser(email, name, password, role); 
insertUser(email1, name1, password1, role1); 
