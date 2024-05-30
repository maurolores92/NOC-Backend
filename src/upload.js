const express = require('express');
const SFTPClient = require('ssh2-sftp-client');
const { google } = require('googleapis');
const drive = google.drive('v3');
const key = require('./path-to-your-service-account-key.json');
const fs = require('fs');
const router = express.Router();

const remoteFilePath = '/path-on-ubiquiti-device'; // Reemplaza esto con la ruta donde quieres que se guarde el archivo en el dispositivo Ubiquiti

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/drive'],
  null
);

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

    jwtClient.authorize(async (err, tokens) => {
      if (err) {
        console.log(err);
        return;
      }

      google.options({ auth: jwtClient });

      const fileId = 'your-file-id';
      const localFilePath = '/path/to/your/destination/file';
      const dest = fs.createWriteStream(localFilePath);

      drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' },
        (err, res) => {
          res.data
            .on('end', async () => {
              console.log('Done downloading file from Google Drive.');
              await sftp.put(localFilePath, remoteFilePath);
              sftp.end();
              res.status(200).send('File uploaded successfully.');
            })
            .on('error', err => {
              console.error('Error downloading file.');
              res.status(500).send('Error uploading file.');
            })
            .pipe(dest);
        }
      );
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  }
});

module.exports = router;