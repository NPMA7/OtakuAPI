import express from "express";
const routerAnime = express.Router();

routerAnime.get("/v1/anime", (req, res) =>
  res.send({
    status: "OK",
    message: "Upcoming",
    endpoint: [],
  })
);

export default routerAnime;
