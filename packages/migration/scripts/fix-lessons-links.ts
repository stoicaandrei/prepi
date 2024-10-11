import { MongoClient } from "mongodb";
import { prisma } from "@prepi/db";

const mongoUri = process.env.MONGO_URI;

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove non-word characters (except hyphens)
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Trim hyphens from start
    .replace(/-+$/, ""); // Trim hyphens from end
}

// Fixes lessons links from old ids to new slugs
async function migrateData() {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }

  const mongoClient = new MongoClient(mongoUri);
  console.log("Connecting to MongoDB", mongoUri);

  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    const db = mongoClient.db();

    const pagesCollection = db.collection("pages");
    const pages = await pagesCollection.find().toArray();

    const legacyContents = await prisma.lessonLegacyContent.findMany();

    console.log(`Found ${legacyContents.length} lessons to migrate`);

    for (const legacyContent of legacyContents) {
      console.log(`Migrating lesson: ${legacyContent.lessonId}`);
      // link format is
      // <a href="/page/5beafd30830c8d00162b731b" target="_blank">Dacă noțiunea de integrală este necunoscută, accesați aici lecția introductivă.</a>
      const { html } = legacyContent;
      const newHtml = html.replace(/\/page\/[0-9a-f]{24}/g, (match) => {
        const id = match.split("/").pop();
        const page = pages.find((page) => page._id.toString() === id);
        if (!page) {
          console.error(`Page not found: ${id}`);
          return match;
        }

        const slug = slugify(page.title);
        console.log(`Migrating page: ${id} to ${slug}`);

        return `/lessons/${slug}`;
      });

      await prisma.lessonLegacyContent.update({
        where: {
          id: legacyContent.id,
        },
        data: {
          html: newHtml,
        },
      });
    }

    console.log(`Migrated lessons`);

    // You can add more collections to migrate here
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
  }
}

export default migrateData;
