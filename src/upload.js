const Client = require('ssh2-sftp-client');
const sftp = new Client();

const config = {
  host: 'ip de tu antena ubiquiti', // Reemplaza esto con la IP de tu antena Ubiquiti
  port: '8888', // El puerto por defecto para SFTP es 22
  username: 'nortech', // Reemplaza esto con el nombre de usuario de tu antena Ubiquiti
  password: 'Nor3164!' // Reemplaza esto con la contraseña de tu antena Ubiquiti
};

const remotePathToList = 'ruta donde quieres subir el archivo en la antena'; // Reemplaza esto con la ruta donde quieres que se guarde el archivo en la antena Ubiquiti
const localFilePath = './file.txt'; // Reemplaza 'file.txt' con el nombre de tu archivo

async function main() {
  await sftp.connect(config);
  await sftp.put(localFilePath, remotePathToList);
  let list = await sftp.list(remotePathToList);
  console.log(list);
  await sftp.end();
}

main().catch((err) => {
  console.error(err.message);
});