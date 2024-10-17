import axios from "axios";
import * as cheerio from "cheerio";
import { writeFile } from "fs/promises";
import path from "path";

const baseUrl = "https://www.pro-matematica.ro/bacalaureat/";

interface Session {
  name: string;
  links: string[];
}

interface YearData {
  year: string;
  url: string;
  sessions: Session[];
}

export default async function () {
  const results: YearData[] = [];

  for (let year = 2010; year <= 2024; year++) {
    const url = `${baseUrl}${year}.php`;

    try {
      console.log(`Scraping data for year ${year}...`);

      // Make an HTTP request to the website
      const response = await axios.get(url);

      // Parse the HTML content
      const $ = cheerio.load(response.data);

      // Find the specific section
      const section = $("section.clear");

      // Extract the year from the h2 tag
      const yearFromPage = section.find("h2").text().trim();

      // Initialize an array to store sessions and their links
      const sessions: Session[] = [];

      // Find all bold tags (session names) and process the links that follow
      section.find("b").each((_, elem) => {
        const sessionName = $(elem).text().trim();
        const links: string[] = [];

        let next = $(elem).next();
        while (next.length && next[0].name !== "b") {
          if (next[0].name === "a") {
            const link = $(next).attr("href");
            if (link) {
              const absoluteLink = new URL(link, url).href;
              links.push(absoluteLink);
            }
          }
          next = next.next();
        }

        if (links.length > 0) {
          sessions.push({ name: sessionName, links });
        }
      });

      results.push({
        year: yearFromPage,
        url,
        sessions,
      });

      console.log(`Successfully scraped data for year ${year}`);
    } catch (error: any) {
      console.error(
        `An error occurred while scraping year ${year}:`,
        error.message,
      );
      results.push({
        year: year.toString(),
        url,
        sessions: [],
      });
    }

    // Add a small delay between requests to be respectful to the server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Log the final results
  console.log("Scraping completed. Results:", JSON.stringify(results, null, 2));

  // Write results to a JSON file
  try {
    const outputPath = path.join(process.cwd(), "scraped_data.json");
    await writeFile(outputPath, JSON.stringify(results, null, 2));
    console.log(`Data has been written to ${outputPath}`);
  } catch (error) {
    console.error("Error writing to file:", error);
  }

  return results;
}
