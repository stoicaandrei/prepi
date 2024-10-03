import { MongoClient, ObjectId } from "mongodb";
import { ExamType, prisma } from "@prepi/db";

const mongoUri = process.env.MONGO_URI;

const variantSourceToType: Record<string, ExamType> = {
  bac: ExamType.SUBIECT,
  model: ExamType.MODEL,
  simulare: ExamType.SIMULARE,
};

const getExamName = (variant: any) => {
  const difficulty = "M1";
  const type = variantSourceToType[variant.source];
  const year = variant.bacYear;
  const month = variant.bacSession;
  const variantNumber = variant.bacVariant;

  let title = "";
  if (type === "MODEL") title += "Model și rezolvare";
  if (type === "SIMULARE") title += "Simulare și rezolvare";
  if (type === "SUBIECT") title += "Subiect și rezolvare";

  title += ` ${difficulty}`;

  if (month) title += ` ${month}`;
  if (year) title += ` ${year}`;
  if (variantNumber) title += ` (Varianta ${variantNumber})`;

  console.log(title);

  return title;
};

const getExamSlug = (variant: any) => {
  const difficulty = "M1";
  const type = variantSourceToType[variant.source];
  const year = variant.bacYear;
  const month = variant.bacSession;
  const variantNumber = variant.bacVariant;
  let slug = `${difficulty}`;
  if (year) slug += `-${year}`;
  if (month) slug += `-${month}`;
  if (variantNumber) slug += `-${variantNumber}`;
  slug += `-${type}`;

  return slug;
};

// Migrates all "variants" from the old MongoDB database to the new Prisma database
// in "ExamModel" format
async function migrateData() {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }

  const mongoClient = new MongoClient(mongoUri);

  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    const db = mongoClient.db();

    const variantsCollections = db.collection("variants");
    const problemsCollections = db.collection("problems");
    const variants = await variantsCollections.find({}).toArray();

    console.log(`Found ${variants.length} variants to migrate`);

    for (const variant of variants) {
      console.log(`Migrating variant ${variant._id}`);

      const exam = await prisma.exam.create({
        data: {
          difficulty: "M1",
          type: variantSourceToType[variant.source],
          year: variant.bacYear,
          month: variant.bacSession ?? undefined,
          variantNumber: variant.bacVariant,
          slug: getExamSlug(variant),
          title: getExamName(variant),
        },
      });

      console.log(`Created exam ${exam.id}`);

      const mongoProblems = await problemsCollections
        .find({
          _id: {
            $in: variant.problemIds.map((id: string) => new ObjectId(id)),
          },
        })
        .toArray();

      console.log(
        `Found ${mongoProblems.length} problems for variant ${variant._id}`,
      );

      const sub1Problems = mongoProblems
        .filter((problem) => problem.bacSection === 1)
        .sort((a, b) => a.bacNumber - b.bacNumber);
      const sub2Problems = mongoProblems
        .filter((problem) => problem.bacSection === 2)
        .sort((a, b) => a.bacNumber - b.bacNumber);
      const sub3Problems = mongoProblems
        .filter((problem) => problem.bacSection === 3)
        .sort((a, b) => a.bacNumber - b.bacNumber);

      for (let i = 0; i < sub1Problems.length; i++) {
        const problem = sub1Problems[i];

        await prisma.examProblem.create({
          data: {
            exam1: {
              connect: {
                id: exam.id,
              },
            },
            order: i,
            description: problem.description2.text,
            explanation: problem.explanation.text,
          },
        });
      }

      for (let i = 0; i < sub2Problems.length; i++) {
        const problem = sub2Problems[i];

        await prisma.examProblem.create({
          data: {
            exam2: {
              connect: {
                id: exam.id,
              },
            },
            order: i,
            description: problem.description2.text,
            subA: {
              create: {
                description: problem.subA.description.text,
                explanation: problem.subA.explanation.text,
              },
            },
            subB: {
              create: {
                description: problem.subB.description.text,
                explanation: problem.subB.explanation.text,
              },
            },
            subC: {
              create: {
                description: problem.subC.description.text,
                explanation: problem.subC.explanation.text,
              },
            },
          },
        });
      }

      for (let i = 0; i < sub3Problems.length; i++) {
        const problem = sub3Problems[i];

        await prisma.examProblem.create({
          data: {
            exam3: {
              connect: {
                id: exam.id,
              },
            },
            order: i,
            description: problem.description2.text,
            subA: {
              create: {
                description: problem.subA.description.text,
                explanation: problem.subA.explanation.text,
              },
            },
            subB: {
              create: {
                description: problem.subB.description.text,
                explanation: problem.subB.explanation.text,
              },
            },
            subC: {
              create: {
                description: problem.subC.description.text,
                explanation: problem.subC.explanation.text,
              },
            },
          },
        });
      }
    }

    console.log("Migration complete");

    // You can add more collections to migrate here
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
  }
}

export default migrateData;
