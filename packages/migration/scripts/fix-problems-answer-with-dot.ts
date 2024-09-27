import { prisma, ProblemType } from "@prepi/db";

// Fixes problems with answer containing a dot at the end
async function migrateData() {
  try {
    const problems = await prisma.problem.findMany({
      where: {
        type: {
          not: ProblemType.MULTIPLE_CHOICE,
        },
      },
      select: {
        id: true,
        type: true,
        singleAnswer: true,
        variables: true,
      },
    });

    console.log(`Found ${problems.length} problems to migrate`);

    const singleAnswerProblems = problems.filter(
      (problem) => problem.type === ProblemType.SINGLE_ANSWER
    );
    const faultySingleAnswerProblems = singleAnswerProblems.filter((problem) =>
      problem.singleAnswer?.correctAnswer.endsWith(".")
    );

    console.log(
      `Found ${faultySingleAnswerProblems.length} problems with faulty single answers`
    );

    for (const problem of faultySingleAnswerProblems) {
      console.log(`Fixing problem: ${problem.id}`);
      if (!problem.singleAnswer) continue;

      await prisma.singleAnswer.update({
        where: { id: problem.singleAnswer.id },
        data: {
          correctAnswer: problem.singleAnswer.correctAnswer.slice(0, -1),
        },
      });
    }

    const multipleVariableProblems = problems.filter(
      (problem) => problem.type === ProblemType.MULTIPLE_VARIABLES
    );
    const faultyMultipleVariableProblems = multipleVariableProblems.filter(
      (problem) =>
        problem.variables?.some((variable) =>
          variable.correctAnswer.endsWith(".")
        )
    );

    console.log(
      `Found ${faultyMultipleVariableProblems.length} problems with faulty multiple variables`
    );
    console.log(faultyMultipleVariableProblems.map((p) => p.variables));

    console.log("Migration complete");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default migrateData;
