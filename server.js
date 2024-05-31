const express = require("express");
const cors = require("cors");
const { connectUbiquiti, getInfo, downloadFile } = require('./src/connect'); // Asegúrate de que la ruta sea correcta
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

app.get('/info', async (req, res) => {
  try {
    const message = await getInfo();
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/download', async (req, res) => {
  try {
    const output = await downloadFile();
    res.send(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});