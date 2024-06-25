import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { ANIME_BASEURL } = process.env;

const episodeAnime = async ({ slug }) => {
  try {
    const episodeResponse = await axios.get(`${ANIME_BASEURL}/episode/${slug}`);

    let episodeAnime = {
      status: "Ok",
      data: {
        episode: "",
        stream_url: "",
        anime: {
          title: "",
          slug: "",
          url_main: "",
          genres: [],
          duration: "",
          type: "",
        },
        pagination: {
          prev_page: null,
          next_page: null,
          page: null,
        },
        episodes_list: [],
        download_urls: {
          mp4: [],
          mkv: [],
        },
      },
    };

    if (episodeResponse.status === 200) {
      const episodeHtml = episodeResponse.data;
      const $ = cheerio.load(episodeHtml);

      $("div.venser").each(function () {
        const episode = $(this).find("div.venutama h1").text().trim();
        const stream_url = $(this)
          .find("div.venutama div.responsive-embed-stream iframe")
          .attr("src");

        const currentPageAttr = $(this)
          .find("div.venutama div.flir a[rel='follow']")
          .attr("href");
        const currentPage = currentPageAttr
          ? currentPageAttr
              .replace(`${ANIME_BASEURL}/anime/`, "")
              .replace("/", "")
          : null;

        const prevPageAttr = $(this)
          .find("div.venutama div.flir a[title='Episode Sebelumnya']")
          .attr("href");
        const prevPage = prevPageAttr
          ? prevPageAttr.replace(`${ANIME_BASEURL}/episode/`, "")
          : null;

        const nextPageAttr = $(this)
          .find("div.venutama div.flir a[title='Episode Selanjutnya']")
          .attr("href");
        const nextPage = nextPageAttr
          ? nextPageAttr.replace(`${ANIME_BASEURL}/episode/`, "")
          : null;

        const title = $(this)
          .find("h2.infozw")
          .text()
          .trim()
          .replace("Info ", "");
        const slug = $(this)
          .find("div.venutama div.flir a")
          .attr("href")
          .replace(`${ANIME_BASEURL}/episode/`, "")
          .replace("/", "");
        const url_main = $(this).find("div.venutama div.flir a").attr("href");
        const duration = $(this)
          .find("div.infozin div.infozingle p span:contains(Duration)")
          .text()
          .replace("Duration: ", "")
          .trim();
        const type = $(this)
          .find("div.infozin div.infozingle p span:contains(Tipe)")
          .text()
          .replace("Tipe: ", "")
          .trim();

        episodeAnime.data.anime.title = title;
        episodeAnime.data.anime.slug = slug;
        episodeAnime.data.anime.url_main = url_main;
        episodeAnime.data.anime.duration = duration;
        episodeAnime.data.anime.type = type;
        episodeAnime.data.episode = episode;
        episodeAnime.data.stream_url = stream_url;
        episodeAnime.data.pagination = {
          page: currentPage,
          previous_page: prevPage,
          next_page: nextPage,
        };

        $(
          "div.cukder div.judul-recommend-anime-series div.keyingpost li a"
        ).each(function () {
          const episodeTitle = $(this).text().trim();
          const episodeSlugAttr = $(this).attr("href");
          const episodeSlug = episodeSlugAttr
            ? episodeSlugAttr
                .replace(`${ANIME_BASEURL}/episode/`, "")
                .replace("/", "")
            : null;
          const episodeUrlMain = episodeSlugAttr;
          episodeAnime.data.episodes_list.push({
            episode: episodeTitle,
            slug: episodeSlug,
            url_main: episodeUrlMain,
          });
        });

        $("div.infozin div.infozingle p a").each(function () {
          const name = $(this).text().trim();
          const slug = $(this)
            .attr("href")
            ?.replace(`${ANIME_BASEURL}/genres/`, "")
            .replace("/", "");
          const url_main = $(this).attr("href");
          episodeAnime.data.anime.genres.push({
            name,
            slug,
            url_main,
          });
        });

        $("div.venutama div.download ul li").each(function () {
          const resolution = $(this).find("strong").text().trim();
          const size = $(this).find("i").text().trim();
          const links = [];
          $(this)
            .find("a")
            .each(function () {
              const provider = $(this).text().trim();
              const url = $(this).attr("href");
              links.push({ provider, url });
            });
          episodeAnime.data.download_urls.mp4.push({
            resolution,
            size,
            urls: links,
          });
          episodeAnime.data.download_urls.mkv.push({
            resolution,
            size,
            urls: links,
          });
        });
      });
    }

    console.log("Fetching Success");
    return episodeAnime;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default episodeAnime;
