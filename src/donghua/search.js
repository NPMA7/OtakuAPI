import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { DONGHUA_BASEURL } = process.env;

const searchDonghua = async ({ keyword, page }) => {
  try {
    const searchResponse = await axios.get(
      `${DONGHUA_BASEURL}/page/${page}?s=${keyword}`
    );

    let searchDonghua = {
      status: "Ok",
      data: [],
      pagination: {
        prev_page: null,
        next_page: null,
        page: null,
      },
    };

    if (searchResponse.status === 200) {
      const searchHtml = searchResponse.data;
      const $ = cheerio.load(searchHtml);

      $("div.postbody div.bixbox div.listupd div.bsx a").each(function () {
        const title = $(this).attr("title").trim();
        const slug = $(this)
          .attr("href")
          ?.replace(`${DONGHUA_BASEURL}/anime/`, "")
          .replace("/", "");
        const poster = $(this).find("div.limit img").prop("data-src").trim();
        const type = $(this).find("div.limit div.typez").text().trim();
        const status = $(this).find("div.limit div.bt span.epx").text().trim();
        const url_main = $(this).attr("href");

        searchDonghua.data.push({
          title,
          slug,
          poster,
          type,
          status,
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
              .replace(`${DONGHUA_BASEURL}/page/`, "")
              .replace(`${DONGHUA_BASEURL}/?s=${keyword}`, "1")
              .replace(`/?s=${keyword}`, "")
          : null;
        const nextPageAttr = $(this).find("a.next").attr("href");
        const nextPage = nextPageAttr
          ? nextPageAttr
              .replace(`${DONGHUA_BASEURL}/page/`, "")
              .replace(`/?s=${keyword}`, "")
          : null;;
         
        searchDonghua.pagination = {
          page: currentPage,
          previos_page: prevPage,
          next_page: nextPage,
        };
      });
    }

    console.log("Data extraction and saving successful");
    return searchDonghua;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default searchDonghua;
