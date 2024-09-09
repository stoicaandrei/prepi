import { MongoClient } from "mongodb";
import { prisma } from "@prepi/db";

const mongoUri = process.env.MONGO_URI;

// Migrates all "pages" from the old MongoDB database to the new Prisma database
// in "Lesson" format
async function migrateData() {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }

  const mongoClient = new MongoClient(mongoUri);

  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    const db = mongoClient.db();

    const pagesCollection = db.collection("pages");
    const pages = await pagesCollection.find({}).toArray();

    console.log(`Found ${pages.length} pages to migrate`);

    for (const page of pages) {
      console.log(`Migrating page: ${page.title}`);
      const { title, html, tag, subTags } = page;

      const tags = [tag];

      const firstTag = await prisma.tag.upsert({
        where: { name: tag },
        update: {},
        create: { name: tag },
      });

      if (subTags) {
        for (const subTag of subTags) {
          tags.push(subTag);

          await prisma.tag.upsert({
            where: { name: subTag },
            update: {},
            create: { name: subTag },
          });
        }
      }

      await prisma.lesson.create({
        data: {
          title,
          slug: title.toLowerCase().replace(/\s+/g, "-"),
          html,
          tags: {
            connectOrCreate: tags.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
      });
    }

    console.log(`Migrated ${pages.length} lessons`);

    // You can add more collections to migrate here
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
  }
}

export default migrateData;
