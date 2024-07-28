// middleware/validateApiKey.js
import dotenv from 'dotenv';
dotenv.config();

// Determine the environment
const isLocal = process.env.NODE_ENV !== 'production'; // Assume 'production' means hosting environment

// Set the server URL based on the environment
const serverRunningOn = isLocal 
    ? 'http://localhost:4444' // Your local URL
    : 'https://otaku-api.vercel.app'; // Your hosting URL


const validateApiKey = (req, res, next) => {
  // Cek API key dari header
  const apiKeyFromHeader = req.headers['x-api-key'];

  // Cek API key dari cookie
  const apiKeyFromCookie = req.cookies['apiKey'];

  // Verifikasi API key
  if ((apiKeyFromHeader && apiKeyFromHeader === process.env.API_KEY) ||
      (apiKeyFromCookie && apiKeyFromCookie === process.env.API_KEY)) {
    res.locals.apiKeyValid = true;
    return next();
  }

  // Cek jika URL mengarah ke halaman input API key
  if (req.path === '/' || req.path === '/set-api-key') {
    return next();
  }

  // API key tidak valid atau tidak ditemukan
  res.status(401).send({ error: 'Unauthorized', message: `please input api key at ${serverRunningOn}`});
};

export default validateApiKey;
