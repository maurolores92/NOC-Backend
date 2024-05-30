const express = require("express");
const ping = require("ping");
const cors = require("cors");
const { Client } = require('ssh2');
const app = express();

app.use(cors());
app.use(express.json());

// Usa el puerto que Glitch proporciona, o 3000 si no se proporciona ninguno
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/ping/:ip", async (req, res) => {
  const { ip } = req.params;

  try {
    const result = await ping.promise.probe(ip);
    res.json(result);
  } catch (error) {
    console.error("Error pinging:", error);
    res
      .status(500)
      .json({ error: "Error pinging the IP address", details: error });
  }
});

app.listen(port, async () => {
  // Registra la URL de tu servidor en Glitch
  console.log(
    `Server listening at https://chipped-sophisticated-grey.glitch.me`
  );

  // Conexión a la antena Ubiquiti
  const conn = new Client();
  conn.on('ready', () => {
    console.log('Connected successfully to Ubiquiti antenna');
    conn.end();
  }).on('error', (error) => {
    console.error("Failed to connect to Ubiquiti antenna:", error.message);
  }).connect({
    host: "186.1.242.50",
    port: 8889,
    username: "nortech",
    password: "Nor3164!",
  });
});