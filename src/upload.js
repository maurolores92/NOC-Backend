const express = require('express');
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const app = express();

app.use(express.json()); // Para poder parsear el cuerpo de las solicitudes HTTP en formato JSON

app.post('/upload', async (req, res) => {
  const host = req.body.ip; // Obtiene la IP desde el cuerpo de la solicitud HTTP

  const config = {
    host: host,
    port: '8888',
    username: 'nortech',
    password: 'Nor3164!'
  };

  const remotePathToList = '/';
  const localFilePath = './file.txt';

  try {
    await sftp.connect(config);
    await sftp.put(localFilePath, remotePathToList);
    let list = await sftp.list(remotePathToList);
    console.log(list);
    await sftp.end();

    res.status(200).send('File uploaded successfully.'); // Envía una respuesta de éxito al frontend
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Failed to upload file.'); // Envía una respuesta de error al frontend
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000.');
});