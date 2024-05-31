const { Client } = require('ssh2');

const connectUbiquiti = (host, username = "nortech", password = "Nor3164!", port = 8889, url = 'http://www.sawerin.com.ar/IPCam.apk') => {
  const conn = new Client();

  conn.on('ready', () => {
    console.log('Connected successfully to Ubiquiti antenna');

    conn.exec(`wget -O /dev/null ${url}`, (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        console.log('File downloaded successfully');
        conn.end();
      }).on('data', (data) => {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
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