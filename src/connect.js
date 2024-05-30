const { Client } = require('ssh2');

const connectUbiquiti = () => {
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
};

module.exports = connectUbiquiti;