import { prisma } from "@prepi/db";

// Migrates lessons from beings linked by tags to being linked by subjects
async function migrateData() {
  try {
    await prisma.$transaction(
      async (tx) => {
        const lessons = await tx.lesson.findMany({
          select: {
            tags: true,
            id: true,
            title: true,
          },
        });
        console.log(`Found ${lessons.length} lessons to migrate`);

        for (const lesson of lessons) {
          console.log(`Migrating lesson: ${lesson.title}`);
          const tags = lesson.tags;
          const subjects = await tx.subject.findMany({
            where: {
              slug: {
                in: tags.map((tag) => tag.slug),
              },
            },
          });
          const subjectCategory = await tx.subjectCategory.findFirst({
            where: {
              slug: {
                in: tags.map((tag) => tag.slug),
              },
            },
          });

          console.log(`Found ${subjects.length} subjects for lesson`);

          await tx.lesson.update({
            where: { id: lesson.id },
            data: {
              subjects: {
                connect: subjects.map((subject) => ({ id: subject.id })),
              },
              subjectCategory: {
                connect: { id: subjectCategory!.id },
              },
            },
          });
        }
      },
      {
        timeout: 60 * 1000 * 5,
      }
    );

    console.log("Migration complete");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default migrateData;
