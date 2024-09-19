import { prisma } from "@prepi/db";

const subjectsHierarchy = {
  "Ecuații și Inecuații": [
    "Progresii",
    "Funcții",
    "Matrice",
    "Geometrie",
    "Permutări",
    "Combinatorică",
  ],
  Progresii: ["Șiruri"],
  Șiruri: [],
  Funcții: ["Limite"],
  Limite: ["Asimptote", "Derivate"],
  Asimptote: [],
  Derivate: ["Primitive"],
  Primitive: ["Integrale"],
  Integrale: [],
  Matrice: ["Grupuri", "Sisteme de Ecuații"],
  Grupuri: ["Inele și Corpuri"],
  "Inele și Corpuri": [],
  "Sisteme de Ecuații": [],
  Geometrie: [],
  Combinatorică: [],
  Permutări: [],
};

async function createSubject(name: string, level: number) {
  return prisma.subject.create({
    data: {
      name,
      level,
    },
  });
}

async function createPrerequisiteRelation(
  subjectId: string,
  prerequisiteForId: string
) {
  return prisma.subject.update({
    where: { id: subjectId },
    data: {
      prerequisiteFor: {
        connect: { id: prerequisiteForId },
      },
    },
  });
}

function calculateLevel(
  subject: string,
  hierarchy: Record<string, string[]>
): number {
  let maxLevel = 0;
  for (const [potentialPrereq, prerequisitesFor] of Object.entries(hierarchy)) {
    if (prerequisitesFor.includes(subject)) {
      maxLevel = Math.max(maxLevel, calculateLevel(potentialPrereq, hierarchy));
    }
  }
  return maxLevel + 1;
}

// Seeds the "subjects" collection with the default subjects
async function migrateData() {
  try {
    const subjectMap = new Map<string, { id: string; level: number }>();

    // Create subjects
    for (const [subject, prerequisitesFor] of Object.entries(
      subjectsHierarchy
    )) {
      const level = calculateLevel(subject, subjectsHierarchy);
      const createdSubject = await createSubject(subject, level);
      subjectMap.set(subject, { id: createdSubject.id, level });
    }

    // Create prerequisite relationships
    for (const [subject, prerequisitesFor] of Object.entries(
      subjectsHierarchy
    )) {
      const subjectId = subjectMap.get(subject)!.id;
      for (const prerequisiteFor of prerequisitesFor) {
        const prerequisiteForId = subjectMap.get(prerequisiteFor)!.id;
        await createPrerequisiteRelation(subjectId, prerequisiteForId);
      }
    }

    console.log("Database generation completed.");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default migrateData;
