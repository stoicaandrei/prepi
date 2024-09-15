import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Prepi",
  description: "Prepi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />

        <div className="bg-[#F8F9FB] min-h-screen pt-[84px]">{children}</div>

        <footer className="bg-[#6BADEE] text-white py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center mb-8">
              Începe-ți drumul către succes!
            </h2>
            <div className="text-center mb-12">
              <Button
                variant="outline"
                className="text-black border-white font-bold"
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
                    <Link href="/licenses">Licențe</Link>
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
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
