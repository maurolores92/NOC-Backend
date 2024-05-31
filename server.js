const express = require("express");
const cors = require("cors");
const connectUbiquiti = require('./src/connect'); // Asegúrate de que la ruta sea correcta
const app = express();

app.use(cors());
app.use(express.json());

// Usa el puerto que Glitch proporciona, o 3000 si no se proporciona ninguno
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/connect", async (req, res) => {
  const { ip, username, password } = req.body;
  try {
    const isConnected = await connectUbiquiti(ip, username, password);
    if (isConnected) {
      res.send('Connected successfully to Ubiquiti antenna');
    } else {
      res.send('Failed to connect to Ubiquiti antenna');
    }
  } catch (error) {
    console.error('Error connecting to Ubiquiti antenna:', error);
    res.status(500).send('Error connecting to Ubiquiti antenna');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});