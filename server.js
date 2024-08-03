const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const geoip = require('geoip-lite');
const fs = require('fs');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura trust proxy para que confíe solo en ciertos proxies (por ejemplo, los de tu proveedor de hosting)
app.set('trust proxy', 'loopback, linklocal, uniquelocal');

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Configura el rate limit
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'm15tmny',
  keyGenerator: (req) => {
    return req.ip;
  }
});
app.use(limiter);

// Ruta para manejar solicitudes y obtener la IP del cliente
app.get('/', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geo = geoip.lookup(clientIp);
  res.json({ ip: clientIp, geo });
});

// Verifica si los certificados SSL existen
const keyPath = 'key.pem';
const certPath = 'cert.pem';

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
