import { prisma } from "@prepi/db";

// Remove lesson title from html
async function migrateData() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        legacyContent: true,
      },
    });

    console.log(`${lessons.length} lessons to migrate`);

    for (const lesson of lessons) {
      console.log(`Migrating lesson ${lesson.slug}`);

      if (!lesson.legacyContent) {
        continue;
      }

      const html = lesson.legacyContent.html;

      const h1s = html.match(/<h1[^>]*>.*?<\/h1>/g) || [];

      const newHtml = html.replace(/<h1[^>]*>.*?<\/h1>/g, "");

      await prisma.lessonLegacyContent.update({
        where: {
          id: lesson.legacyContent.id,
        },
        data: {
          html: newHtml,
        },
      });
    }

    console.log("Migration complete");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default migrateData;
