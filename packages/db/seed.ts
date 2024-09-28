import { PrismaClient, ProblemType } from "@prisma/client";

const prisma = new PrismaClient();

async function seedChaptersAndSubjects() {
  const chapters = [
    { name: "Algebra", slug: "algebra", order: 1 },
    { name: "Geometry", slug: "geometry", order: 2 },
    { name: "Calculus", slug: "calculus", order: 3 },
  ];

  for (const chapter of chapters) {
    const createdChapter = await prisma.subjectCategory.create({
      data: chapter,
    });

    const subjects = [
      {
        name: `Basic ${chapter.name}`,
        slug: `basic-${chapter.slug}`,
        order: 1,
        categoryId: createdChapter.id,
      },
      {
        name: `Intermediate ${chapter.name}`,
        slug: `intermediate-${chapter.slug}`,
        order: 2,
        categoryId: createdChapter.id,
      },
      {
        name: `Advanced ${chapter.name}`,
        slug: `advanced-${chapter.slug}`,
        order: 3,
        categoryId: createdChapter.id,
      },
    ];

    await prisma.subject.createMany({
      data: subjects,
    });
  }

  console.log("Chapters and subjects seeded successfully");
}

async function seedLessons() {
  const subjects = await prisma.subject.findMany();

  for (const subject of subjects) {
    const lessons = [
      {
        title: `Introduction to ${subject.name}`,
        slug: `intro-${subject.slug}`,
        subjectCategoryId: subject.categoryId,
        order: 1,
      },
      {
        title: `Core Concepts of ${subject.name}`,
        slug: `core-${subject.slug}`,
        subjectCategoryId: subject.categoryId,
        order: 2,
      },
      {
        title: `Advanced Topics in ${subject.name}`,
        slug: `advanced-${subject.slug}`,
        subjectCategoryId: subject.categoryId,
        order: 3,
      },
    ];

    for (const lesson of lessons) {
      const createdLesson = await prisma.lesson.create({
        data: {
          ...lesson,
          subjects: {
            connect: { id: subject.id },
          },
        },
      });

      await prisma.lessonLegacyContent.create({
        data: {
          html: `<p>This is the HTML content for ${lesson.title}</p>`,
          raw: `This is the raw content for ${lesson.title}`,
          lessonId: createdLesson.id,
        },
      });
    }
  }

  console.log("Lessons seeded successfully");
}

async function seedProblems() {
  const subjects = await prisma.subject.findMany();

  const plusButton = await prisma.mathSymbolButton.create({
    data: {
      symbol: "+",
      latex: "+",
    },
  });
  const minusButton = await prisma.mathSymbolButton.create({
    data: {
      symbol: "-",
      latex: "-",
    },
  });

  for (const subject of subjects) {
    const problems = [
      {
        type: ProblemType.MULTIPLE_CHOICE,
        description: `Multiple choice problem for ${subject.name}`,
        difficulty: 1,
        multipleChoiceOptions: {
          create: [
            { text: "Option A", isCorrect: true },
            { text: "Option B", isCorrect: false },
            { text: "Option C", isCorrect: false },
            { text: "Option D", isCorrect: false },
          ],
        },
      },
      {
        type: ProblemType.SINGLE_ANSWER,
        description: `Single answer problem for ${subject.name}`,
        difficulty: 2,
        singleAnswer: {
          create: { correctAnswer: "Correct answer" },
        },
      },
      {
        type: ProblemType.MULTIPLE_VARIABLES,
        description: `Multiple variables problem for ${subject.name}`,
        difficulty: 3,
        variables: {
          create: [
            { variableName: "x", correctAnswer: "5" },
            { variableName: "y", correctAnswer: "10" },
          ],
        },
      },
    ];

    for (const problem of problems) {
      await prisma.problem.create({
        data: {
          ...problem,
          subjects: {
            connect: { id: subject.id },
          },
          explanation: {
            create: { content: `Explanation for ${problem.description}` },
          },
          hints: {
            create: [
              { content: "Hint 1", order: 1 },
              { content: "Hint 2", order: 2 },
            ],
          },
          mathSymbolButtons: {
            connect: [{ id: plusButton.id }, { id: minusButton.id }],
          },
        },
      });
    }
  }

  console.log("Problems seeded successfully");
}

async function main() {
  await seedChaptersAndSubjects();
  await seedLessons();
  await seedProblems();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
