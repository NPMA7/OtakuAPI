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
const imagesDir = path.join("/tmp", "images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/view/index.html')); 
});

router.get("/images/anime/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(imagesDir, filename);

  if (fs.existsSync(filepath)) {
    res.sendFile(filepath, { root: '/' });
  } else {
    res.status(404).send({ error: "Image not found" });
  }
});

router.post('/invalid', (req, res) => {
  const { apiKey } = req.body;

  if (apiKey === process.env.API_KEY) {
    res.cookie('apiKey', apiKey, { maxAge: 360000, httpOnly: true }); // Cookie valid for 1 hour
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


router.use(routerAnime);

export default router;
