import { prisma } from "@prepi/db";

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

// Corrects the "slug" field for every relevant model
async function migrateData() {
  try {
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    console.log(`Found ${lessons.length} lessons to migrate`);

    for (const lesson of lessons) {
      console.log(`Migrating lesson: ${lesson.id}`);
      const { title } = lesson;

      const slug = slugify(title);

      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          slug,
        },
      });
    }

    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    console.log(`Found ${subjects.length} subjects to migrate`);

    for (const subject of subjects) {
      console.log(`Migrating subject: ${subject.id}`);
      const { name } = subject;

      const slug = slugify(name);

      await prisma.subject.update({
        where: { id: subject.id },
        data: {
          slug,
        },
      });
    }

    const subjectCategories = await prisma.subjectCategory.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    console.log(
      `Found ${subjectCategories.length} subject categories to migrate`,
    );

    for (const subjectCategory of subjectCategories) {
      console.log(`Migrating subject category: ${subjectCategory.id}`);
      const { name } = subjectCategory;

      const slug = slugify(name);

      await prisma.subjectCategory.update({
        where: { id: subjectCategory.id },
        data: {
          slug,
        },
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
