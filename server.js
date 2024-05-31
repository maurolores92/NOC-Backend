const express = require("express");
const cors = require("cors");
const pingIp = require('./src/ping'); // Asegúrate de que la ruta sea correcta
const connectUbiquiti = require('./src/connect'); // Asegúrate de que la ruta sea correcta
const app = express();

app.use(cors());
app.use(express.json());

// Usa el puerto que Glitch proporciona, o 3000 si no se proporciona ninguno
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/ping/:ip", pingIp);

app.post("/connect", async (req, res) => {
  const { ip, port, username, password, url } = req.body;
  try {
    await connectUbiquiti(ip, port, username, password, url);
    res.send("Connection attempt started");
  } catch (error) {
    console.error('Error connecting to Ubiquiti antenna:', error);
    res.status(500).send('Error connecting to Ubiquiti antenna');
  }
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  // Conéctate a la antena Ubiquiti al iniciar el servidor
  try {
    const isConnected = await connectUbiquiti('186.22.18.100');
    if (isConnected) {
      console.log('Connected successfully to Ubiquiti antenna');
    } else {
      console.log('Failed to connect to Ubiquiti antenna');
    }
  } catch (error) {
    console.error('Failed to connect to Ubiquiti antenna:', error.message);
  }
});