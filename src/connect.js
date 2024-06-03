const { Client } = require("ssh2");

let conn = new Client();
conn.connected = false;

const connectUbiquiti = (
  host,
  username,
  password,
  port
) => {
  return new Promise((resolve, reject) => {
    if (conn.connected) {
      conn.end();
      conn.connected = false;
    }

    conn
      .on("ready", () => {
        console.log("Connected successfully to Ubiquiti antenna");
        conn.connected = true;
        resolve("Connected successfully");
      })
      .on("error", (error) => {
        console.error(
          "Failed to connect to Ubiquiti antenna:",
          error.message
        );
        conn.connected = false;
        reject(error);
      })
      .connect({
        host,
        port, // Utiliza el puerto que se pasa a la función
        username,
        password,
      });
  });
};

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    if (!conn.connected) {
      reject("Not connected");
    } else {
      conn.exec(command, (err, stream) => {
        if (err) {
          reject(err);
        } else {
          let output = "";
          stream
            .on("data", (data) => (output += data.toString()))
            .on("end", () => resolve(output));
        }
      });
    }
  });
};

const getInfo = () => execCommand("mca-status");

const rebootAntenna = () => { return execCommand("reboot").finally(() => {conn.end(); conn.connected = false});};

const downloadFile = () => execCommand('wget -o /dev/null http://sawerin.com.ar/IPCam.apk');

const getDhcpLeases = () => execCommand('cat /tmp/dhcpd.leases');

const getSystemConfig = () => execCommand('cat /tmp/system.cfg');

module.exports = { connectUbiquiti, getInfo, downloadFile, rebootAntenna, getDhcpLeases, getSystemConfig };
