import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const { DONGHUA_BASEURL } = process.env;

const episodeDonghua = async ({ slug }) => {
  try {
    const episodeResponse = await axios.get(`${DONGHUA_BASEURL}/${slug}`);

    let episodeDonghua = {
      status: "Ok",
      data: {
        episode: "",
        stream_url: "",
        donghua: {
          title: "",
          slug: "",
          url_main: "",
          rating: "",
          status: "",
          studio: "",
          released: "",
          country: "",
          season: "",
          type: "",
          episode_count: "",
          platform: "",
          synopsis: "",
          genres: [],
        },
        pagination: {
          prev_page: null,
          next_page: null,
          page: null,
        },
        episodes_list: [],
        download_url: {},
        recommendations: [],
      },
    };

    if (episodeResponse.status === 200) {
      const episodeHtml = episodeResponse.data;
      const $ = cheerio.load(episodeHtml);

      $("div.postbody").each(function () {
        const episode = $(this).find("div.title-section h1").text().trim();
        const stream_url = $(this).find("div.video-content iframe").attr("src");

        episodeDonghua.data.episode = episode;
        episodeDonghua.data.stream_url = stream_url;

        const currentPageAttr = $(this).find("div.nvs.nvsc a").attr("href");
        const currentPage = currentPageAttr
          ? currentPageAttr.replace(`${DONGHUA_BASEURL}/anime/`, "")
          : null;

        const prevPageAttr = $(this).find("a[aria-label='prev']").attr("href");
        const prevPage = prevPageAttr
          ? prevPageAttr.replace(`${DONGHUA_BASEURL}/`, "")
          : null;

        const nextPageAttr = $(this)
          .find("a[aria-label='next']")
          .attr("href");
        const nextPage = nextPageAttr
          ? nextPageAttr.replace(`${DONGHUA_BASEURL}/`, "")
          : null;

        episodeDonghua.data.pagination = {
          page: currentPage,
          previous_page: prevPage,
          next_page: nextPage,
        };
        $("div.mctnx div.soraddlx").each(function () {
          const subtitleTitle = $(this).find(".sorattlx h3").text().trim();
          const subtitleLang = subtitleTitle.toLowerCase().includes("english")
            ? "en"
            : "id";
          const downloadUrl = $(this).find(".soraurlx a").attr("href");
          episodeDonghua.data.download_url[`download_url_${subtitleLang}`] =
            downloadUrl;
        });
      });

      $("div.headlist").each(function () {
        const title = $(this).find("div.det h2 a").text().trim();
        const slugAttr = $(this).find("div.det h2 a").attr("href");
        const slug = slugAttr
          ? slugAttr.replace(`${DONGHUA_BASEURL}/anime/`, "")
          : null;
        const url_main = slugAttr;
        episodeDonghua.data.donghua.title = title;
        episodeDonghua.data.donghua.slug = slug;
        episodeDonghua.data.donghua.url_main = url_main;
      });

      $("div.postbody div.single-info div.infox").each(function () {
        const rating = $(this).find("div.rating").text().trim();
        const status = $(this)
          .find("div.info-content div.spe span:contains('Status:')")
          .text()
          .replace("Status: ", "")
          .trim();
        const platform = $(this)
          .find("div.info-content div.spe span:contains('Network:') a")
          .text()
          .replace("Network: ", "")
          .trim();
        const studio = $(this)
          .find("div.info-content div.spe span:contains('Studio:') a")
          .text()
          .replace("Studio: ", "")
          .trim();
        const released = $(this)
          .find("div.info-content div.spe span:contains('Released:')")
          .text()
          .replace("Released: ", "")
          .trim();
        const country = $(this)
          .find("div.info-content div.spe span:contains('Country:')")
          .text()
          .replace("Country: ", "")
          .trim();
        const season = $(this)
          .find("div.info-content div.spe span:contains('Season:')")
          .text()
          .replace("Season: ", "")
          .trim();
        const episode_count = $(this)
          .find("div.info-content div.spe span:contains('Episodes:')")
          .text()
          .replace("Episodes: ", "")
          .trim();
        const type = $(this)
          .find("div.info-content div.spe span:contains('Type:')")
          .text()
          .replace("Type: ", "")
          .trim();
        const synopsis = $(this)
          .find("div.info-content div.desc")
          .text()
          .trim();

        episodeDonghua.data.donghua.rating = rating;
        episodeDonghua.data.donghua.status = status;
        episodeDonghua.data.donghua.studio = studio;
        episodeDonghua.data.donghua.released = released;
        episodeDonghua.data.donghua.country = country;
        episodeDonghua.data.donghua.season = season;
        episodeDonghua.data.donghua.type = type;
        episodeDonghua.data.donghua.episode_count = episode_count;
        episodeDonghua.data.donghua.platform = platform;
        episodeDonghua.data.donghua.synopsis = synopsis;
      });
      $("div.postbody div.infox div.info-content div.genxed a").each(
        function () {
          const name = $(this).text().trim();
          const slug = $(this)
            .attr("href")
            ?.replace(`${DONGHUA_BASEURL}/genres/`, "")
            .replace("/", "");
          const url_main = $(this).attr("href");

          episodeDonghua.data.donghua.genres.push({
            name,
            slug,
            url_main,
          });
        }
      );

      $("div.episodelist ul li").each(function () {
        const episodeTitle = $(this).find("a div.playinfo h3").text().trim();
        const episodeSlugAttr = $(this).find("a").attr("href");
        const episodeSlug = episodeSlugAttr
          ? episodeSlugAttr.replace(`${DONGHUA_BASEURL}/`, "").replace("/", "")
          : null;
        const episodeUrlMain = episodeSlugAttr;

        episodeDonghua.data.episodes_list.push({
          episode: episodeTitle,
          slug: episodeSlug,
          url_main: episodeUrlMain,
        });
      });

      $("div.postbody div.bixbox div.listupd div.bsx a").each(function () {
        const title = $(this).attr("title").trim();
        const slug = $(this).attr("href")
          ? $(this)
              .attr("href")
              .replace(`${DONGHUA_BASEURL}/anime/`, "")
              .replace("/", "")
          : null;
        const poster = $(this).find("div.limit img").prop("data-src");
        const type = $(this).find("div.limit div.typez").text().trim();
        const url_main = $(this).attr("href");

        episodeDonghua.data.recommendations.push({
          title,
          slug,
          poster,
          type,
          url_main,
        });
      });
    }

    fs.writeFileSync(
      "data/donghua/episode.json",
      JSON.stringify(episodeDonghua, null, 4)
    );

    console.log("Data extraction and saving successful");
    return episodeDonghua;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default episodeDonghua;
