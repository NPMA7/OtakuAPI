import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { DONGHUA_BASEURL } = process.env;

const homeDonghua = async ({ page }) => {
  try {
    const [homeResponse, completeResponse] = await Promise.all([
      axios.get(`${DONGHUA_BASEURL}/page/${page}`),
      axios.get(`${DONGHUA_BASEURL}/anime/?status=completed&sub=&order=update`),
    ]);
    let homeDonghua = {
      status: "Ok",
      data: { latest_release: [], complete_donghua: [] },
      pagination: {
        prev_page: null,
        next_page: null,
        page: null,
      },
    };
    if (homeResponse.status === 200) {
      const homeHtml = homeResponse.data;
      const $ = cheerio.load(homeHtml);
      $("div.postbody div.bixbox div.listupd:first div.bsx a").each(
        function () {
          const title = $(this).attr("title").trim();
          const slug = $(this)
            .attr("href")
            ?.replace(`${DONGHUA_BASEURL}`, "")
            .replace("/", "");
          const poster = $(this).find("div.limit img").prop("data-src").trim();
          const type = $(this).find("div.limit div.typez").text().trim();
          const current_episode = $(this)
            .find("div.limit div.bt span.epx")
            .text()
            .trim();
          const url = $(this)
            .attr("href")
            ?.replace(
              `${DONGHUA_BASEURL}`,
              "https://otaku-api.vercel.app/v1/donghua/episode"
            );

          homeDonghua.data.latest_release.push({
            title,
            slug,
            poster,
            type,
            current_episode,
            url,
          });
        }
      );
      $("div.postbody div.bixbox div.hpage").each(function () {
        const currentPage = $(this)
          .find("span[aria-current='page']")
          .text()
          .trim();
        const prevPageAttr = $(this).find("a.l").attr("href");
        const prevPage = prevPageAttr
          ? prevPageAttr
              .replace(`${DONGHUA_BASEURL}/page/`, "")
              .replace("/", "")
          : null;
        const nextPageAttr = $(this).find("a.r").attr("href");
        const nextPage = nextPageAttr
          ? nextPageAttr
              .replace(`${DONGHUA_BASEURL}/page/`, "")
              .replace("/", "")
          : null;

        homeDonghua.pagination = {
          page: currentPage,
          prev_page: prevPage,
          next_page: nextPage,
        };
      });
    }
    if (completeResponse.status === 200) {
      const completeHtml = completeResponse.data;
      const $ = cheerio.load(completeHtml);
      $("div.postbody div.bixbox div.listupd div.bsx a").each(function () {
        const title = $(this).attr("title").trim();
        const slug = $(this)
          .attr("href")
          ?.replace(`${DONGHUA_BASEURL}/anime/`, "")
          .replace("/", "");
        const poster = $(this).find("div.limit img").prop("data-src");
        const type = $(this).find("div.limit div.typez").text().trim();
        const status = $(this).find("div.limit div.bt span.epx").text().trim();
        const url = $(this)
          .attr("href")
          ?.replace(
            `${DONGHUA_BASEURL}/anime/`,
            "https://otaku-api.vercel.app/v1/donghua/slug/"
          );

        homeDonghua.data.complete_donghua.push({
          title,
          slug,
          poster,
          status,
          type,
          url,
        });
      });
    }

    console.log("Fetching Success");
    return homeDonghua;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default homeDonghua;
