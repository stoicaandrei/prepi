import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

        <section id="stats" className="bg-white py-16">
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

        {/* Add more sections here (benefits, reviews, etc.) */}
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
                    src="/icons/instagram.svg"
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="https://www.facebook.com/prepi.ro/">
                  <Image
                    src="/icons/facebook.svg"
                    alt="Facebook"
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
