const express = require('express');
const SFTPClient = require('ssh2-sftp-client');
const router = express.Router();

const localFilePath = './path-to-your-file'; // Reemplaza esto con la ruta al archivo que quieres enviar
const remoteFilePath = '/path-on-ubiquiti-device'; // Reemplaza esto con la ruta donde quieres que se guarde el archivo en el dispositivo Ubiquiti

router.post('/', async (req, res) => {
  const { ip } = req.body;

  const sftp = new SFTPClient();

  const username = 'nortech'; // Usuario
  const password = 'Nor3164!'; // Contraseña

  try {
    await sftp.connect({
      host: ip,
      username: username,
      password: password
    });

    await sftp.put(localFilePath, remoteFilePath);

    sftp.end();

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  }
});

module.exports = router;