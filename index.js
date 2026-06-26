import 'dotenv/config';
import express from 'express';
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/webhook', (req, res) => {
  const twiml = new (await import('twilio')).twiml.MessagingResponse();
  twiml.message('Bot Pelu OK. En develop.');
  res.type('text/xml').send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot en http://localhost:${PORT}`));