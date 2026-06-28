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
app.post('/webhook', async (req, res) => {
  const from = req.body.From;
  const msg = req.body.Body?.trim().toLowerCase();
  const twiml = new MessagingResponse();

  if (!userState[from]) userState[from] = { paso: 'menu' };

  // Lógica del bot

  //
  if (msg === 'hola') { // <- Ponelo primero siempre
  userState[from] = { paso: 'menu' }; // Reset
  twiml.message('Hola 👋 Angelito del Fuego\nElegí:\n1. Corte\n2. Color\n3. Ver mis turnos');
  userState[from].paso = 'servicio';
  } 
  else if (userState[from].paso === 'servicio') {
    if (msg === '1') {
      twiml.message('Elegiste Corte ✂️. Próximo paso: elijo fecha.');
      userState[from].servicio = 'Corte';
      // Acá después llamamos a calendar.events.list para ver huecos
    } else if (msg === '2') {
      twiml.message('Elegiste Color 🎨. Próximo paso: elijo fecha.');
      userState[from].servicio = 'Color';
    } else if (msg === '3') {
      twiml.message('Buscando tus turnos... Próximamente.');
    } else {
      twiml.message('Opción inválida. Mandá: 1, 2 o 3');
    }
  } 
  else {
    twiml.message('Mandá "hola" para empezar 👋');
  }
  
  res.type('text/xml').send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot develop en ${PORT}`));