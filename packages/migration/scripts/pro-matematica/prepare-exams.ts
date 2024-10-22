import fs from "fs";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { ExamProblemCategory, ExamSubproblemCategory, prisma } from "@prepi/db";

import { convertPdfToMd } from "../../mathpix.utils";

import exams from "./categorized_exams.json";

type Exam = {
  examLink: string;
  solutionLink: string;

  name: string;
  year: string;
  session: string;

  profile: string;
  level: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pdfsRoot =
  "/Users/andreistoica/Documents/Projects/prepi/variante 2010-2024";
const markdownsRoot =
  "/Users/andreistoica/Documents/Projects/prepi/variante 2010-2011 markdown";
const examsRoot = "/Users/andreistoica/Documents/Projects/prepi/exams";

const OfficialExplanation = z.object({
  text: z.string(),
  points: z.number(),
});

const Problem = z.object({
  statement: z.string(),
  points: z.number(),
  officialExplanation: z.array(OfficialExplanation),
});

const Subproblem = z.object({
  statement: z.string(),
  points: z.number(),
  officialExplanation: z.array(OfficialExplanation),
});

const ExtendedProblem = z.object({
  statement: z.string(),
  points: z.number(),
  subA: Subproblem,
  subB: Subproblem,
  subC: Subproblem,
});

const aiSystem = fs.readFileSync(
  "/Users/andreistoica/Documents/Projects/prepi/prepi/packages/migration/scripts/pro-matematica/simpleProblemPrompt.md",
  "utf-8",
);

const aiSubproblemSystem = fs.readFileSync(
  "/Users/andreistoica/Documents/Projects/prepi/prepi/packages/migration/scripts/pro-matematica/complexProblemPrompt.md",
  "utf-8",
);

export default async function prepareExams() {
  if (!fs.existsSync(examsRoot)) {
    fs.mkdirSync(examsRoot);
  }

  for (const exam of exams) {
    console.log(`Preparing exam: ${exam.name}`);

    if (exam.level === "M3") {
      console.log(`Skipping M3 exam: ${exam.name}`);
      continue;
    }

    const examDir = `${examsRoot}/${exam.name}`;
    if (!fs.existsSync(examDir)) {
      fs.mkdirSync(examDir, { recursive: true });
    }

    console.log(`Verifying exam PDF: ${exam.examLink}`);
    const examPdfPath = `${examDir}/exam.pdf`;
    if (!fs.existsSync(examPdfPath)) {
      console.log(`Copying exam PDF: ${exam.examLink}`);

      const linkFile = exam.examLink.split("/").pop();
      const oldExamPdfPath = `${pdfsRoot}/${exam.year}/${exam.session}/${linkFile}`;
      fs.copyFileSync(oldExamPdfPath, examPdfPath);
    }

    console.log(`Verifying solution PDF: ${exam.solutionLink}`);
    const solutionPdfPath = `${examDir}/solution.pdf`;
    if (!fs.existsSync(solutionPdfPath)) {
      console.log(`Copying solution PDF: ${exam.solutionLink}`);

      const linkFile = exam.solutionLink.split("/").pop();
      const oldSolutionPdfPath = `${pdfsRoot}/${exam.year}/${exam.session}/${linkFile}`;
      fs.copyFileSync(oldSolutionPdfPath, solutionPdfPath);
    }

    console.log(`Verifying exam markdown: ${exam.examLink}`);
    const examMarkdownPath = `${examDir}/exam.md`;
    if (!fs.existsSync(examMarkdownPath)) {
      console.log(`Copying exam markdown: ${exam.examLink}`);

      const linkFile = exam.examLink.split("/").pop();
      const fileName = linkFile?.replace(".pdf", ".md");
      const oldExamMarkdownPath = `${markdownsRoot}/${exam.year}/${exam.session}/${fileName}`;

      if (fs.existsSync(oldExamMarkdownPath)) {
        fs.copyFileSync(oldExamMarkdownPath, examMarkdownPath);
      } else {
        console.log(`Converting exam PDF to markdown: ${exam.examLink}`);

        const md = await convertPdfToMd(exam.examLink);
        fs.writeFileSync(examMarkdownPath, md);
      }
    }

    console.log(`Verifying solution markdown: ${exam.solutionLink}`);
    const solutionMarkdownPath = `${examDir}/solution.md`;
    if (!fs.existsSync(solutionMarkdownPath)) {
      console.log(`Copying solution markdown: ${exam.solutionLink}`);

      const linkFile = exam.solutionLink.split("/").pop();
      const fileName = linkFile?.replace(".pdf", ".md");
      const oldSolutionMarkdownPath = `${markdownsRoot}/${exam.year}/${exam.session}/${fileName}`;

      if (fs.existsSync(oldSolutionMarkdownPath)) {
        fs.copyFileSync(oldSolutionMarkdownPath, solutionMarkdownPath);
      } else {
        console.log(
          `Converting solution PDF to markdown: ${exam.solutionLink}`,
        );

        const md = await convertPdfToMd(exam.solutionLink);
        fs.writeFileSync(solutionMarkdownPath, md);
      }
    }

    const examMarkdown = fs.readFileSync(examMarkdownPath, "utf-8");
    const solutionMarkdown = fs.readFileSync(solutionMarkdownPath, "utf-8");

    const parseProblem = async (problemIndex: string) => {
      console.log(`Running chat for problem: ${problemIndex}`);
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o",
        temperature: 0.01,
        response_format: zodResponseFormat(Problem, "official_exam_problem"),
        messages: [
          { role: "system", content: aiSystem },
          {
            role: "user",
            content: examMarkdown,
          },
          { role: "assistant", content: "okay" },
          {
            role: "user",
            content: solutionMarkdown,
          },
          { role: "assistant", content: "okay" },
          { role: "user", content: problemIndex },
        ],
      });

      const totalTokens = completion.usage?.total_tokens;
      const cachedTokens =
        completion.usage?.prompt_tokens_details?.cached_tokens;
      console.log(
        `Completion for ${problemIndex} used ${totalTokens} tokens, ${cachedTokens} cached`,
      );

      const content = completion.choices[0].message.parsed;
      return content;
    };

    const parseExtendedProblem = async (problemIndex: string) => {
      console.log(`Running extended chat for problem: ${problemIndex}`);
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o",
        temperature: 0.01,
        response_format: zodResponseFormat(
          ExtendedProblem,
          "official_extended_exam_problem",
        ),
        messages: [
          { role: "system", content: aiSubproblemSystem },
          {
            role: "user",
            content: examMarkdown,
          },
          { role: "assistant", content: "okay" },
          {
            role: "user",
            content: solutionMarkdown,
          },
          { role: "assistant", content: "okay" },
          { role: "user", content: problemIndex },
        ],
      });

      const totalTokens = completion.usage?.total_tokens;
      const cachedTokens =
        completion.usage?.prompt_tokens_details?.cached_tokens;
      console.log(
        `Completion for ${problemIndex} used ${totalTokens} tokens, ${cachedTokens} cached`,
      );

      const content = completion.choices[0].message.parsed;
      return content;
    };

    console.log(`Verifying problems: ${exam.name}`);
    const problemsPath = `${examDir}/problems.json`;
    if (!fs.existsSync(problemsPath)) {
      console.log(`Parsing problems for exam: ${exam.name}`);
      const problems = await Promise.all([
        parseProblem("1.1"),
        parseProblem("1.2"),
        parseProblem("1.3"),
        parseProblem("1.4"),
        parseProblem("1.5"),
        parseProblem("1.6"),
        parseExtendedProblem("2.1"),
        parseExtendedProblem("2.2"),
        parseExtendedProblem("3.1"),
        parseExtendedProblem("3.2"),
      ]);

      fs.writeFileSync(
        `${examDir}/problems.json`,
        JSON.stringify(problems, null, 2),
      );
    }

    type ProblemType =
      | z.infer<typeof Problem>
      | z.infer<typeof ExtendedProblem>;
    const problems: ProblemType[] = JSON.parse(
      fs.readFileSync(problemsPath, "utf-8"),
    );

    const existingExam = await prisma.exam.findFirst({
      where: {
        slug: exam.name,
      },
    });

    if (existingExam) {
      console.log(`Exam already exists in db: ${exam.name}`);
      return;
    }

    console.log(`Creating exam in db: ${exam.name}`);
    const examModel = await prisma.exam.create({
      data: {
        difficulty: exam.level as any,
        profile: exam.profile.replace("-", "_") as any,
        year: Number.parseInt(exam.year),
        slug: exam.name,
        title: exam.name,

        examSourceFiles: {
          create: {
            examPdfUrl: exam.examLink,
            examMD: examMarkdown,
            solutionPdfUrl: exam.solutionLink,
            solutionMD: solutionMarkdown,
          },
        },
      },
    });

    console.log(`Creating problems in db: ${exam.name}`);
    for (let i = 0; i < problems.length; i++) {
      console.log(`Creating problem ${i + 1} in db: ${exam.name}`);
      const problem = problems[i];
      let category: ExamProblemCategory = ExamProblemCategory.SUB1;
      let order: number = i + 1;
      if (order <= 6) {
        category = ExamProblemCategory.SUB1;
      } else if (order <= 8) {
        category = ExamProblemCategory.SUB2;
        order = i - 6;
      } else {
        category = ExamProblemCategory.SUB3;
        order = i - 8;
      }

      const problemModel = await prisma.examProblem.create({
        data: {
          examId: examModel.id,
          category,
          order,
          points: problem.points,
          description: problem.statement,
        },
      });

      if ("officialExplanation" in problem) {
        let index = 0;
        for (const explanation of problem.officialExplanation) {
          await prisma.examProblemOfficialSolutionStep.create({
            data: {
              examProblemId: problemModel.id,
              points: explanation.points,
              content: explanation.text,
              stepNumber: index,
            },
          });
          index++;
        }
      }

      if ("subA" in problem) {
        const subA = problem.subA;
        const subAProblemModel = await prisma.examProblem.create({
          data: {
            examId: examModel.id,
            parentId: problemModel.id,
            category,
            subcategory: ExamSubproblemCategory.A,
            order: order,
            points: subA.points,
            description: subA.statement,
          },
        });

        let index = 0;
        for (const explanation of subA.officialExplanation) {
          await prisma.examProblemOfficialSolutionStep.create({
            data: {
              examProblemId: subAProblemModel.id,
              points: explanation.points,
              content: explanation.text,
              stepNumber: index,
            },
          });
          index++;
        }
      }

      if ("subB" in problem) {
        const subB = problem.subB;
        const subBProblemModel = await prisma.examProblem.create({
          data: {
            examId: examModel.id,
            parentId: problemModel.id,
            category,
            subcategory: ExamSubproblemCategory.B,
            order: order,
            points: subB.points,
            description: subB.statement,
          },
        });

        let index = 0;
        for (const explanation of subB.officialExplanation) {
          await prisma.examProblemOfficialSolutionStep.create({
            data: {
              examProblemId: subBProblemModel.id,
              points: explanation.points,
              content: explanation.text,
              stepNumber: index,
            },
          });
          index++;
        }
      }

      if ("subC" in problem) {
        const subC = problem.subC;
        const subCProblemModel = await prisma.examProblem.create({
          data: {
            examId: examModel.id,
            parentId: problemModel.id,
            category,
            subcategory: ExamSubproblemCategory.C,
            order: order,
            points: subC.points,
            description: subC.statement,
          },
        });

        let index = 0;
        for (const explanation of subC.officialExplanation) {
          await prisma.examProblemOfficialSolutionStep.create({
            data: {
              examProblemId: subCProblemModel.id,
              points: explanation.points,
              content: explanation.text,
              stepNumber: index,
            },
          });
          index++;
        }
      }
    }

    return;
  }
}
