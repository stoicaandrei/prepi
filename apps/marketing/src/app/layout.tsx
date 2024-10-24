import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Matematică Liceu | Pregătire Online | Prepi.ro",
  description:
    "Prepi este platforma care te pregătește să iei BACul la matematică cu brio. Ai acces la toate exercițiile rezolvate și materialele explicative necesare. Începe pregătirea gratuit!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <Providers>
        <Head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <title>Prepi</title>
        </Head>
        <body className="min-h-screen flex flex-col bg-[#F8F9FB]">
          <Header />

          <div className=" pt-[84px] h-auto flex-grow">
            {children}
            <Analytics />
            <SpeedInsights />
          </div>

          <Footer />
        </body>
      </Providers>
    </html>
  );
}
