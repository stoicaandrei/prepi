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
      "Da, toată materia din programa pentru liceu și pentru bac se găsește pe platformă, scrisă și explicată într-un mod ușor de înțeles pentru oricine.",
  },
  {
    question: "Dacă fac mate M2 sau M3, mă ajută să folosesc Prepi?",
    answer:
      "Da, indiferent de nivelul la care faci mate la școală, lecțiile sunt aceleași, iar exercițiile de pe Prepi sunt de la cel mai ușor nivel până la unul ridicat. Când exersezi îți vor fi date teste pentru nivelul tău de cunoștințe.",
  },
  {
    question: "Veți adăuga și subiecte speciale pentru M2 și M3?",
    answer:
      "Da, vor fi adăugate subiecte de bac pentru M2 și M3 până în vara 2024. Între timp, poți să te pregătești cu exercițiile ușoare de la Exersează și să citești rezolvarea acolo unde nu știi.",
  },
  {
    question:
      "Nu mă descurc la mate și vreau să încep de jos. Cum să încep și ce plan să urmez?",
    answer:
      "Prepi este făcut special pentru tine. Sunt 3 pași care garantat te vor ajuta. 1 - Mergi la Exersează și fă testul inițial ca să vedem de unde trebuie să începem.  2 -  Ține cont de sugestiile asistentului pentru a vedea rezultate cât mai rapid.  3 - Exersează teste de 4-6 ori pe săptămână. Folosește indiciile și explicațiile atunci cand ramai blocat. Dar cel mai important: continuă să faci teste. 🚀",
  },
  {
    question: "Ce este Asistent Prepi și cum mă ajută?",
    answer:
      "Asistent Prepi este un algoritm inteligent, programat să urmărească activitatea ta pe platformă. El îți oferă constant recomandări pentru a obține cele mai bune rezultate și o structură clară în procesul tău de pregătire. Uneori încearcă să fie amuzant, dar nu mereu îi iese. Dă-i un mesaj și află mai multe (stânga jos). Pentru probleme tehnice și discuții cu un membru al echipei, va trebui să folosești Support Chat (dreapta jos).",
  },
  {
    question: "Cum mă ajută Prepi să învăț mai repede și mai ușor?",
    answer:
      "Prepi folosește algoritmi inteligenți care analizează performanțele tale și îți personalizează traseul de învățare, astfel încât să te concentrezi exact pe conceptele la care ai nevoie de îmbunătățire. Modul nostru de predare este gândit pentru a face materia cât mai accesibilă: toate lecțiile au fost rescrise într-un limbaj simplu, ușor de înțeles, și includ exemple din viața reală, care te ajută să reții mai ușor informațiile.\n\nPe lângă asta, miile de exerciții disponibile nu îți oferă doar răspunsul final, ci și explicații detaliate pas cu pas, astfel încât să înțelegi perfect soluția și să o poți aplica în viitor. Asistentul Prepi este mereu alături de tine, pregătit să îți ofere suport și să te ghideze pe parcursul învățării, totul pentru ca tu să înveți rapid, eficient și fără stres.",
  },
  {
    question: "Prepi este doar pentru cei de clasa a 12-a?",
    answer:
      "Nu. Orice elev de liceu poate folosi Prepi, indiferent de clasa în care este. Platforma oferă suport atât pentru pregătirea de bac, cât și pentru testele și tezele din liceu.",
  },
  {
    question: "De cât timp am nevoie să mă pregătesc pentru bacul la mate?",
    answer:
      "Depinde de tine! În funcție de nivelul tău actual și de cât de des exersezi, te poți pregăti eficient în doar 3 până la 6 luni. Completează Nota țintă în profilul tău, iar Asistentul Prepi îți va crea un plan personalizat care te va ghida pe cel mai rapid și eficient drum spre succes.",
  },
  {
    question: "Dacă nu știu să rezolv un exercițiu, sunt ajutat?",
    answer:
      "Dacă este vorba despre un exercițiu găsit pe Prepi, întotdeauna vei avea la dispoziție rezolvarea completă a acestuia. Dacă este vorba despre un exercițiu din afara platformei, ce poți face este să mergi la lecția respectivă și să vezi dacă găsești modele asemănătoare rezolvate de noi.",
  },
  {
    question: "Prepi costă bani?",
    answer: `Da, Prepi costă doar ${currentPrice}, mai puțin decât o oră de meditație!`,
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-[#6BADEE] mb-8">
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
          <div className="mt-10 lg:mt-0">
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-xl p-6 text-white">
              <h2 className="text-3xl font-bold mb-4">{currentPrice}</h2>
              <p className="text-xl mb-8">7 zile gratuit fără card</p>
              <ul className="space-y-2 mb-6">
                <li>Plan de pregătire personalizat</li>
                <li>Explicații pentru fiecare lecție</li>
                <li>Recomandări zilnice</li>
                <li>Teste și rezolvări nelimitate</li>
                <li>Videoclipuri explicative</li>
                <li>Recomandări bazate pe stilul tău</li>
                <li>Asistent Prepi</li>
              </ul>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-100 transition-colors">
                Începe acum!
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
