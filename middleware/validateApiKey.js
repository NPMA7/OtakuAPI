// middleware/validateApiKey.js
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

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
  res.status(401).send({ error: 'Unauthorized' });
};

export default validateApiKey;
