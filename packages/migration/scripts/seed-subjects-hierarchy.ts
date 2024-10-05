import { prisma, Subject } from "@prepi/db";

const subjectsPrerequisites = {
  multimi: [],
  "partea-intreaga-si-partea-fractionara": ["multimi"],
  "modulul-unui-numar-real": ["multimi"],
  radicali: ["multimi"],
  exponentiale: ["radicali"],
  logaritmi: ["exponentiale"],
  "numere-complexe": ["radicali"],
  "ecuatii-si-inecuatii-de-gradul-al-doilea": [
    "modulul-unui-numar-real",
    "radicali",
  ],
  siruri: ["multimi"],
  "siruri-date-prin-formule-de-recurenta": ["siruri"],
  "progresii-aritmetice": ["siruri"],
  "progresii-geometrice": ["siruri", "exponentiale"],
  "functia-liniara": ["multimi"],
  "compunerea-functiilor": ["functia-liniara"],
  "functia-de-gradul-al-doilea": ["functia-liniara"],
  "functia-radical": ["functia-liniara", "radicali"],
  "functia-exponentiala": ["functia-liniara", "exponentiale"],
  "functia-logaritm": ["functia-liniara", "logaritmi"],
  "functii-trigonometrice": ["functia-liniara", "trigonometrie"],
  asimptote: ["functia-liniara", "limite-de-functii"],
  "limite-de-siruri": ["siruri"],
  "limite-de-functii": ["functia-liniara", "limite-de-siruri"],
  "studiul-functiilor": ["functia-liniara", "derivata-unei-functii"],
  "derivata-unei-functii": ["limite-de-functii"],
  "puncte-de-extrem": ["derivata-unei-functii"],
  "derivata-de-gradul-al-doilea": ["derivata-unei-functii"],
  "concavitate-convexitate": ["derivata-de-gradul-al-doilea"],
  "regulile-lui-l-hospital": ["derivata-unei-functii", "limite-de-functii"],
  "calculul-de-primitive": ["derivata-unei-functii"],
  "integrare-prin-parti": ["calculul-de-primitive"],
  "schimbari-de-variabila": ["calculul-de-primitive"],
  "primitive-trigonometrice": [
    "calculul-de-primitive",
    "functii-trigonometrice",
  ],
  "integrale-definite": ["calculul-de-primitive"],
  "formula-leibniz-newton": ["integrale-definite"],
  "proprietati-ale-inegralei": ["integrale-definite"],
  "aplicatii-ale-integralei-definite": ["integrale-definite"],
  "operatii-cu-matrice": [],
  determinanti: ["operatii-cu-matrice"],
  "inversa-unei-matrice": ["operatii-cu-matrice", "determinanti"],
  "rangul-unei-matrice": ["operatii-cu-matrice"],
  monoizi: ["multimi"],
  grupuri: ["monoizi"],
  "proprietati-ale-grupurilor": ["grupuri"],
  subgrupuri: ["grupuri"],
  "grupuri-finite": ["grupuri"],
  "morfisme-de-grupuri": ["grupuri"],
  "izomorfisme-de-grupuri": ["morfisme-de-grupuri"],
  inele: ["grupuri"],
  "inelul-claselor-de-resturi": ["inele"],
  polinoame: ["inele"],
  corpuri: ["inele"],
  "morfisme-de-inele-si-corpuri": ["inele", "corpuri"],
  "izomorfisme-de-inele-si-corpuri": ["morfisme-de-inele-si-corpuri"],
  "sisteme-de-ecuatii-liniare": ["operatii-cu-matrice"],
  "sisteme-cramer": ["determinanti", "sisteme-de-ecuatii-liniare"],
  "sisteme-de-ecuatii-liniare-omogene": ["sisteme-de-ecuatii-liniare"],
  vectori: [],
  trigonometrie: [],
  "geometrie-analitica": [],
  "aplicatii-ale-trigonometriei-in-geometrie": ["trigonometrie"],
  permutari: [],
  aranjamente: [],
  combinari: [],
  "binomul-lui-newton": ["combinari"],
  "termenul-general-al-unei-dezvolatari": ["binomul-lui-newton"],
  "probleme-de-numarare": [],
  probabilitati: ["probleme-de-numarare"],
  "operatii-cu-permutari": ["permutari"],
  "produsul-permutarilor": ["operatii-cu-permutari"],
  "inversa-unei-permutari": ["operatii-cu-permutari"],
  "numarul-de-inversiuni-si-semnul-unei-permutari": ["permutari"],
  "descompunerea-in-produs-de-transpozitii": ["permutari"],
  "ecuatii-cu-permutari": ["permutari"],
};

// Seeds the "subjects" collection with the default subjects
async function migrateData() {
  try {
    const subjectCache: Record<string, string> = {};

    // Fetch all subjects from the database and build the cache
    const allSubjects = await prisma.subject.findMany({
      select: { id: true, slug: true },
    });

    allSubjects.forEach((subject) => {
      subjectCache[subject.slug] = subject.id;
    });

    // Now, set up the prerequisites for each subject
    for (const [slug, prerequisites] of Object.entries(subjectsPrerequisites)) {
      const subjectId = subjectCache[slug];

      if (!subjectId) {
        console.error(`Subject with slug "${slug}" not found in the database.`);
        continue;
      }

      // Map prerequisite slugs to their IDs
      const prerequisiteIds = prerequisites
        .map((prereqSlug) => {
          const prereqId = subjectCache[prereqSlug];
          if (!prereqId) {
            console.error(
              `Prerequisite subject "${prereqSlug}" for "${slug}" not found in the database.`,
            );
          }
          return prereqId;
        })
        .filter(Boolean);

      // Update the subject's prerequisites
      await prisma.subject.update({
        where: { id: subjectId },
        data: {
          prerequisites: {
            // Clear existing prerequisites and set new ones
            set: prerequisiteIds.map((id) => ({ id })),
          },
        },
      });
    }

    console.log("Prerequisites have been set successfully.");

    console.log("Database generation completed.");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default migrateData;
