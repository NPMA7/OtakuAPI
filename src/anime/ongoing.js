import axios from "axios";
import Cheerio from "cheerio";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

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

// Cache for already downloaded posters
const downloadedPosters = new Set(fs.readdirSync(imagesDir));

// Function to check for ongoing anime and download new posters
const checkOngoingAnime = async (page) => {
  try {
    const response = await axios.get(`${ANIME_BASEURL}/ongoing-anime/page/${page}`);

    if (response.status === 200) {
      const ongoingHtml = response.data;
      const $ = Cheerio.load(ongoingHtml);

      $("div.venutama div.rseries div.rapi:first div.venz ul li").each(async function () {
        const originalPoster = $(this).find("div.detpost div.thumb div.thumbz img").attr("src");
        const posterFilename = path.basename(originalPoster);
        const localPosterPath = path.join(imagesDir, posterFilename);

        if (!downloadedPosters.has(posterFilename)) {
          await downloadImage(originalPoster, localPosterPath);
          downloadedPosters.add(posterFilename);
          console.log(`Downloaded new poster: ${posterFilename}`);
        }
      });
    }
  } catch (error) {
    console.error("Error fetching the URL:", error);
  }
};

// API Handler
export default async function handler(req, res) {
  try {
    await checkOngoingAnime(1); // or loop through multiple pages
    res.status(200).send('Anime check completed successfully.');
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).send('An error occurred.');
  }
}
