import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

// Determine the environment
const isLocal = process.env.NODE_ENV !== 'production'; // Assume 'production' means hosting environment

// Set the server URL based on the environment
const serverRunningOn = isLocal 
    ? 'http://localhost:4444' // Your local URL
    : 'https://otaku-api.vercel.app'; // Your hosting URL

const { ANIME_BASEURL } = process.env;

const homeAnime = async () => {
  try {
    const response = await axios.get(`${ANIME_BASEURL}`);

    let homeAnime = {
      stats: "Ok",
      data: { ongoing_anime: [], completed_anime: [] },
    };

    if (response.status === 200) {
      const homeHtml = response.data;
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

          const originalPoster = $(this)
            .find("div.detpost div.thumb div.thumbz img")
            .attr("src");
          const poster = isLocal
            ? originalPoster.replace(
                "https://otakudesu.cloud/",
                "https://localhost:4444/"
              )
            : originalPoster;

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
          const url_example = $(this)
            .find("div.detpost div.thumb a")
            .attr("href")
            ?.replace(`${ANIME_BASEURL}`, `${serverRunningOn}`);

          homeAnime.data.ongoing_anime.push({
            title,
            slug,
            poster, // Use the environment-dependent poster URL
            current_episode,
            day_release,
            date_release,
            url_example,
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

          const originalPoster = $(this)
            .find("div.detpost div.thumb div.thumbz img")
            .attr("src");
          const poster = isLocal
            ? originalPoster.replace(
                "https://otakudesu.cloud/",
                "https://localhost:4444/"
              )
            : originalPoster;

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
          const url_example = $(this)
            .find("div.detpost div.thumb a")
            .attr("href");

          homeAnime.data.completed_anime.push({
            title,
            slug,
            poster, // Use the environment-dependent poster URL
            current_episode,
            day_release,
            date_release,
            url_example,
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
