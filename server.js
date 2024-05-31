const express = require("express");
const cors = require("cors");
const { connectUbiquiti, getInfo, downloadFile, rebootAntenna } = require('./src/connect'); // Asegúrate de que la ruta sea correcta
const app = express();
const pingIp = require('./src/ping'); // Asegúrate de que la ruta sea correcta

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/ping/:ip", pingIp);

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.post('/connect', async (req, res) => {
  const ip = req.body.ip;
  if (typeof ip !== 'string') {
    res.status(400).json({ error: 'Invalid IP address' });
    return;
  }
  try {
    const data = await connectUbiquiti(ip);
    res.json({ message: data });
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
    const fileData = await downloadFile();
    res.json({ message: fileData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/reboot', async (req, res) => {
  try {
    const output = await rebootAntenna();
    res.json({ message: output });
  } catch (error) {
    console.error('Error rebooting antenna:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});