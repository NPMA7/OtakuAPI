import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import router from "./routes/routes.js";
import validateApiKey from "./middleware/validateApiKey.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4444;

// Configure CORS to allow all origins
const corsOptions = {
  origin: '*', // Ganti dengan domain aplikasi Anda
  optionsSuccessStatus: 200
};


app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(validateApiKey);
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
