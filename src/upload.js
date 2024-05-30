const express = require("express");
const Client = require("ssh2-sftp-client");
const sftp = new Client();
const router = express.Router();

router.use(express.json());

router.post("/upload", async (req, res) => {
  const config = {
    host: "186.1.242.50",
    port: 8889,
    username: "nortech",
    password: "Nor3164!",
  };

  try {
    await sftp.connect(config);
    console.log("Connected successfully");
    await sftp.end();
    res.status(200).send("Connected successfully");
  } catch (error) {
    console.error("Failed to connect:", error.message);
    res.status(500).send("Failed to connect");
  }
});

module.exports = router;