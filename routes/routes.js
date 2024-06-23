import express from "express";
import routerDonghua from "./routesDonghua.js";
import routerAnime from "./routesAnime.js";
const router = express.Router();

router.use(routerDonghua);
router.use(routerAnime);

// Endpoint
router.get("/", (req, res) =>
  res.send({
    status: "OK",
    message: "This scraper API is currently under development.",
  })
);
router.get("/v1", (req, res) =>
  res.send({ status: "OK", message: " made within ..... <3" })
);

export default router;
