import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const { DONGHUA_BASEURL } = process.env;

const ongoingDonghua = async ({ page }) => {
  try {
    const ongoingResponse = await axios.get(
      `${DONGHUA_BASEURL}/anime/?page=${page}&status=ongoing&sub=&order=update`
    );
    
    let ongoingDonghua = {
      status: "Ok",
      data: { ongoing_donghua: [] },
      pagination: {}
    };

    if (ongoingResponse.status === 200) {
      const ongoingHtml = ongoingResponse.data;
      const $ = cheerio.load(ongoingHtml);

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

        ongoingDonghua.data.ongoing_donghua.push({
          title,
          slug,
          poster,
          status,
          url_main,
        });
      });

      $("div.postbody div.bixbox div.hpage").each(function () {
        const prevPageAttr = $(this).find("a.l").attr("href");
        const prevPage = prevPageAttr ? prevPageAttr.replace("?page=", "").replace("&status=ongoing&sub=&order=update", "") : null;
        const nextPageAttr = $(this).find("a.r").attr("href");
        const nextPage = nextPageAttr ? nextPageAttr.replace("?page=", "").replace("&status=ongoing&sub=&order=update", "") : null;

        ongoingDonghua.pagination = {
          previos_page: prevPage,
          next_page: nextPage,
        };
      });
    }

    fs.writeFileSync(
      "data/donghua/home.json",
      JSON.stringify(ongoingDonghua, null, 4)
    );

    console.log("Data extraction and saving successful");
    return ongoingDonghua;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default ongoingDonghua;
