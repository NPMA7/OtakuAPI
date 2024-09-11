import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { ANIME_BASEURL } = process.env;

const mapGenresAnime = async ({ slug, page }) => {
  try {
    const genreResponse = await axios.get(
      `${ANIME_BASEURL}/genres/${slug}/page/${page}`
    );

    let mapGenresAnime = {
      status: "Ok",
      data: { anime: [] },
      pagination: {
        prev_page: null,
        next_page: null,
        page: null,
      },
    };

    if (genreResponse.status === 200) {
      const genresHtml = genreResponse.data;
      const $ = cheerio.load(genresHtml);

      $("div.venser div.page div.col-anime").each(function () {
        const title = $(this).find("div.col-anime-title").text().trim();
        const slug = $(this)
          .find("div.col-anime-title a")
          .attr("href")
          ?.replace(`${ANIME_BASEURL}/anime/`, "")
          .replace("/", "");
        const poster = $(this)
          .find("div.col-anime-cover img")
          .attr("src")
          .trim();
        const rating = $(this).find("div.col-anime-rating").text().trim();
        const episode_count = $(this).find("div.col-anime-eps").text().trim();
        const season = $(this).find("div.col-anime-date").text().trim();
        const studio = $(this).find("div.col-anime-studio").text().trim();
        const synopsis = $(this).find("div.col-synopsis").text().trim();
        const url = $(this)
          .find("div.col-anime-trailer a")
          .attr("href")
          ?.replace(
            `${ANIME_BASEURL}/anime/`,
            "https://otaku-api.vercel.app/v1/anime/slug/"
          );

        const genres = [];
        $(this)
          .find("div.col-anime-genre a")
          .each(function () {
            const genresName = $(this).text().trim();
            const genresSlug = $(this)
              .attr("href")
              ?.replace(`${ANIME_BASEURL}/genres/`, "")
              .replace("/", "");
            const genresUrl = $(this)
              .attr("href")
              ?.replace(
                `${ANIME_BASEURL}/`,
                "https://otaku-api.vercel.app/v1/anime/"
              );

            genres.push({
              name: genresName,
              slug: genresSlug,
              url: genresUrl,
            });
          });

        mapGenresAnime.data.anime.push({
          title,
          slug,
          poster,
          rating,
          episode_count,
          season,
          studio,
          synopsis,
          genres,
          url,
        });
      });

      $("div.venser div.page div.pagination div.pagenavix").each(function () {
        const currentPage = $(this)
          .find("span[aria-current='page']")
          .text()
          .trim();
        const prevPageAttr = $(this).find("a.prev").attr("href");
        const prevPage = prevPageAttr
          ? prevPageAttr
              .replace(`${ANIME_BASEURL}/genres/${slug}/page/`, "")
              .replace(`${ANIME_BASEURL}/genres/${slug}/`, "1")
              .replace("/", "")
          : null;
        const nextPageAttr = $(this).find("a.next").attr("href");
        const nextPage = nextPageAttr
          ? nextPageAttr
              .replace(`${ANIME_BASEURL}/genres/${slug}/page/`, "")
              .replace("/", "")
          : null;

        mapGenresAnime.pagination = {
          page: currentPage,
          prev_page: prevPage,
          next_page: nextPage,
        };
      });
    }

    console.log("Fetching Success");
    return mapGenresAnime;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default mapGenresAnime;
