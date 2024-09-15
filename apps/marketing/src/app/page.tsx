import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TestimonialCarousel from "@/components/TestimonialCarousel";

interface QuestionProps {
  question: string;
  answer: string;
  isReversed?: boolean;
}

const Question: React.FC<QuestionProps> = ({
  question,
  answer,
  isReversed = false,
}) => (
  <div
    className={`flex flex-col md:flex-row items-center justify-between my-16 ${isReversed ? "md:flex-row-reverse" : ""}`}
  >
    <div className="md:w-1/2 mb-8 md:mb-0">
      <h2 className="text-4xl font-bold text-[#79b6f2] mb-4">{question}</h2>
    </div>
    <div className="md:w-1/2">
      <p className="text-lg text-gray-600">{answer}</p>
    </div>
  </div>
);

interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <Image src={icon} alt={title} width={64} height={64} className="mb-4" />
    <h3 className="text-xl font-semibold text-[#79b6f2] mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const benefits: BenefitCardProps[] = [
  {
    icon: "/_homepage/i/acces.png",
    title: "Înveți ușor și repede de oriunde",
    description:
      "Tu alegi când și unde înveți având acces la Prepi pe telefon, laoptop și tabletă",
  },
  {
    icon: "/_homepage/i/plan.png",
    title: "Totul în ritmul tău și la nivelul tău",
    description:
      "Indiferent la ce nivel ești sau cât de repede înțelegi pentru că totul se învârte după tine pe Prepi",
  },
  {
    icon: "/_homepage/i/rezolvari.png",
    title: "Explicații să înțeleagă oricine",
    description:
      "Rezolvări pas cu pas la orice exercițiu și la modele de BAC ca să înțelegi fără efort",
  },
  {
    icon: "/_homepage/i/inveti.png",
    title: "Toată materia de care ai nevoie",
    description:
      "Nu îți mai bați capul. O să vezi exact ce ai de învățat și în ce ordine. Video, scris și exerciții",
  },
  {
    icon: "/_homepage/i/urmarirea.png",
    title: "Știi mereu cât de pregătit ești",
    description: "Urmărești progresul și nivelul tău simplu, în orice moment",
  },
  {
    icon: "/_homepage/i/trebuie.png",
    title: "Nu ești singur",
    description:
      "Echipa Prepi te ajută cu orice problemă în cel mai scurt timp ca tu să ai parte de o experiență plăcută",
  },
];

interface Testimonial {
  id: number;
  name: string;
  school: string;
  image: string;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Denis S.",
    school: 'Colegiul National "Mihai Eminescu", Botoșani',
    image: "/reviews/img-000.jpeg",
    content:
      "Din punctul meu de vedere, Prepi este un proiect necesar învățământului defectuos din România. Prepi este eficient deoarece este complex, având exemple potrivite și explicând lecțiile din perspectiva elevilor, fără cuvinte greoaie și fără informații inutile.",
  },
  {
    id: 2,
    name: "Iulia Dinu",
    school: 'C.N. de Informatică "Tudor Vianu"',
    image: "/reviews/img-001.jpeg",
    content:
      "Auzim în continuu elevi care se plâng de actualul sistem de învățământ și uite că încep să se producă schimbări. Cred că Prepi este un răspuns pentru modul de predare învechit, depășit în lumea noastră care gravitează parcă în jurul tehnologiei. Prepi m-a atras încă de când era doar o simplă idee în capul unor liceeni grație designului atrăgător, construit ca un joc, dar și materiei corect structurate cu probleme bine alese, iar reminderele pentru pauză au fost surprizător de eficiente. În plus, Prepi nu doar că m-a atras, dar m-a ajutat sa obțin nota 10 la mate, deci vă invit să îl încercați și voi.",
  },
  {
    id: 3,
    name: "Larisa Lungu",
    school: "Sandwell College",
    image: "/reviews/img-002.jpeg",
    content:
      "Am ajuns la concluzia ca Prepi este mai mult decat o platforma unde poti exersa la matematica, le ofera tuturor elevilor din Romania posibilitatea de a imbina invatatul cu tehnologia, astfel ghidandu-i pe toti cei care aleg Prepi catre succes. Sa se faca un Prepi pentru UK, va rog!",
  },
  {
    id: 4,
    name: "Marcela",
    school: 'Colegiul Comercial "Carol I" Constanța',
    image: "/reviews/img-003.jpeg",
    content:
      "Prepi nu este o aplicație oarecare cu informații curiculare. Este mai mult de atât. E creată cu foarte mare atenție, iar de informații nici nu vă mai spun - sunt mai mult decât bine organizate! Am crezut în ceva diferit la această aplicație încă de înainte să fie gata. Chiar merită să o încercați și nu veți regreta.",
  },
  {
    id: 5,
    name: "Radu Chițoiu",
    school: "ICHB",
    image: "/reviews/1lJw6SG.png",
    content:
      "Prepi este aplicația care a descoperit cu adevărat secretul obținerii unui punctaj maxim la examenul de bacalaureat: să înveți eficient în loc să înveți mult și nefolositor. S-a dovedit de-a lungul testărilor făcute că inteligența artificială vine încă o dată în ajutorul omenirii, creând planuri de studiu individuale pentru fiecare utilizator.",
  },
  {
    id: 6,
    name: "Maria Alexandra",
    school: 'C.N. "Spiru Haret" Suceava',
    image: "/reviews/eeEaf6c.png",
    content:
      'Mă bucur nespus că am oportunitatea de a folosi această platformă practică și profesională. Aici se găsește toată materia necesară, toate formulele și teoremele necesare pentru a trece cu brio peste examenul "coșmar", bacalaureatul. Ajută la descoperirea modalității practice de învățare, este ceva nou, inovator, un pas înainte pentru educație și pentru sistemul de învățământ.',
  },
  {
    id: 7,
    name: "Adina Tănase",
    school: 'C.N. "Alexandru Odobescu" Pitești',
    image: "/reviews/BjUJqa5.jpg",
    content:
      "Prepi este o aplicație care ajută elevii să învețe mai mult și să se concentreze mai bine. Sunt sigură că cine va încerca să folosească această platformă pentru a învața, va avea reușită de 100% la examenul de Bacalaureat. Am urmărit platforma încă de la început și am vazut-o evoluând accelerat.",
  },
];

export default function Home() {
  return (
    <div className="bg-[#F8F9FB] min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <Link href="/">
              <Image
                src="/_homepage/logo.svg"
                alt="Prepi - Pregătire BAC online"
                width={162.5}
                height={52}
              />
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/#stats" className="text-[#505050] font-semibold">
                Statistici
              </Link>
              <Link href="/#benefits" className="text-[#505050] font-semibold">
                Beneficii
              </Link>
              <Link href="/#reviews" className="text-[#505050] font-semibold">
                Recenzii
              </Link>
              <Link href="/#pricing" className="text-[#505050] font-semibold">
                Prețuri
              </Link>
              <Link href="/contact" className="text-[#505050] font-semibold">
                Contact
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="link" className="text-[#00CCCC] font-bold">
                Login
              </Button>
              <Button
                variant="outline"
                className="text-[#6BADEE] border-[#6BADEE] font-bold"
              >
                Cont nou
              </Button>
            </div>
            <button className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Învață matematica de liceu
            <br className="hidden md:inline" />
            rapid și simplu.
          </h1>
          <Button className="bg-gradient-to-r from-[#00CCCC] to-[#6BADEE] text-white font-bold py-3 px-8 rounded-full shadow-lg">
            Începe acum gratuit!
          </Button>
          <Image
            src="/_homepage/promo-img.svg"
            alt="Imagine promoțională Prepi"
            width={600}
            height={400}
            className="mx-auto mt-12"
          />
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
              Vrei rezultate bune la teste și la BAC și să nu îți mai fie frică
              de ora de mate?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <p className="text-[#787676]">
                Descoperă cum să iei note bune la toate testele indiferent care
                este nivelul tău actual de pregătire. Vei fi ghidat pas cu pas
                în permanență și totul îți va fi explicat pe înțelesul tău și în
                ritmul tău.
              </p>
              <p className="text-[#787676]">
                Vei reuși să înțelegi tot ce se întâmplă la orele de mate și nu
                te va mai speria gândul de a ieși la tablă. Prepi te ajută să
                fii mai încrezător și pregătit și să nu te mai temi să greșești.
              </p>
            </div>
            <div className="text-center mt-12">
              <Button className="bg-gradient-to-r from-[#00CCCC] to-[#6BADEE] text-white font-bold py-3 px-8 rounded-full shadow-lg">
                Începe pregătirea acum!
              </Button>
            </div>
          </div>
        </section>

        <section id="stats" className=" py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Succesul nostru înseamnă reușitele tale
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-4xl font-semibold text-[#6BADEE]">6.042</p>
                  <p className="text-[#787676]">
                    Elevi învață cu Prepi anul acesta
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-semibold text-[#6BADEE]">1.424</p>
                  <p className="text-[#787676]">Exerciții bine explicate</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-semibold text-[#6BADEE]">
                    13.768
                  </p>
                  <p className="text-[#787676]">Ore petrecute învățând</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-semibold text-[#6BADEE]">161</p>
                  <p className="text-[#787676]">Licee folosesc Prepi</p>
                </div>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/_homepage/student-laptop.svg"
                  alt="Reprezentare vizuală: elev folosind Prepi pe laptop"
                  width={500}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="questions" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Question
              question="Ești elev și matematica nu este punctul tău forte?"
              answer="Nu ești singur! Mulți elevi consideră matematica greu de înțeles. Aici cheia succesului este exercițiul. Dar nu cât de mult exersezi este important, ci cum o faci. Iar noi am studiat care este cel mai bun mod de a învăța pentru tine."
            />
            <Question
              question="Cum înveți inteligent?"
              answer="Totul constă în atenție, ritm și ce alegi să înveți. Am dezvoltat pentru tine un algoritm care folosește acești parametrii și felul în care tu înveți pentru a te ajuta să înveți ușor și rapid."
              isReversed
            />
            <Question
              question="Cum este matematica pe Prepi?"
              answer="Simplă! Nu contează cât de mult știi acum. O să ai un plan de pregătire special pentru nivelul tău și toate explicațiile și exemplele necesare. Și încă un cuvant cheie - tehnologie."
            />
            <Question
              question="Cum ajungi la rezultate?"
              answer="Rapid! Probabil iubești timpul liber, dar testele, bacul si admiterea sunt o prioritate a ta. Astfel timpul tău va fi folosit cu grijă și respectarea planului de pregătire îți asigură rezultate, dar și timp personal."
              isReversed
            />
          </div>
        </section>

        <section id="benefits" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
              Ce beneficii ai folosind Prepi?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <BenefitCard key={index} {...benefit} />
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
              Ce spun colegii tăi?
            </h2>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        <section id="pricing" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-purple-400 to-blue-500 rounded-3xl shadow-xl overflow-hidden">
                <div className="px-8 py-12 text-center text-white">
                  <h2 className="text-5xl font-bold mb-4">34.99 lei/lună</h2>
                  <p className="text-xl mb-8">14 zile gratuit fără card</p>
                  <ul className="text-lg space-y-4 mb-8">
                    <li>Plan de pregătire personalizat</li>
                    <li>Explicații pentru fiecare lecție</li>
                    <li>Recomandări zilnice</li>
                    <li>Teste și rezolvări nelimitate</li>
                    <li>Videoclipuri explicative</li>
                    <li>Recomandări bazate pe stilul tău</li>
                    <li>Asistent Prepi</li>
                  </ul>
                  <Button className="bg-white text-blue-600 hover:bg-blue-100 text-lg font-semibold py-3 px-8 rounded-full transition duration-300">
                    Începe acum!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#6BADEE] text-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Începe-ți drumul către succes!
          </h2>
          <div className="text-center mb-12">
            <Button
              variant="outline"
              className="text-white border-white font-bold"
            >
              Începe azi gratuit!
            </Button>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/">Prepi - Pregătire BAC</Link>
                </li>
                <li>
                  <Link href="/licente">Licențe</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">
                    Politica de confidențialitate
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service">Termeni și condiții</Link>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/legal-notice">Legal Notice</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="https://status.prepi.ro/">Stare servicii</Link>
                </li>
                <li>
                  <Link href="/faq">Întrebări frecvente</Link>
                </li>
              </ul>
            </div>
            <div>
              <p>Rețele sociale:</p>
              <div className="flex space-x-4 mt-2">
                <Link href="https://www.instagram.com/prepi.ro/">
                  <Image
                    src="/social/instagram.png"
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="https://www.facebook.com/prepi.roo">
                  <Image
                    src="/social/fb.png"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="https://www.tiktok.com/prepi.roo">
                  <Image
                    src="/social/tiktok.png"
                    alt="TikTok"
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            </div>
            <div>
              <p>v2.0</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
