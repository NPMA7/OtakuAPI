import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
dotenv.config();

const { DONGHUA_BASEURL } = process.env;

const genresDonghua = async () => {
  try {
    const genreResponse = await axios.get(`${DONGHUA_BASEURL}`);
    let genresDonghua = {
      status: "Ok",
      data: [],
    };
    if (genreResponse.status === 200) {
      const genresHtml = genreResponse.data;
      const $ = cheerio.load(genresHtml);
      $("div.section ul.genre li").each(function () {
        const name = $(this).find("a").text().trim();
        const slug = $(this)
          .find("a")
          .attr("href")
          ?.replace(`${DONGHUA_BASEURL}/genres/`, "")
          .replace("/", "");
        const url = $(this).find("a").attr("href");

        genresDonghua.data.push({
          name,
          slug,
          url,
        });
      });
    }

    console.log("Fetching Success");
    return genresDonghua;
  } catch (error) {
    console.error("Error fetching the URL:", error);
    throw error;
  }
};

export default genresDonghua;
