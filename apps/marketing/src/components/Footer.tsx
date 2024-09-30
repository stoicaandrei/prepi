import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { startNowUrl } from "@/constants";
import { SectionDivider } from "./SectionDivider";

export default function Footer() {
  return (
    <footer className="bg-[#6BADEE] text-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Începe-ți drumul către succes!
        </h2>
        <div className="text-center mb-12">
          <Link href={startNowUrl}>
            <Button
              variant="outline"
              className="text-black border-white font-bold"
            >
              Începe azi gratuit!
            </Button>
          </Link>
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
            </ul>
          </div>
          <div>
            <p>Rețele sociale:</p>
            <div className="flex space-x-4 mt-2">
              <Link href="https://www.instagram.com/prepi.ro/" target="_blank">
                <Image
                  src="/social/instagram.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="https://www.facebook.com/prepi.roo" target="_blank">
                <Image
                  src="/social/fb.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="https://www.tiktok.com/@prepi.ro" target="_blank">
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
  );
}
