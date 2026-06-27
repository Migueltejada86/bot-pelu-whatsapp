import 'dotenv/config';
import express from 'express';
import twilio from 'twilio'; // <- Import normal arriba
import { google } from 'googleapis';

const app = express();
app.use(express.urlencoded({ extended: false }));
const MessagingResponse = twilio.twiml.MessagingResponse; // <- Acá lo sacás

// 1. Auth Google Calendar
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_CREDENTIALS_PATH,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});
const calendar = google.calendar({ version: 'v3', auth });

let userState = {};

app.post('/webhook', async (req, res) => {
  const from = req.body.From;
  const msg = req.body.Body?.trim().toLowerCase();
  const twiml = new MessagingResponse(); // <- Sin await

  if (!userState[from]) userState[from] = { paso: 'menu' };

  if (userState[from].paso === 'menu') {
    twiml.message('Hola 👋 Angelito del Fuego\nElegí:\n1. Corte\n2. Color\n3. Ver mis turnos');
    userState[from].paso = 'servicio';
  } else {
    twiml.message('Bot en develop OK. Ya fixee el crash.');
  }
  
  res.type('text/xml').send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot develop en ${PORT}`));


#
import 'dotenv/config';
import express from 'express';
import twilio from 'twilio'; // <- Import normal arriba
import { google } from 'googleapis';

const app = express();
app.use(express.urlencoded({ extended: false }));
const MessagingResponse = twilio.twiml.MessagingResponse; // <- Acá lo sacás

// 1. Auth Google Calendar
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_CREDENTIALS_PATH,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});
const calendar = google.calendar({ version: 'v3', auth });

let userState = {};

app.post('/webhook', async (req, res) => {
  const from = req.body.From;
  const msg = req.body.Body?.trim().toLowerCase();
  const twiml = new MessagingResponse(); // <- Sin await

  if (!userState[from]) userState[from] = { paso: 'menu' };

  if (userState[from].paso === 'menu') {
    twiml.message('Hola 👋 Angelito del Fuego\nElegí:\n1. Corte\n2. Color\n3. Ver mis turnos');
    userState[from].paso = 'servicio';
  } else {
    twiml.message('Bot en develop OK. Ya fixee el crash.');
  }
  
  res.type('text/xml').send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot develop en ${PORT}`));