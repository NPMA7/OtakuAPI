import express from "express";
import dotenv from 'dotenv';
import ongoingAnime from "../src/anime/ongoing.js";

dotenv.config();

const routerAnime = express.Router();

routerAnime.get("/v1/anime", (req, res) =>
  res.send({
    status: "OK",
    message: "please input endpoint anime",
    endpoint: [
      "home, /v1/anime/home                      : check",
      "ongoing, /v1/anime/ongoing/:page          : check",
      "completed, /v1/anime/complete/:page       : check",
      "search, /v1/anime/search/:keyword         : check",
      "anime, /v1/anime/slug/:slug               : check",
      "episode, /v1/anime/episode/:slug          : check",
      "genres, /v1/anime/genres                  : check",
      "mapGenres, /v1/anime/genres/:slug/:page?  : check",
    ],
  })
);

routerAnime.get("/v1/anime/ongoing/:page?", async (req, res) => {
  const { page = 1 } = req.params;
  try {
    const data = await ongoingAnime({ page });
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.send({ error: "Failed to fetch data" });
  }
});

// Cron Job Endpoint
routerAnime.get("/v1/anime/cron-job", async (req, res) => {
  try {
    await ongoingAnime({ page: 1 });
    res.send({ status: "OK", message: "Anime check completed successfully." });
  } catch (error) {
    console.error("Error in cron job:", error);
    res.status(500).send({ error: "Failed to complete cron job task." });
  }
});

export default routerAnime;
