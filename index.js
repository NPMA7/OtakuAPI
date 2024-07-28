import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import router from "./routes/routes.js";
import validateApiKey from "./middleware/validateApiKey.js";
import path from 'path';
import fs from "fs";

dotenv.config();

const app = express();
const port = process.env.PORT || 4444;
const imagesDir = path.join("/tmp", "images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

app.use(cors());
app.get("/images/anime/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(imagesDir, filename);

  if (fs.existsSync(filepath)) {
    res.sendFile(filepath, { root: '/' });
  } else {
    res.status(404).send({ error: "Image not found" });
  }
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(validateApiKey);
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
