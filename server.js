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

app.post("/connect", (req, res) => {
  const { host, port, username, password, url } = req.body;
  connectUbiquiti(host, port, username, password, url);
  res.send("Connection attempt started");
});

app.listen(port, () => {
  console.log(`Server listening at https://chipped-sophisticated-grey.glitch.me`);
});