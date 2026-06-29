import 'dotenv/config';
import express from 'express';
import twilio from 'twilio';
import { google } from 'googleapis';

const app = express();
app.use(express.urlencoded({ extended: false }));

const MessagingResponse = twilio.twiml.MessagingResponse; // <- Forma correcta sin await

// 1. Auth Google Calendar - Ya preparado
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_CREDENTIALS_PATH, // Ej: /app/credentials.json
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});
const calendar = google.calendar({ version: 'v3', auth });

let userState = {}; // Memoria simple por número de WhatsApp

// 2. Ruta GET / para que no tire "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Bot Peluqueria Online ✅");
});

// 3. Webhook de Twilio WhatsApp
app.post('/webhook', (req, res) => { // <- Sin async
  try {
    console.log("LLEGÓ:", req.body.Body); 
    const from = req.body.From;
    const msg = req.body.Body?.trim().toLowerCase();
    const twiml = new MessagingResponse();

    if (msg === 'hola') {
      twiml.message('Hola 👋 Angelito del Fuego\n1. Corte\n2. Color\n3. Ver turnos');
    } else if (msg === '1') {
      twiml.message('Elegiste Corte ✂️');
    } else {
      twiml.message('Mandá "hola" para empezar'); // <- Siempre responde algo
    }
    
    res.set('Content-Type', 'application/xml'); // <- Clave
    res.send(twiml.toString()); // <- Clave
  } catch (e) {
    console.error(e);
    const twiml = new MessagingResponse();
    twiml.message('Error. Intentá de nuevo.');
    res.set('Content-Type', 'application/xml');
    res.send(twiml.toString());
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot develop en ${PORT}`));