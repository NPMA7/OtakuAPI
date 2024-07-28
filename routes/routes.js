// routes/routes.js
import express from 'express';
import path from 'path';
import validateApiKey from '../middleware/validateApiKey.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routerAnime from './routesAnime.js';

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
  res.send({ status: 'OK', 
    message: ['This scraper API is currently under development.',
              'please input the ready endpoint'
    ],
    endpoint: [
      "anime   : /anime",
      "donghua : /donghua"
      ],
   });
});
router.get('/images/:link', (req, res) => {
  const { link } = req.params; // Correctly access the link parameter
  const filePath = path.join(__dirname, '/public/images', link); // Ensure the path is correct and matches your folder structure

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Failed to send file: ${filePath}`, err);
      res.status(404).send('File not found');
    }
  });
});

router.use(routerAnime);

export default router;
