// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Ruta para manejar solicitudes y obtener la IP del cliente
app.get('/ip', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.json({ ip: clientIp });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
