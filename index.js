// server.js
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import router from './routes/api.js';
dotenv.config();

const app = express();
const port = process.env.PORT ?? 4444;

app.use(cors());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
