import { prisma, ProblemType } from "@prepi/db";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI;

// Add buttons from the old MongoDB database to the new Prisma database
async function migrateData() {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }

  const mongoClient = new MongoClient(mongoUri);

  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    const db = mongoClient.db();

    const problemsCollection = db.collection("problems");
    const problems = await problemsCollection.find().toArray();

    console.log(`Found ${problems.length} problems to migrate`);

    for (const problem of problems) {
      const existingProblem = await prisma.problem.findFirst({
        where: { legacyId: problem._id.toString() },
      });

      if (!existingProblem) {
        console.log(`Skipping ${problem._id}, missing`);
        continue;
      }

      const oldButtons = problem.buttons as { display: string; code: string }[];

      const newButtons = [];

      for (const button of oldButtons) {
        const newButton = await prisma.mathSymbolButton.upsert({
          where: { symbol: button.code },
          update: {},
          create: {
            latex: button.display,
            symbol: button.code,
          },
        });
        newButtons.push(newButton);
      }

      await prisma.problem.update({
        where: { id: existingProblem.id },
        data: {
          mathSymbolButtons: {
            connect: newButtons.map((button) => ({ id: button.id })),
          },
        },
      });

      console.log(`Migrated buttons for problem ${problem._id}:`, newButtons);

      // if (existingProblem) {
      //   console.log(`Skipping ${problem._id}, already migrated`);
      //   continue;
      // }

      // console.log(`Migrating problem: ${problem._id}`);

      // const subjects = await prisma.subject.findMany({
      //   where: {
      //     slug: {
      //       in: (problem.tags as string[]).map((t) => t.replace(/_/g, "-")),
      //     },
      //   },
      // });

      // await prisma.problem.create({
      //   data: {
      //     description: problem.description,
      //     legacyId: problem._id.toString(),
      //     type: ProblemType.MULTIPLE_CHOICE,
      //     difficulty: problem.difficulty,
      //     subjects: {
      //       connect: subjects.map((subject) => ({ id: subject.id })),
      //     },
      //     multipleChoiceOptions: {
      //       create: (problem.multipleChoices as string[])
      //         .filter((s) => !!s)
      //         .map((choice, index) => ({
      //           text: choice,
      //           isCorrect: index === 0, // The first one is always the correct one
      //         })),
      //     },
      //     hints: {
      //       create: (problem.stepByStep as string[]).map((step, index) => ({
      //         content: step,
      //         order: index,
      //       })),
      //     },
      //     explanation: {
      //       create: {
      //         content: problem.explanation.text,
      //       },
      //     },
      //   },
      // });
    }

    console.log("Migration complete");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default migrateData;
