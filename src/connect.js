const { Client } = require('ssh2');

const connectUbiquiti = (host , username = "nortech", password = "Nor3164!", port = 8889) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Connected successfully to Ubiquiti antenna');
      conn.exec('mca-status', (err, stream) => {
        if (err) {
          reject(err);
        } else {
          let output = '';
          stream.on('data', data => output += data.toString())
                .on('end', () => resolve(output));
        }
      });
    }).on('error', (error) => {
      console.error("Failed to connect to Ubiquiti antenna:", error.message);
      reject(error);
    }).connect({
      host,
      port,
      username,
      password,
    });
  });
};

module.exports = connectUbiquiti;