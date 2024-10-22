import data from "./scraped_data.json";
import fs from "fs";

type Exam = {
  examLink: string;
  solutionLink: string;

  name: string;
  year: string;
  session: string;

  profile: string;
  level: string;
};

const extractProfileAndLevel = (
  examName: string,
): { profile: string; level: string } => {
  if (examName.includes("M1")) {
    return { profile: "M_mate-info", level: "M1" };
  }

  if (examName.includes("M2")) {
    return { profile: "M_st-nat", level: "M2" };
  }

  // M3 is missing

  if (examName.includes("M4")) {
    return { profile: "M_tehnologic", level: "M3" };
  }

  if (examName.includes("M_mate-info")) {
    return { profile: "M_mate-info", level: "M1" };
  }

  if (examName.includes("M_st-nat")) {
    return { profile: "M_st-nat", level: "M2" };
  }

  if (examName.includes("M_tehnologic")) {
    return { profile: "M_tehnologic", level: "M2" };
  }

  if (examName.includes("M_pedagogic")) {
    return { profile: "M_pedagogic", level: "M3" };
  }

  throw new Error(
    `Could not extract profile and level from session: ${examName}`,
  );
};

export default async function categorizeExams() {
  const exams: Exam[] = [];

  for (const year of data) {
    for (const session of year.sessions) {
      for (let i = 0; i < session.links.length; i += 2) {
        const examLink = session.links[i];
        const solutionLink = session.links[i + 1];

        const examName = examLink.split("/").pop()?.split(".")[0];

        if (!examName) {
          throw new Error(`Could not extract exam name from link: ${examLink}`);
        }

        const { profile, level } = extractProfileAndLevel(examName);

        exams.push({
          examLink,
          solutionLink,
          name: examName,
          session: session.name,
          year: year.year,
          profile,
          level,
        });
        console.log(`Finished processing ${examName}`);
      }
    }
  }

  fs.writeFileSync("categorized_exams.json", JSON.stringify(exams, null, 2));

  // check if the slug is unique
  const slugs = exams.map((exam) => exam.name);
  const uniqueSlugs = new Set(slugs);

  if (slugs.length !== uniqueSlugs.size) {
    throw new Error("Some slugs are not unique");
  }
}
