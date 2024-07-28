import axios from "axios";
import Cheerio from "cheerio";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

// Determine the environment
const isLocal = process.env.NODE_ENV !== 'production'; // Assume 'production' means hosting environment

// Set the server URL based on the environment
const serverRunningOn = isLocal 
    ? 'http://localhost:4444' // Your local URL
    : 'https://otaku-api.vercel.app'; // Your hosting URL

const { ANIME_BASEURL } = process.env;

// Define the directory to save images
const __dirname = path.resolve();
const imagesDir = path.join(__dirname, '/public/images');

// Ensure the images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download an image and save it locally
const downloadImage = async (url, filepath) => {
  const writer = fs.createWriteStream(filepath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const ongoingAnime = async ({ page }) => {
  try {
    const response = await axios.get(
      `${ANIME_BASEURL}/ongoing-anime/page/${page}`
    );

    let ongoingAnime = {
      status: "Ok",
      data: [],
      pagination: {},
    };

    if (response.status === 200) {
      const ongoingHtml = response.data;
      const $ = Cheerio.load(ongoingHtml);

      $("div.venutama div.rseries div.rapi:first div.venz ul li").each(
        async function () {
          const title = $(this)
            .find("div.detpost div.thumb div.thumbz h2")
            .text()
            .trim();
          const slug = $(this)
            .find("div.detpost div.thumb a")
            .attr("href")
            ?.replace(`${ANIME_BASEURL}/anime/`, "")
            .replace("/", "");

          const originalPoster = $(this)
            .find("div.detpost div.thumb div.thumbz img")
            .attr("src");

          const posterFilename = path.basename(originalPoster);
          const localPosterPath = path.join(imagesDir, posterFilename);
          
          if (!fs.existsSync(localPosterPath)) {
            await downloadImage(originalPoster, localPosterPath);
          }

          const posterUrl = `${serverRunningOn}/images/${posterFilename}`;

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

          const originalUrlExample = $(this)
            .find("div.detpost div.thumb a")
            .attr("href");
          const url_example = originalUrlExample.replace(
            `${ANIME_BASEURL}`,
            `${serverRunningOn}`
          );

          ongoingAnime.data.push({
            title,
            slug,
            poster: posterUrl,
            current_episode,
            day_release,
            date_release,
            url_example,
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
