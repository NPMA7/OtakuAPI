import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { DONGHUA_BASEURL } = process.env;

const Donghua = async ({ slug }) => {
  try {
    const Response = await axios.get(`${DONGHUA_BASEURL}/anime/${slug}`);

    let Donghua = {
      status: "Ok",
      data: {
        title: "",
        alter_title: "",
        poster: "",
        rating: "",
        status: "",
        studio: "",
        released: "",
        duration: "",
        type: "",
        episodes_count: "",
        casts: "",
        released_on: "",
        updated_on: "",
        genres: [],
        synopsis: "",
        batch: [],
        episodes_list: [],
        recommendations: [],
      },
    };

    if (Response.status === 200) {
      const genresHtml = Response.data;
      const $ = cheerio.load(genresHtml);

      $("div.postbody").each(function () {
        const title = $(this).find("div.infox h1").text().trim();
        const alter_title = $(this)
          .find("div.infox div.ninfo span.alter")
          .text()
          .trim();
        const poster = $(this)
          .find("div.thumbook div.thumb img")
          .prop("data-src");
        const rating = $(this)
          .find("div.thumbook div.rt div.rating")
          .text()
          .trim();

        const status = $(this)
          .find("div.infox div.info-content div.spe span:contains('Status:')")
          .text()
          .replace("Status: ", "")
          .trim();
        const studio = $(this)
          .find("div.infox div.info-content div.spe span:contains('Studio:') a")
          .text()
          .trim();
        const released = $(this)
          .find(
            "div.infox div.info-content div.spe span.split:contains('Released:')"
          )
          .text()
          .replace("Released: ", "")
          .trim();
        const duration = $(this)
          .find("div.infox div.info-content div.spe span:contains('Duration:')")
          .text()
          .replace("Duration: ", "")
          .replace("per ep.", "")
          .trim();
        const type = $(this)
          .find("div.infox div.info-content div.spe span:contains('Type:')")
          .text()
          .replace("Type: ", "")
          .trim();
        const episodes_count = $(this)
          .find("div.infox div.info-content div.spe span:contains('Episodes:')")
          .text()
          .replace("Episodes: ", "")
          .trim();
        const casts = $(this)
          .find("div.infox div.info-content div.spe span:contains('Casts:')")
          .text()
          .replace("Episodes: ", "")
          .trim();
        const released_on = $(this)
          .find(
            "div.infox div.info-content div.spe span.split time[itemprop='datePublished']"
          )
          .text()
          .trim();
        const updated_on = $(this)
          .find(
            "div.infox div.info-content div.spe span.split time[itemprop='dateModified']"
          )
          .text()
          .trim();
        const synopsis = $(this)
          .find("div.bixbox div.entry-content p")
          .text()
          .trim();

        Donghua.data.title = title;
        Donghua.data.alter_title = alter_title;
        Donghua.data.poster = poster;
        Donghua.data.rating = rating;
        Donghua.data.status = status;
        Donghua.data.studio = studio;
        Donghua.data.released = released;
        Donghua.data.duration = duration;
        Donghua.data.type = type;
        Donghua.data.episodes_count = episodes_count;
        Donghua.data.casts = casts;
        Donghua.data.released_on = released_on;
        Donghua.data.updated_on = updated_on;
        Donghua.data.synopsis = synopsis;
      });

      $("div.postbody div.infox div.ninfo div.info-content div.genxed a").each(
        function () {
          const name = $(this).text().trim();
          const slug = $(this)
            .attr("href")
            ?.replace(`${DONGHUA_BASEURL}/genres/`, "")
            .replace("/", "");
          const url_main = $(this).attr("href");

          Donghua.data.genres.push({
            name,
            slug,
            url_main,
          });
        }
      );

      $("div.postbody div.bixbox div.eplister ul li").each(function () {
        const episode = $(this).find("a div.epl-title").text().trim();
        const slug = $(this)
          .find("a")
          .attr("href")
          ?.replace(`${DONGHUA_BASEURL}`, "")
          .replace("/", "");
        const url_main = $(this).find("a").attr("href");
        Donghua.data.episodes_list.push({
          episode,
          slug,
          url_main,
        });
      });
      $("div.postbody div.bixbox div.listupd div.bsx a").each(function () {
        const title = $(this).attr("title").trim();
        const slug = $(this)
          .attr("href")
          ?.replace(`${DONGHUA_BASEURL}/anime/`, "")
          .replace("/", "");
        const poster = $(this).find("div.limit img").prop("data-src");
        const type = $(this).find("div.limit div.typez").text().trim();
        const url_main = $(this).attr("href");

        Donghua.data.recommendations.push({
          title,
          slug,
          poster,
          type,
          url_main,
        });
      });
    }

    console.log("Fetching Success");
    return Donghua;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default Donghua;
