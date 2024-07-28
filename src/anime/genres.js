import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { ANIME_BASEURL } = process.env;

const genresAnime = async () => {
  try {
    const genreResponse = await axios.get(`${ANIME_BASEURL}/genre-list`);
    let genresAnime = {
      status: "Ok",
      data: [],
    };
    if (genreResponse.status === 200) {
      const genresHtml = genreResponse.data;
      const $ = cheerio.load(genresHtml);
      $("div.venser ul.genres li a ").each(function () {
        const name = $(this).text().trim();
        const slug = $(this)
          .attr("href")
          ?.replace(`/genres/`, "")
          .replace("/", "");
        const url_example = $(this).attr("href");

        genresAnime.data.push({
          name,
          slug,
          url_example,
        });
      });
    }

    console.log("Fetching Success");
    return genresAnime;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default genresAnime;
