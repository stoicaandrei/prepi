import type { Metadata } from "next";
import "@/styles/globals.css";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Montserrat } from "next/font/google";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Prepi",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <Providers>
        <Head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <title>Prepi</title>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css"
          />
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js"></script>

          {/* Tawk Chat */}
          <Script
            strategy="lazyOnload"
            src="https://embed.tawk.to/66fec09937379df10df14bcb/1i99i0lo"
          />
        </Head>
        <body>
          {children}
          <Analytics />
        </body>
      </Providers>
    </html>
  );
}
