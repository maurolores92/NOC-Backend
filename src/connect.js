const { Client } = require('ssh2');

const connectUbiquiti = (host, username = "nortech", password = "Nor3164!", port = 8889, ) => {
  const conn = new Client();
  conn.on('ready', () => {
    console.log('Connected successfully to Ubiquiti antenna');
    conn.end();
  }).on('error', (error) => {
    console.error("Failed to connect to Ubiquiti antenna:", error.message);
  }).connect({
    host,
    port,
    username,
    password,
  });
};

module.exports = connectUbiquiti;