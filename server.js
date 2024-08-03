// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Configura el rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Ruta para manejar solicitudes y obtener la IP del cliente
app.get('/ip', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geo = geoip.lookup(clientIp);
  res.json({ ip: clientIp, geo });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
