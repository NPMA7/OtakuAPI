import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { DONGHUA_BASEURL } = process.env;

const completedDonghua = async ({ page }) => {
  try {
    const completedResponse = await axios.get(
      `${DONGHUA_BASEURL}/anime/?page=${page}&status=completed&sub=&order=update`
    );
    
    let completedDonghua = {
      status: "Ok",
      data: { completed_donghua: []},  
      pagination: {
        prev_page: null,
        next_page: null,
        pages: [],
      },
    };

    if (completedResponse.status === 200) {
      const completedHtml = completedResponse.data;
      const $ = cheerio.load(completedHtml);

      $("div.listupd article div.bsx").each(function () {
        const title = $(this)
          .find("div.tt")
          .contents()
          .filter(function () {
            return this.nodeType === 3;
          })
          .text()
          .trim();
        const slugAttr = $(this).find("a.tip").attr("href");
        const slug = slugAttr ? slugAttr.replace(`${DONGHUA_BASEURL}/anime`, "").replace("/", "") : null;
        const poster = $(this).find("img").prop("data-src");
        const status = $(this).find("div.bt span.epx").text().trim();
        const url_main = slugAttr;

        completedDonghua.data.completed_donghua.push({
          title,
          slug,
          poster,
          status,
          url_main,
        });
      });

      $("div.postbody div.bixbox div.hpage").each(function () {
        const prevPageAttr = $(this).find("a.l").attr("href");
        const prevPage = prevPageAttr ? prevPageAttr.replace("?page=", "").replace("&status=completed&sub=&order=update", "") : null;
        const nextPageAttr = $(this).find("a.r").attr("href");
        const nextPage = nextPageAttr ? nextPageAttr.replace("?page=", "").replace("&status=completed&sub=&order=update", "") : null;

        completedDonghua.pagination = {
          previos_page: prevPage,
          next_page: nextPage,
        };
      });
    }


    console.log("Data extraction and saving successful");
    return completedDonghua;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default completedDonghua;
