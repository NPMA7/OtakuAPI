import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { ANIME_BASEURL } = process.env;

const homeAnime = async () => {
  try {
    const Response = await axios.get(`${ANIME_BASEURL}`);

    let homeAnime = {
      stats: "Ok",
      data: { ongoing_anime: [], completed_anime: [] },
    };
    if (Response.status === 200) {
      const homeHtml = Response.data;
      const $ = cheerio.load(homeHtml);

      $("div.venutama div.rseries div.rapi:first div.venz ul li").each(
        function () {
          const title = $(this)
            .find("div.detpost div.thumb div.thumbz h2")
            .text()
            .trim();
          const slug = $(this)
            .find("div.detpost div.thumb a")
            .attr("href")
            ?.replace(`${ANIME_BASEURL}/anime/`, "")
            .replace("/", "");
          const poster = $(this)
            .find("div.detpost div.thumb div.thumbz img")
            .attr("src");
          const current_episode = $(this)
            .find("div.detpost div.epz")
            .text()
            .trim();
          const day_release = $(this)
            .find("div.detpost div.epztipe")
            .text()
            .trim();
          const date_release = $(this)
            .find("div.detpost div.newnime")
            .text()
            .trim();
          const url = $(this)
            .find("div.detpost div.thumb a")
            .attr("href")
            ?.replace(
              `${ANIME_BASEURL}/anime/`,
              ANIME_BASEURL.includes("localhost") ? "https://otaku-api.vercel.app/v1/anime/slug/" : "http://localhost:4444/v1/anime/slug/"
            );
          homeAnime.data.ongoing_anime.push({
            title,
            slug,
            poster,
            current_episode,
            day_release,
            date_release,
            url,
          });
        }
      );
      $("div.venutama div.rseries div.rapi:last div.venz ul li").each(
        function () {
          const title = $(this)
            .find("div.detpost div.thumb div.thumbz h2")
            .text()
            .trim();
          const slug = $(this)
            .find("div.detpost div.thumb a")
            .attr("href")
            ?.replace(`${ANIME_BASEURL}/anime/`, "")
            .replace("/", "");
          const poster = $(this)
            .find("div.detpost div.thumb div.thumbz img")
            .attr("src");
          const current_episode = $(this)
            .find("div.detpost div.epz")
            .text()
            .trim();
          const day_release = $(this)
            .find("div.detpost div.epztipe")
            .text()
            .trim();
          const date_release = $(this)
            .find("div.detpost div.newnime")
            .text()
            .trim();
          const url = $(this)
            .find("div.detpost div.thumb a")
            .attr("href")
            ?.replace(
              `${ANIME_BASEURL}/anime/`,
              ANIME_BASEURL.includes("localhost") ? "https://otaku-api.vercel.app/v1/anime/slug/" : "http://localhost:4444/v1/anime/slug/"
            );

          homeAnime.data.completed_anime.push({
            title,
            slug,
            poster,
            current_episode,
            day_release,
            date_release,
            url,
          });
        }
      );
    }
    console.log("Fetching Success");
    return homeAnime;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default homeAnime;
