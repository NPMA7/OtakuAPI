import axios from "axios";
import Cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { ANIME_BASEURL } = process.env;

const ongoingAnime = async ({ page }) => {
  try {
    const Response = await axios.get(
      `${ANIME_BASEURL}/ongoing-anime/page/${page}`
    );

    let ongoingAnime = {
      status: "Ok",
      data: [],
      pagination: {},
    };

    if (Response.status === 200) {
      const ongoingHtml = Response.data;
      const $ = Cheerio.load(ongoingHtml);

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
          const url = $(this).find("div.detpost div.thumb a").attr("href")
          ?.replace(
            `${ANIME_BASEURL}/anime/`,
            "https://otaku-api.vercel.app/v1/anime/slug/"
          );
          
          ongoingAnime.data.push({
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
      $("div.venutama div.pagination div.pagenavix").each(function () {
        const page = $(this).find('span[aria-current="page"]').text().trim();
        const prev_page = $(this)
          .find("a.prev")
          .attr("href")
          ?.replace(`${ANIME_BASEURL}/ongoing-anime/page/`, "")
          .replace("/", "");
        const next_page = $(this)
          .find("a.next")
          .attr("href")
          ?.replace(`${ANIME_BASEURL}/ongoing-anime/page/`, "")
          .replace("/", "");

        ongoingAnime.pagination = {
          page: page,
          prev_page: prev_page,
          next_page: next_page,
        };
      });
      console.log("Fetching Success");
      return ongoingAnime;
    }
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default ongoingAnime;
