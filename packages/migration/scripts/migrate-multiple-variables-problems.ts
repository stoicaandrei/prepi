import { prisma, ProblemType } from "@prepi/db";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI;

// Migrates multiple varibales problems from mongo to postgres
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
    const problems = await problemsCollection.find({ answerType: 2 }).toArray();

    console.log(`Found ${problems.length} problems to migrate`);

    for (const problem of problems) {
      const existingProblem = await prisma.problem.findFirst({
        where: { legacyId: problem._id.toString() },
      });

      if (existingProblem) {
        console.log(`Skipping ${problem._id}, already migrated`);
        continue;
      }

      console.log(`Migrating problem: ${problem._id}`);

      const subjects = await prisma.subject.findMany({
        where: {
          slug: {
            in: (problem.tags as string[]).map((t) => t.replace(/_/g, "-")),
          },
        },
      });

      let source = "archive";
      if (problem.source === "model") {
        const { bacYear, bacVariant, bacSession, bacNumber, bacSection } =
          problem;
        source = `bac-${bacYear}-${bacVariant}-${bacSession}-${bacNumber}-${bacSection}`;
      }

      await prisma.problem.create({
        data: {
          description: problem.description ?? problem.description2.text,
          legacyId: problem._id.toString(),
          source,
          type: ProblemType.MULTIPLE_VARIABLES,
          difficulty: problem.difficulty ?? 1,
          subjects: {
            connect: subjects.map((subject) => ({ id: subject.id })),
          },
          variables: {
            create: Object.entries(problem.answer).map(([key, value]) => ({
              variableName: key,
              correctAnswer: value as string,
            })),
          },
          hints: {
            create: (problem.stepByStep as string[]).map((step, index) => ({
              content: step,
              order: index,
            })),
          },
          explanation: {
            create: {
              content: problem.explanation.text,
            },
          },
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
