import { prisma } from "@prepi/db";

const blobUrl = process.env.VERCEL_BLOB_URL;
// Updates the "upload_url" for every attachment in the "lessons" collection html field
async function migrateData() {
  

  try {
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        html: true,
      }
    });

    console.log(`Found ${lessons.length} lessons to migrate`);

    for (const lesson of lessons) {
      console.log(`Migrating lesson: ${lesson.id}`);
      const { html } = lesson;

      const updatedHtml = html.replace(/\/public\/uploads\/(\w+)\.PNG/g, `${blobUrl}/legacy_uploads/$1.PNG`).replace(/\.PNG\&/g, ".PNG");

      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          html: updatedHtml,
        }
      });
    }

    console.log("Migration complete");

    // You can add more collections to migrate here
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default migrateData;
