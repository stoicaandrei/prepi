import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matematică Liceu | Pregătire Online | Prepi.ro",
  description:
    "Prepi este platforma care te pregătește să iei BACul la matematică cu brio. Ai acces la toate exercițiile rezolvate și materialele explicative necesare. Începe pregătirea gratuit!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />

        <div className="bg-[#F8F9FB] pt-[84px] h-auto flex-grow">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}
