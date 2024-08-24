import axios from "axios";
import Cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { ANIME_BASEURL } = process.env;

const searchAnime = async ({ keyword }) => {
  try {
    const Response = await axios.get(
      `${ANIME_BASEURL}/?s=${keyword}&post_type=anime`
    );

    let searchAnime = {
      status: "Ok",
      data: [],
    };

    if (Response.status === 200) {
      const searchHtml = Response.data;
      const $ = Cheerio.load(searchHtml);

      $("div.page ul li").each(function () {
        const title = $(this).find("h2").text().trim();
        const slug = $(this)
          .find("h2 a")
          .attr("href")
          ?.replace(`${ANIME_BASEURL}/anime/`, "")
          .replace("/", "");
        const poster = $(this).find("img").attr("src");
        const status = $(this)
          .find("div.set:contains(Status)")
          .text()
          .replace("Status :", "")
          .trim();
        const rating = $(this)
          .find("div.set:contains(Rating)")
          .text()
          .replace("Rating :", "")
          .trim();
        const url_main = $(this).find("h2 a").attr("href");

        // Collecting genres with their URLs and slugs
        let genres = [];
        $(this)
          .find("div.set a")
          .each(function () {
            const genreName = $(this).text().trim();
            const genreSlug = $(this)
              .attr("href")
              ?.replace(`${ANIME_BASEURL}/genres/`, "")
              .replace("/", "");
            const genreUrl = $(this).attr("href");
            genres.push({
              name: genreName,
              slug: genreSlug,
              url: genreUrl,
            });
          });

        searchAnime.data.push({
          title: title,
          slug: slug,
          poster: poster,
          genres: genres,
          status: status,
          rating: rating,
          url_main: url_main,
        });
      });
    }

    console.log("Fetching Success");
    return searchAnime;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default searchAnime;
