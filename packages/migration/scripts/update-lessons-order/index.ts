import lessonList from "./lessonsList.json";
import { prisma } from "@prepi/db";

// Script to match vimeo videos to db video folder names
async function migrateData() {
  try {
    const chapters = lessonList.chapters;
    console.log(`${chapters.length} chapters to migrate`);

    for (const chapter of chapters) {
      console.log(`Migrating chapter ${chapter.title}`);

      for (let i = 0; i < chapter.lessons.length; i++) {
        const lesson = chapter.lessons[i];
        console.log(`Migrating lesson ${lesson.title}`);

        const dbLesson = await prisma.lesson.findFirst({
          where: {
            title: lesson.title,
          },
        });

        if (!dbLesson) {
          console.log(`Lesson ${lesson.title} not found in db`);
          continue;
        }

        await prisma.lesson.update({
          where: {
            id: dbLesson.id,
          },
          data: {
            order: i,
          },
        });
      }
    }

    console.log("Migration complete");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default migrateData;
