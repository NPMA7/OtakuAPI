import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { DONGHUA_BASEURL } = process.env;

const mapGenresDonghua = async ({ slug, page }) => {
  try {
    const genreResponse = await axios.get(
      `${DONGHUA_BASEURL}/genres/${slug}/page/${page}`
    );

    let mapGenresDonghua = {
      status: "Ok",
      data: { donghua: [] },
      pagination: {
        prev_page: null,
        next_page: null,
        page: null,
      },
    };

    if (genreResponse.status === 200) {
      const genresHtml = genreResponse.data;
      const $ = cheerio.load(genresHtml);
      $("div.postbody div.bixbox div.listupd div.bsx a").each(function () {
        const title = $(this).attr("title").trim();
        const slug = $(this)
          .attr("href")
          ?.replace(`${DONGHUA_BASEURL}/anime/`, "")
          .replace("/", "");
        const poster = $(this).find("div.limit img").prop("data-src").trim();
        const type = $(this).find("div.limit div.typez").text().trim();
        const current_episode = $(this)
          .find("div.limit div.bt span.epx")
          .text()
          .trim();
        const url_main = $(this).attr("href");

        mapGenresDonghua.data.donghua.push({
          title,
          slug,
          poster,
          type,
          current_episode,
          url_main,
        });
      });

      $("div.postbody div.bixbox div.pagination").each(function () {
        const currentPage = $(this)
          .find("span[aria-current='page']")
          .text()
          .trim();
        const prevPageAttr = $(this).find("a.prev").attr("href");
        const prevPage = prevPageAttr
          ? prevPageAttr
              .replace(`${DONGHUA_BASEURL}/genres/${slug}/page/`, "")
              .replace(`${DONGHUA_BASEURL}/genres/${slug}/`, "1")
              .replace("/", "")
          : null;
        const nextPageAttr = $(this).find("a.next").attr("href");
        const nextPage = nextPageAttr
          ? nextPageAttr
              .replace(`${DONGHUA_BASEURL}/genres/${slug}/page/`, "")
              .replace("/", "")
          : null;

        mapGenresDonghua.pagination = {
          page: currentPage,
          previos_page: prevPage,
          next_page: nextPage,
        };
      });
    }

    console.log("Data extraction and saving successful");
    return mapGenresDonghua;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default mapGenresDonghua;
