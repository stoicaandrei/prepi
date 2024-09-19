import { prisma } from "@prepi/db";

const subTags = {
  ecuatii_si_inecuatii: [
    "multimi",
    "partea_intreaga_si_partea_fractionara",
    "modulul_unui_numar_real",
    "radicali",
    "logaritmi",
    "exponentiale",
    "numere_complexe",
    "ecuatii_si_inecuatii_de_gradul_al_doilea",
  ],
  progresii: ["progresii_aritmetice", "progresii_geometrice"],
  siruri: ["siruri", "siruri_date_prin_formule_de_recurenta"],
  functii: [
    "functia_liniara",
    "compunerea_functiilor",
    "functia_de_gradul_al_doilea",
    "functia_radical",
    "functia_logaritm",
    "functia_exponentiala",
    "functii_trigonometrice",
    "asimptote",
  ],
  limite: ["limite_de_siruri", "limite_de_functii"],
  derivate: [
    "studiul_functiilor",
    "derivata_unei_functii",
    "puncte_de_extrem",
    "derivata_de_gradul_al_doilea",
    "concavitate_convexitate",
    "regulile_lui_l_hospital",
  ],
  primitive: [
    "calculul_de_primitive",
    "integrare_prin_parti",
    "schimbari_de_variabila",
    "primitive_trigonometrice",
  ],
  integrale: [
    "integrale_definite",
    "formula_leibniz_newton",
    "proprietati_ale_inegralei",
    "aplicatii_ale_integralei_definite",
  ],
  matrice: [
    "operatii_cu_matrice",
    "determinanti",
    "inversa_unei_matrice",
    "rangul_unei_matrice",
  ],
  grupuri: [
    "proprietati_ale_grupurilor",
    "monoizi",
    "grupuri",
    "subgrupuri",
    "grupuri_finite",
    "morfisme_de_grupuri",
    "izomorfisme_de_grupuri",
  ],
  inele_si_corpuri: [
    "inele",
    "inelul_claselor_de_resturi",
    "polinoame",
    "corpuri",
    "morfisme_de_inele_si_corpuri",
    "izomorfisme_de_inele_si_corpuri",
  ],
  sisteme_de_ecuatii: [
    "sisteme_cramer",
    "sisteme_de_ecuatii_liniare",
    "sisteme_de_ecuatii_liniare_omogene",
  ],
  geometrie: [
    "vectori",
    "trigonometrie",
    "geometrie_analitica",
    "aplicatii_ale_trigonometriei_in_geometrie",
  ],
  combinatorica: [
    "permutari",
    "aranjamente",
    "combinari",
    "binomul_lui_newton",
    "termenul_general_al_unei_dezvolatari",
    "probleme_de_numarare",
    "probabilitati",
  ],
  permutari: [
    "operatii_cu_permutari",
    "produsul_permutarilor",
    "inversa_unei_permutari",
    "numarul_de_inversiuni_si_semnul_unei_permutari",
    "descompunerea_in_produs_de_transpozitii",
    "ecuatii_cu_permutari",
  ],
};

const prettyNames = {
  "0": "Matematică",
  "1": "Română",
  morfisme_de_inele_si_corpuri: "Morfisme de inele și corpuri",
  izomorfisme_de_inele_si_corpuri: "Izomorfisme de inele și corpuri",
  morfieme_de_grupuri: "Morfisme de grupuri",
  izomorfisme_de_grupuri: "Izomorfisme de grupuri",
  mihai_eminescu: "mihai eminescu",
  george_bacovia: "george bacovia",
  matematica: "Matematică",
  romana: "Română",
  numere_reale: "Numere reale",
  logica_si_inductie: "Logică și inducție",
  progresii: "Progresii",
  progresii_aritmetice: "Progresii aritmetice",
  progresii_geometrice: "Progresii geometrice",
  functia_liniara: "Funcția liniară",
  functia_de_gradul_al_doilea: "Funcția de gradul al doilea",
  ecuatia_de_gradul_al_doilea: "Ecuația de gradul al doilea",
  vectori: "Vectori",
  trigonometrie: "Trigonometrie",
  numere_complexe: "Numere complexe",
  functii_bijective: "Funcții bijective",
  functia_radical: "Funcția radical",
  functia_exponentiala: "Funcția exponențială",
  functia_logaritm: "Funcția logaritm",
  combinatorica: "Combinatorică",
  geometrie: "Geometrie",
  ecuatii_trigonometrice: "Ecuații trigonometrice",
  permutari: "Permutări",
  matrici: "Matrici",
  sisteme_de_ecuatii: "Sisteme de ecuații",
  structuri_algebrice: "Structuri algebrice",
  polinoame: "PolinoamePolinoame",
  limite: "Limite",
  derivate: "Derivate",
  primitive: "Primitive",
  integrale: "Integrale",

  ecuatii_si_inecuatii: "Ecuații și inecuații",
  sume_remarcabile: "Sume remarcabile",
  aplicatii_ale_trigonometriei_in_geometrie:
    "Aplicații ale trigonometriei în geometrie",
  radicali: "Radicali",
  logaritmi: "Logaritmi",
  ecuatii: "Ecuații",
  inecuatii: "Inecuații",
  probabilitati: "Probabilități",
  geomerie_analitica: "Geometrie analitică",
  matrice: "Matrice",
  determinanti: "Determinanți",
  inversa_unei_matrice: "Inversa unei matrice",
  ecuatii_matriceale: "Ecuații matriceale",
  sisteme_de_ecuatii_liniare: "Sisteme de ecuații liniare",
  siruri: "Șiruri",
  siruri_date_prin_formule_de_recurenta:
    "Șiruri date prin formule de recurență",
  limite_de_functii: "Limite de funcții",
  asimptote: "Asimptote",
  functii_continue: "Funcții continue",
  derivata_unei_functii: "Derivata unei funcții",
  teorema_lui_fermat: "Teorema lui Fermat",
  teorema_lui_rolle: "Teorema lui Rolle",
  teorema_lui_lagrange: "Teorema lui Lagrange",
  teorema_lui_l_hospital: "Teorema lui l'Hospital",
  legi_de_compozitie: "Legi de compoziție",
  grupuri: "Grupuri",
  inele_si_corpuri: "Inele și corpuri",
  formula_leibniz_newton: "Formula Leibniz-Newton",
  inegrare_prin_parti: "Integrare prin părți",
  schimbare_de_variabila: "Schimbare de variabilă",
  integrala_riemann: "Integrala",
  aplicatii_ale_integralei_definite: "Aplicații ale integralei definite",
  functii: "Funcții",
  exponentiale: "Exponențiale",
  functii_trigonometrice: "Funcții trigonometrice",
  asimptote_verticale: "Asimptote verticale",
  asimptote_orizontale: "Asimptote orizontale",
  asimptote_oblice: "Asimptote oblice",
  studiul_functiilor: "Studiul funcțiilor",
  puncte_de_extrem: "Puncte de extrem",
  derivata_de_gradul_al_doilea: "Derivata de gradul al 2-lea",
  concavitate_convexitate: "Concavitate. Convexitate",
  regulile_lui_l_hospital: "Regulile lui L'Hospital",
  calculul_de_primitive: "Calcul de primitive",
  integrare_prin_parti: "Integrare prin părți",
  schimbari_de_variabila: "Schimbări de variabilă",
  primitive_trigonometrice: "Primitive trigonometrice",
  proprietati_ale_inegralei: "Proprietăți ale integralei",
  operatii_cu_matrice: "Operații cu matrice",
  rangul_unei_matrice: "Rangul unei matrice",
  proprietati_ale_grupurilor: "Proprietăți ale grupurilor",
  sisteme_cramer: "Sisteme cramer",
  monoizi: "Monoizi",
  subgrupuri: "Subgrupuri",
  grupuri_finite: "Grupuri finite",
  morfisme: "Morfisme",
  izomorfisme: "izomorfisme",
  inele: "Inele",
  inelul_claselor_de_resturi: "Inelul claselor de resturi",
  corpuri: "Corpuri",
  sisteme_de_tip_cramer: "Sisteme de tip Cramer",
  sisteme_de_ecuatii_liniare_omogene: "Sisteme de ecuații liniare omogene",
  geometrie_analitica: "Geometrie analitică",
  aranjamente: "Aranjamente",
  combinari: "Combinări",
  binomul_lui_newton: "Binomul lui Newton",
  termenul_general_al_unei_dezvolatari: "Termenul general al unei dezvolări",
  probleme_de_numarare: "Probleme de numărare",
  produsul_permutarilor: "Produsul permutărilor",
  numarul_de_inversiuni_si_semnul: "Numărul de inversiuni și semnul",
  descompunerea_in_produs_de_transpozitii:
    "Descompunerea în produs de transpoziții",
  multimi: "Mulțimi",
  limite_de_siruri: "Limite de șiruri",
  inversa_unei_permutari: "Inversa unei permutări",
  numarul_de_inversiuni_si_semnul_unei_permutari:
    "Numărul de inversiuni și semnul unei permutări",
  ecuatii_cu_permutari: "Ecuații cu permutări",
  partea_intreaga_si_partea_fractionara: "Partea întragă și partea fracționară",
  ecuatii_si_inecuatii_de_gradul_al_doilea:
    "Ecuații și inecuații de gradul al doilea",
  modulul_unui_numar_real: "Modulul unui număr real",
  operatii_cu_permutari: "Operații cu permutări",
  compunerea_functiilor: "Compunerea funcțiilor",
  integrale_definite: "Integrale definite",
};

// Seeds the "subjects" collection with the default subjects
async function migrateData() {
  try {
    console.log("Starting database migration...");

    await prisma.$transaction(async (tx) => {
      const categoriesSlugs = Object.keys(subTags);

      for (let i = 0; i < categoriesSlugs.length; i++) {
        const categorySlug = categoriesSlugs[i];
        const subjects = subTags[categorySlug as keyof typeof subTags];

        const category = await tx.subjectCategory.create({
          data: {
            name:
              prettyNames[categorySlug as keyof typeof prettyNames] ??
              categorySlug,
            slug: categorySlug,
            order: i,
            subjects: {
              create: subjects.map((subjectSlug, j) => ({
                name:
                  prettyNames[subjectSlug as keyof typeof prettyNames] ??
                  subjectSlug,
                slug: subjectSlug,
                order: j,
              })),
            },
          },
        });

        console.log(
          `Created category: ${category.name} with ${subjects.length} subjects`
        );
      }
    });

    console.log("Database migration completed successfully.");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}
export default migrateData;
