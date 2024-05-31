const fs = require('fs');
const { Client } = require('ssh2');

const connectUbiquiti = (host, username = "nortech", password = "Nor3164!", port = 8889, filePath = 'IPCam.js') => {
  const conn = new Client();

  conn.on('ready', () => {
    console.log('Connected successfully to Ubiquiti antenna');

    conn.sftp((err, sftp) => {
      if (err) throw err;

      const readStream = fs.createReadStream(filePath);
      const writeStream = sftp.createWriteStream('/remote/path/to/file');

      writeStream.on('close', () => {
        console.log('File transferred succesfully');
        conn.end();
      });

      writeStream.on('end', () => {
        console.log('SFTP session closed');
        conn.end();
      });

      readStream.pipe(writeStream);
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