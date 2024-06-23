import express from "express";
import completedDonghua from "../src/donghua/completed.js";
import ongoingDonghua from "../src/donghua/ongoing.js";
import homeDonghua from "../src/donghua/home.js";
import genresDonghua from "../src/donghua/genres.js";
import mapGenresDonghua from "../src/donghua/mapGenres.js";
import Donghua from "../src/donghua/donghua.js";
import episodeDonghua from "../src/donghua/episode.js";
import searchDonghua from "../src/donghua/search.js";
const router = express.Router();

// Endpoint to serve the JSON data
router.get("/", (req, res) =>
  res
    .status(200)
    .json({
      status: "OK",
      message: "This scraper API is currently under development ",
    })
);
router.get("/v1", (req, res) =>
  res.status(200).json({ status: "OK", message: " made within 1 week <3" })
);
router.get("/v1/donghua", (req, res) =>
  res
    .status(200)
    .json({
      status: "OK",
      message: "please input endpoint donghua",
      endpoint: [
        "home, /v1/donghua/home                      : check",
        "ongoing, /v1/donghua/ongoing/:page          : check",
        "completed, /v1/donghua/complete/:page       : check",
        "search, /v1/donghua/search/:keyword/:page?  : check",
        "donghua, /v1/donghua/slug/:slug             : check",
        "episode, /v1/donghua/episode/:slug          : check",
        "genres, /v1/donghua/genres                  : check",
        "mapGenres, /v1/donghua/genres/:slug/:page?  : check",
      ],
    })
);

router.get("/v1/donghua/home/:page?", async (req, res) => {
  const { page = 1 } = req.params;
  try {
    const data = await homeDonghua({ page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
router.get("/v1/donghua/ongoing/:page?", async (req, res) => {
  const { page = 1 } = req.params;
  try {
    const data = await ongoingDonghua({ page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
router.get("/v1/donghua/complete/:page?", async (req, res) => {
  const { page = 1 } = req.params;
  try {
    const data = await completedDonghua({ page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
router.get("/v1/donghua/search/:keyword/:page?", async (req, res) => {
  const { keyword, page = 1 } = req.params;
  try {
    const data = await searchDonghua({ keyword, page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
router.get("/v1/donghua/slug/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const data = await Donghua({ slug });
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
router.get("/v1/donghua/episode/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const data = await episodeDonghua({ slug });
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
router.get("/v1/donghua/genres", async (req, res) => {
  try {
    const data = await genresDonghua();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
router.get("/v1/donghua/genres/:slug/:page?", async (req, res) => {
  const { slug, page = 1 } = req.params; // Set default page to 1 if not provided
  try {
    const data = await mapGenresDonghua({ slug, page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

export default router;
