const { Client } = require('ssh2');

let conn = new Client();

const connectUbiquiti = (host , username = "nortech", password = "Nor3164!", port = 8889) => {
  
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      console.log('Connected successfully to Ubiquiti antenna');
      resolve('Connected successfully');
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

const getInfo = () => {
  return new Promise((resolve, reject) => {
    if (conn) {
      conn.exec('mca-status', (err, stream) => {
        if (err) {
          reject(err);
        } else {
          let output = '';
          stream.on('data', data => output += data.toString())
                .on('end', () => resolve(output));
        }
      });
    } else {
      reject('Not connected');
    }
  });
};

const downloadFile = () => {
  const url = 'http://sawerin.com.ar/IPCam.apk';

  return new Promise((resolve, reject) => {
    if (conn) {
      conn.exec(`wget -O /dev/null ${url}`, (err, stream) => {
        if (err) {
          reject(err);
        } else {
          let output = '';
          stream.on('data', data => output += data.toString())
                .on('end', () => resolve(output));
        }
      });
    } else {
      reject('Not connected');
    }
  });
};

module.exports = { connectUbiquiti, getInfo };