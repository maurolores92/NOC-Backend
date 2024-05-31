const { Client } = require('ssh2');

const connectUbiquiti = (host , username = "nortech", password = "Nor3164!", port = 8889) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Connected successfully to Ubiquiti antenna');

      conn.shell((err, stream) => {
        if (err) reject(err);

        let output = '';

        stream.on('close', () => {
          console.log('Session closed');
          conn.end();
          resolve(output);
        }).on('data', (data) => {
          output += data;
        }).stderr.on('data', (data) => {
          console.log('STDERR: ' + data);
        });

        // Ejecuta el comando mca-status
          stream.write('mca-status\n');
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