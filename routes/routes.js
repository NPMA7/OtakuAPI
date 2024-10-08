// routes/routes.js
import express from 'express';
import path from 'path';
import validateApiKey from '../middleware/validateApiKey.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routerAnime from './routesAnime.js';
import routerDonghua from './routesDonghua.js';
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
const __dirname = path.resolve();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html')); 
});

router.post('/set-api-key', (req, res) => {
  const { apiKey } = req.body;

  if (apiKey === process.env.API_KEY) {
    res.cookie('apiKey', apiKey, { maxAge: 360000, httpOnly: true }); // Cookie berlaku selama 1 jam
    res.redirect('/v1'); 
  } else {
    res.status(401).send({ error: 'Invalid API key' });
  }
});

router.get('/v1', validateApiKey, (req, res) => {
  res.send({ 
    status: 'OK', 
    message: ['This scraper API is currently under development.',
              'please input the ready endpoint'],
    endpoint: [
      "anime   : /anime",
      "donghua : /donghua"
    ],
  });
});

router.use(routerDonghua);
router.use(routerAnime);

export default router;
