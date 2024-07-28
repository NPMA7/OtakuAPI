import axios from "axios";
import Cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { ANIME_BASEURL } = process.env;

const Anime = async ({ slug }) => {
  try {
    const Response = await axios.get(`${ANIME_BASEURL}/anime/${slug}`);

    let Anime = {
      status: "Ok",
      data: {
        title: "",
        japanese_title: "",
        poster: "",
        rating: "",
        producer: "",
        type: "",
        status: "",
        episode_count: "",
        duration: "",
        date_release: "",
        studio: "",
        genres: [],
        synopsis: "",
        batch: {
          name: "",
          url: "",
          upload_date: "",
        },
        episode_list: [],
        recommendations: [],
      },
    };

    if (Response.status === 200) {
      const AnimeHtml = Response.data;
      const $ = Cheerio.load(AnimeHtml);

      $("div.venser").each(function () {
        Anime.data.title = $(this)
          .find("div.infozin div.infozingle p span:contains('Judul')")
          .parent()
          .text()
          .replace("Judul: ", "")
          .trim();
        Anime.data.japanese_title = $(this)
          .find("div.infozin div.infozingle p span:contains('Japanese')")
          .parent()
          .text()
          .replace("Japanese: ", "")
          .trim();
        Anime.data.poster = $(this).find("img").attr("src");
        Anime.data.rating = $(this)
          .find("div.infozin div.infozingle p span:contains('Skor')")
          .parent()
          .text()
          .replace("Skor: ", "")
          .trim();
        Anime.data.producer = $(this)
          .find("div.infozin div.infozingle p span:contains('Produser')")
          .parent()
          .text()
          .replace("Produser: ", "")
          .trim();
        Anime.data.type = $(this)
          .find("div.infozin div.infozingle p span:contains('Tipe')")
          .parent()
          .text()
          .replace("Tipe: ", "")
          .trim();
        Anime.data.status = $(this)
          .find("div.infozin div.infozingle p span:contains('Status')")
          .parent()
          .text()
          .replace("Status: ", "")
          .trim();
        Anime.data.episode_count = $(this)
          .find("div.infozin div.infozingle p span:contains('Total Episode')")
          .parent()
          .text()
          .replace("Total Episode: ", "")
          .trim();
        Anime.data.duration = $(this)
          .find("div.infozin div.infozingle p span:contains('Durasi')")
          .parent()
          .text()
          .replace("Durasi: ", "")
          .trim();
        Anime.data.date_release = $(this)
          .find("div.infozin div.infozingle p span:contains('Tanggal Rilis')")
          .parent()
          .text()
          .replace("Tanggal Rilis: ", "")
          .trim();
        Anime.data.studio = $(this)
          .find("div.infozin div.infozingle p span:contains('Studio')")
          .parent()
          .text()
          .replace("Studio: ", "")
          .trim();

        const genres = [];
        $(this)
          .find("div.infozin div.infozingle p span:contains('Genre') a")
          .each(function () {
            const genreName = $(this).text().trim();
            const genreSlug = $(this)
              .attr("href")
              .replace(`${ANIME_BASEURL}/genres/`, "")
              .replace("/", "");
            const genreUrl = $(this).attr("href");
            genres.push({
              name: genreName,
              slug: genreSlug,
              url_example: genreUrl,
            });
          });
        Anime.data.genres = genres;
        Anime.data.synopsis = $(this)
          .find("div.sinopc p")
          .text()
          .trim();

        // Extract batch information
        const batchName = $(this).find("div.episodelist:first ul li").first().find("span a").text().trim();
        const batchUrl = $(this).find("div.episodelist:first ul li").first().find("span a").attr("href");
        const batchDate = $(this).find("div.episodelist:first ul li").first().find("span.zeebr").text().trim();
        Anime.data.batch = {
          name: batchName,
          url: batchUrl,
          upload_date: batchDate,
        };

        // Extract episode list
        $(this)
          .find("div.episodelist:not(:first) ul li")
          .each(function () {
            const episodeName = $(this).find("span a").text().trim();
            const episodeUrl = $(this).find("span a").attr("href");
            const episodeSlug = episodeUrl.replace(`${ANIME_BASEURL}/episode/`, "").replace("/", "");
            const episodeDate = $(this).find("span.zeebr").text().trim();
            Anime.data.episode_list.push({
              name: episodeName,
              slug: episodeSlug,
              upload_date: episodeDate,
              url_example: episodeUrl,
            });
          });

        // Extract recommendations
        $("div#recommend-anime-series div.isi-recommend-anime-series div.isi-konten").each(function () {
          const recTitle = $(this).find("span.judul-anime a").text().trim();
          const recSlug = $(this).find("span.judul-anime a").attr("href").replace(`${ANIME_BASEURL}/anime`, "").replace("/", "");
          const recPoster = $(this).find("a img").attr("src");
          const recUrl = $(this).find("span.judul-anime a").attr("href");
          Anime.data.recommendations.push({
            title: recTitle,
            slug: recSlug,
            poster: recPoster,
            url_example: recUrl,
          });
        });
      });
    }

    console.log("Fetching Success");
    return Anime;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default Anime;
