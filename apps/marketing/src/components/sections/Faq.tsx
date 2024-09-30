import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentPrice } from "@/constants";

const faqs = [
  {
    question: "Platforma conține toată materia pentru bac?",
    answer:
      "Da, platforma Prepi acoperă toată materia din programa pentru liceu și Bac, organizată într-un mod clar și ușor de înțeles. Lecțiile și exercițiile sunt adaptate nivelului tău de pregătire, pentru ca tu să înveți eficient și să te concentrezi pe ceea ce contează cel mai mult.",
  },
  {
    question: "Dacă fac mate M2 sau M3, mă ajută să folosesc Prepi?",
    answer:
      "Da, Prepi te ajută indiferent dacă faci mate M2 sau M3. Lecțiile acoperă întreaga materie, iar exercițiile sunt disponibile de la cel mai ușor nivel până la unul avansat.",
  },
  {
    question: "Veți adăuga și subiecte speciale pentru M2 și M3?",
    answer:
      "Da, vom adăuga subiecte specifice pentru Bac la M2 și M3 până în vara 2024. Până atunci, poți să te pregătești cu exercițiile disponibile la secțiunea „Exersează”, care includ și niveluri mai ușoare, și să folosești explicațiile detaliate pentru a înțelege cum să rezolvi fiecare problemă. ",
  },
  {
    question:
      "Nu mă descurc la mate și vreau să încep de jos. Cum să încep și ce plan să urmez?",
    answer: `Prepi este creat special pentru a te ajuta să progresezi indiferent de nivelul tău. Urmează acești 3 pași simpli care te vor ghida spre succes:

1. Fă testul inițial în secțiunea „Exersează”, ca să identificăm exact de unde trebuie să începi. Platforma noastră îți va personaliza traseul de studiu pe baza rezultatelor tale.
2. Urmează sugestiile asistentului Prepi, care îți va oferi recomandări personalizate pentru a progresa cât mai rapid.
3. Exersează regulat, de 4-6 ori pe săptămână, și folosește indiciile și explicațiile detaliate atunci când întâmpini dificultăți. Cel mai important: nu renunța, continuă să faci teste și vei vedea îmbunătățiri rapide!`,
  },
  {
    question: "Ce este Asistent Prepi și cum mă ajută?",
    answer: `Asistentul Prepi este un instrument inteligent care te ghidează pas cu pas în pregătirea ta. Monitorizează activitatea ta pe platformă și îți oferă recomandări personalizate pentru a obține cele mai bune rezultate, ajutându-te să îți optimizezi procesul de învățare. De asemenea, îți oferă o structură clară pentru fiecare etapă a studiului și îți sugerează exerciții adaptate nivelului tău.

Uneori încearcă să fie amuzant (dar nu-i reușește mereu 😄), așa că nu ezita să îi trimiți un mesaj pentru a afla mai multe (găsești Asistentul Prepi în stânga jos). Dacă întâmpini probleme tehnice sau ai nevoie de ajutor din partea echipei noastre, poți folosi Support Chat (dreapta jos).`,
  },
  {
    question: "Cum mă ajută Prepi să învăț mai repede și mai ușor?",
    answer:
      "Prepi folosește algoritmi inteligenți care analizează performanțele tale și îți personalizează traseul de învățare, astfel încât să te concentrezi exact pe conceptele la care ai nevoie de îmbunătățire. Modul nostru de predare este gândit pentru a face materia cât mai accesibilă: toate lecțiile au fost rescrise într-un limbaj simplu, ușor de înțeles, și includ exemple din viața reală, care te ajută să reții mai ușor informațiile.\n\nPe lângă asta, miile de exerciții disponibile nu îți oferă doar răspunsul final, ci și explicații detaliate pas cu pas, astfel încât să înțelegi perfect soluția și să o poți aplica în viitor. Asistentul Prepi este mereu alături de tine, pregătit să îți ofere suport și să te ghideze pe parcursul învățării, totul pentru ca tu să înveți rapid, eficient și fără stres.",
  },
  {
    question: "Prepi este doar pentru cei de clasa a 12-a?",
    answer:
      "Nu, Prepi este pentru toți elevii de liceu, indiferent de clasa în care se află. Platforma este concepută să te ajute nu doar cu pregătirea pentru Bac, ci și cu testele și tezele din timpul liceului.",
  },
  {
    question: "De cât timp am nevoie să mă pregătesc pentru bacul la mate?",
    answer:
      "Depinde de tine! În funcție de nivelul tău actual și de cât de des exersezi, te poți pregăti eficient în doar 3 până la 6 luni. Completează Nota țintă în profilul tău, iar algoritmul Prepi îți va crea un plan personalizat care te va ghida pe cel mai rapid și eficient drum spre succes.",
  },
  {
    question: "Dacă nu știu să rezolv un exercițiu, sunt ajutat?",
    answer:
      "Absolut! Pe Prepi, fiecare exercițiu vine cu o rezolvare completă și detaliată, care te ghidează pas cu pas. Dacă exercițiul tău este din afara platformei, poți merge la lecția corespunzătoare, unde vei găsi exemple similare rezolvate de noi. Algoritmii noștri inteligenți îți recomandă modele asemănătoare, astfel încât să înțelegi mai bine conceptele și să poți aplica soluțiile în diverse contexte.",
  },
  {
    question: "Prepi costă bani?",
    answer: `Da, Prepi costă doar ${currentPrice}. O investiție mai mică decât o singură oră de meditație individuală! Cu acest preț, ai acces nelimitat la o platformă completă care folosește o tehnologie avansată pentru a-ți personaliza planul de studiu în funcție de nevoile și progresul tău. În plus, ai la dispoziție mii de exerciții rezolvate și suport constant, astfel încât să înveți în ritmul tău, oricând și oriunde.`,
  },
];

export const FaqSection = () => {
  return (
    <div className="px-4">
      <h1 className="text-3xl text-center font-bold text-[#6BADEE] mb-8">
        Întrebări BAC și materie
      </h1>
      <Accordion type="single" collapsible>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="whitespace-pre-line">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
