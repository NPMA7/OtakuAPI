import express from "express";
import homeAnime from "../src/anime/home.js";
import ongoingAnime from "../src/anime/ongoing.js";
import completedAnime from "../src/anime/completed.js";
import searchAnime from "../src/anime/search.js";
import Anime from "../src/anime/anime.js";
import genresAnime from "../src/anime/genres.js";
import mapGenresAnime from "../src/anime/mapGenres.js";
import episodeAnime from "../src/anime/episode.js";
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
routerAnime.get("/v1/anime/home", async (req, res) => {
  try {
    const data = await homeAnime();
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.send({ error: "Failed to fetch data" });
  }
});

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

routerAnime.get("/v1/anime/complete/:page?", async (req, res) => {
  const { page = 1 } = req.params;
  try {
    const data = await completedAnime({ page });
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.send({ error: "Failed to fetch data" });
  }
});
routerAnime.get("/v1/anime/search/:keyword", async (req, res) => {
  const { keyword } = req.params;
  try {
    const data = await searchAnime({ keyword });
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.send({ error: "Failed to fetch data" });
  }
});
routerAnime.get("/v1/anime/slug/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const data = await Anime({ slug });
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.send({ error: "Failed to fetch data" });
  }
});
routerAnime.get("/v1/anime/episode/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const data = await episodeAnime({ slug });
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.send({ error: "Failed to fetch data" });
  }
});
routerAnime.get("/v1/anime/genres", async (req, res) => {
  try {
    const data = await genresAnime();
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.send({ error: "Failed to fetch data" });
  }
});
routerAnime.get("/v1/anime/genres/:slug/:page?", async (req, res) => {
  const { slug, page = 1} = req.params;
  try {
    const data = await mapGenresAnime({ slug, page });
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.send({ error: "Failed to fetch data" });
  }
});

export default routerAnime;
