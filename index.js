import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fs from "fs"; // Import fs module
import path from "path"; // Import path module
import router from "./routes/routes.js";
import validateApiKey from "./middleware/validateApiKey.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4444; // Use dynamic port for hosting environments

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(validateApiKey);

// Define images directory path for temporary storage
const imagesDir = path.join("/tmp", "images");

// Ensure the images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Endpoint to serve images
app.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(imagesDir, filename);

  // Check if the image exists
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath, { root: '/' });
  } else {
    res.status(404).send({ error: "Image not found" });
  }
});

app.use(router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
