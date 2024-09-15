"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <Link href="/">
            <Image
              src="_homepage/logo.svg"
              alt="Prepi - Pregătire BAC online"
              width={162.5}
              height={52}
            />
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link
              href="/#stats"
              className="text-[#505050] font-semibold hover:text-[#6BADEE] transition-colors"
            >
              Statistici
            </Link>
            <Link
              href="/#benefits"
              className="text-[#505050] font-semibold hover:text-[#6BADEE] transition-colors"
            >
              Beneficii
            </Link>
            <Link
              href="/#reviews"
              className="text-[#505050] font-semibold hover:text-[#6BADEE] transition-colors"
            >
              Recenzii
            </Link>
            <Link
              href="/#pricing"
              className="text-[#505050] font-semibold hover:text-[#6BADEE] transition-colors"
            >
              Prețuri
            </Link>
            <Link
              href="/contact"
              className="text-[#505050] font-semibold hover:text-[#6BADEE] transition-colors"
            >
              Contact
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="link"
              className="text-[#00CCCC] font-bold hover:text-[#00AAAA]"
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="text-[#6BADEE] border-[#6BADEE] font-bold hover:bg-[#6BADEE] hover:text-white transition-colors"
            >
              Cont nou
            </Button>
          </div>
          <button className="md:hidden" aria-label="Open menu">
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
  );
}
