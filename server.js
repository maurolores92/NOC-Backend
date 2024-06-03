const express = require("express");
const cors = require("cors");
const {
  connectUbiquiti,
  getInfo,
  downloadFile,
  rebootAntenna,
  getDhcpLeases,
  getSystemConfig
} = require("./src/connect");
const app = express();
const pingIp = require("./src/ping");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/ping/:ip", pingIp);

app.get("/", (req, res) => {
  res.json({ message: "Servidor Activo" });
});

app.post("/connect", async (req, res) => {
  const ip = req.body.ip;
  const port = req.body.port;
  const username = req.body.username;
  const password = req.body.password;
  
  if (typeof ip !== 'string' || typeof port !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Invalid IP address, port, username, or password' });
    return;
  }
  
  try {
    const data = await connectUbiquiti(ip, username, password, port);
    res.json({ message: data });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.get("/info", async (req, res) => {
  try {
    const message = await getInfo();
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/download", async (req, res) => {
  try {
    const fileData = await downloadFile();
    res.json({ message: fileData });
  } catch (error) {
    console.error("Error download file antenna:", error);
    res.status(500).json({ error: error.message });
  }
}); 

app.get("/reboot", async (req, res) => {
  try {
    const output = await rebootAntenna();
    res.json({ message: output });
  } catch (error) {
    console.error("Error rebooting antenna:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/dhcpLeases", async (req, res) => {
  try {
    const data = await getDhcpLeases();
    res.json({ message: data });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.get("/systemConfig", async (req, res) => {
  try {
    const data = await getSystemConfig();
    res.json({ message: data });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running and accessible on the network at http://0.0.0.0:${port}`);
});
