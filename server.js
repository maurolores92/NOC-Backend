const express = require("express");
const cors = require("cors");
const connectUbiquiti = require('./src/connect'); // Asegúrate de que la ruta sea correcta
const app = express();
const pingIp = require('./src/ping'); // Asegúrate de que la ruta sea correcta

app.use(cors());
app.use(express.json());

// Usa el puerto que Glitch proporciona, o 3000 si no se proporciona ninguno
const port = process.env.PORT || 3000;

app.get("/ping/:ip", pingIp);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post('/connect', async (req, res) => {
  try {
    const data = await connectUbiquiti(req.body.ip);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});