import { MongoClient } from "mongodb";
import { prisma } from "@prepi/db";

const mongoUri = process.env.MONGO_URI;
const blobUrl = process.env.VERCEL_BLOB_URL;

const deSlugify = (slug: string) => {
  return correctSlug(slug)
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const correctSlug = (slug: string) => {
  return slug.replace(/_/g, "-");
};

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
      const { title, html, raw, tag, subTags } = page;

      const tags = [];

      const firstTag = await prisma.tag.upsert({
        where: { slug: correctSlug(tag) },
        update: {},
        create: { name: deSlugify(tag), slug: correctSlug(tag) },
      });

      tags.push(firstTag.id);

      if (subTags) {
        for (const subTag of subTags) {
          const tag = await prisma.tag.upsert({
            where: { slug: correctSlug(subTag) },
            update: {},
            create: {
              name: deSlugify(subTag),
              slug: correctSlug(subTag),
              parentId: firstTag.id,
            },
          });
          tags.push(tag.id);
        }
      }

      await prisma.lesson.create({
        data: {
          title,
          slug: (title as string).toLowerCase().trim().replace(/\s+/g, "-"),
          legacyContent: {
            create: {
              raw: raw,
              html: html
                .replace(
                  /\/public\/uploads\/(\w+)\.PNG/g,
                  `${blobUrl}/legacy_uploads/$1.PNG`,
                )
                .replace(
                  /\/public\/uploads\/(\w+)\.png/g,
                  `${blobUrl}/legacy_uploads/$1.png`,
                ),
            },
          },
          tags: {
            connect: tags.map((tagId) => ({ id: tagId })),
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
