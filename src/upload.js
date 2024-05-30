const express = require("express");
const Client = require("ssh2-sftp-client");
const sftp = new Client();
const router = express.Router(); // Crea un router Express en lugar de un servidor Express

router.use(express.json()); // Para poder parsear el cuerpo de las solicitudes HTTP en formato JSON

router.post("/upload", async (req, res) => {
  const { ip: host, port, username, password } = req.body; // Obtiene la IP, el puerto, el nombre de usuario y la contraseña desde el cuerpo de la solicitud HTTP

  console.log(`Host: ${host}, Port: ${port}, Username: ${username}, Password: ${password}`); // Imprime los datos recibidos en la consola

  const config = {
    host,
    port,
    username,
    password,
  };

  const remotePathToList = "/";
  const localFilePath = "./file.txt";

  try {
    await sftp.connect(config);
    await sftp.put(localFilePath, remotePathToList);
    let list = await sftp.list(remotePathToList);
    console.log(list);
    await sftp.end();

    res.status(200).send("File uploaded successfully."); // Envía una respuesta de éxito al frontend
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Failed to upload file."); // Envía una respuesta de error al frontend
  }
});

module.exports = router; // Exporta el router en lugar de iniciar un servidor