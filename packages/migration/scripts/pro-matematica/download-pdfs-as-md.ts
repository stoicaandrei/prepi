import fs from "fs/promises";
import path from "path";
import axios from "axios";

import scrapedData from "./scraped_data.json";

import { convertPdfToMd } from "../../mathpix.utils";

async function writeMdFile(url: string, outputPath: string) {
  try {
    const mdContent = await convertPdfToMd(url);
    await fs.writeFile(outputPath, mdContent);
    console.log(`Downloaded: ${outputPath}`);
  } catch (error) {
    console.error(`Error downloading ${url}: ${error}`);
  }
}

async function createDirectory(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dirPath}: ${error}`);
  }
}

export default async function downloadPDFs() {
  try {
    // Create a base directory for all downloads
    const baseDir = path.join(process.cwd(), "downloads");
    await createDirectory(baseDir);

    // Iterate through each year
    for (const yearData of scrapedData) {
      const yearDir = path.join(baseDir, yearData.year);
      await createDirectory(yearDir);

      // Iterate through each session
      for (const session of yearData.sessions) {
        const sessionDir = path.join(yearDir, session.name);
        await createDirectory(sessionDir);

        // Download each PDF
        for (const link of session.links) {
          const fileName = path.basename(link).replace(".pdf", ".md");
          const filePath = path.join(sessionDir, fileName);
          await writeMdFile(link, filePath);
        }
      }
    }

    console.log("All PDFs have been downloaded and organized.");
  } catch (error) {
    console.error("Error in downloadPDFs:", error);
  }
}
