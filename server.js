const express = require('express');
const ping = require('ping');
const cors = require('cors');
const app = express();

app.use(cors());

// Usa el puerto que Glitch proporciona, o 3000 si no se proporciona ninguno
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/ping/:ip', async (req, res) => {
  const { ip } = req.params;

  try {
    const result = await ping.promise.probe(ip);
    res.json(result);
  } catch (error) {
    console.error('Error pinging:', error);
    res.status(500).json({ error: 'Error pinging the IP address', details: error });
  }
});

app.listen(port, () => {
  // Registra la URL de tu servidor en Glitch
  console.log(`Server listening at https://<nombre-de-tu-proyecto>.glitch.me`);
});