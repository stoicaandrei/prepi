import {
  ExamDifficulty,
  ExamType,
  PrismaClient,
  ProblemType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function seedChaptersAndSubjects() {
  const chapters = [
    { name: "Algebra", slug: "algebra", order: 1 },
    { name: "Geometry", slug: "geometry", order: 2 },
    { name: "Calculus", slug: "calculus", order: 3 },
  ];

  for (const chapter of chapters) {
    // Create the chapter (subject category)
    const createdChapter = await prisma.subjectCategory.create({
      data: chapter,
    });

    // Create the Basic subject
    const basicSubject = await prisma.subject.create({
      data: {
        name: `Basic ${chapter.name}`,
        slug: `basic-${chapter.slug}`,
        order: 1,
        categoryId: createdChapter.id,
      },
    });

    // Create the Intermediate subject with Basic as a prerequisite
    const intermediateSubject = await prisma.subject.create({
      data: {
        name: `Intermediate ${chapter.name}`,
        slug: `intermediate-${chapter.slug}`,
        order: 2,
        categoryId: createdChapter.id,
        prerequisites: {
          connect: [{ id: basicSubject.id }],
        },
      },
    });

    // Create the Advanced subject with Intermediate as a prerequisite
    const advancedSubject = await prisma.subject.create({
      data: {
        name: `Advanced ${chapter.name}`,
        slug: `advanced-${chapter.slug}`,
        order: 3,
        categoryId: createdChapter.id,
        prerequisites: {
          connect: [{ id: intermediateSubject.id }],
        },
      },
    });
  }

  console.log("Chapters and subjects with prerequisites seeded successfully");
}

async function seedLessons() {
  const categories = await prisma.subjectCategory.findMany({
    include: {
      subjects: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  for (const category of categories) {
    let lessonOrder = 1;

    for (const subject of category.subjects) {
      const lessons = [
        {
          title: `Introduction to ${subject.name}`,
          slug: `intro-${subject.slug}`,
        },
        {
          title: `Core Concepts of ${subject.name}`,
          slug: `core-${subject.slug}`,
        },
        {
          title: `Advanced Topics in ${subject.name}`,
          slug: `advanced-${subject.slug}`,
        },
      ];

      for (const lesson of lessons) {
        const createdLesson = await prisma.lesson.create({
          data: {
            ...lesson,
            subjectCategoryId: category.id,
            order: lessonOrder,
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

        lessonOrder++;
      }
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

async function seedExams() {
  const exams = [
    {
      difficulty: ExamDifficulty.M1,
      type: ExamType.SUBIECT,
      year: 2024,
      month: "June",
      variantNumber: 1,
      slug: "exam-2024-june-variant-1",
      title: "Exam June 2024 Variant 1",
    },
    {
      difficulty: ExamDifficulty.M2,
      type: ExamType.SIMULARE,
      year: 2024,
      month: "March",
      variantNumber: 2,
      slug: "exam-2024-march-variant-2",
      title: "Simulated Exam March 2024 Variant 2",
    },
  ];

  for (const exam of exams) {
    const createdExam = await prisma.exam.create({
      data: exam,
    });

    // Create 5 sub1 problems for each exam
    for (let i = 1; i <= 5; i++) {
      await prisma.examProblem.create({
        data: {
          description: `Description for sub1 problem ${i} of ${createdExam.title}`,
          order: i,
          exam1Id: createdExam.id,
        },
      });
    }

    // Create 2 sub2 problems with sub a, b, c each
    for (let i = 1; i <= 2; i++) {
      const createdProblem = await prisma.examProblem.create({
        data: {
          description: `Description for sub2 problem ${i} of ${createdExam.title}`,
          order: i,
          exam2Id: createdExam.id,
        },
      });

      for (const sub of ["A", "B", "C"]) {
        await prisma.examSubproblem.create({
          data: {
            description: `Description for sub2 problem ${i} sub ${sub} of ${createdExam.title}`,
            explanation: `Explanation for sub2 problem ${i} sub ${sub} of ${createdExam.title}`,
            [`parent${sub}`]: { connect: { id: createdProblem.id } },
          },
        });
      }
    }

    // Create 2 sub3 problems with sub a, b, c each
    for (let i = 1; i <= 2; i++) {
      const createdProblem = await prisma.examProblem.create({
        data: {
          description: `Description for sub3 problem ${i} of ${createdExam.title}`,
          order: i,
          exam3Id: createdExam.id,
        },
      });

      for (const sub of ["A", "B", "C"]) {
        await prisma.examSubproblem.create({
          data: {
            description: `Description for sub3 problem ${i} sub ${sub} of ${createdExam.title}`,
            explanation: `Explanation for sub3 problem ${i} sub ${sub} of ${createdExam.title}`,
            [`parent${sub}`]: { connect: { id: createdProblem.id } },
          },
        });
      }
    }
  }

  console.log("Exams seeded successfully");
}

async function main() {
  await seedChaptersAndSubjects();
  await seedLessons();
  await seedProblems();
  await seedExams();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
