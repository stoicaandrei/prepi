import type { Metadata } from "next";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Montserrat } from "next/font/google";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://app.prepi.ro"),
  title: {
    default: "Prepi - Pregătire pentru BAC la matematică",
    template: "%s | Prepi",
  },
  description:
    "Prepi este platforma care te pregătește să iei BACul la matematică cu brio. Ai acces la toate exercițiile rezolvate și materialele explicative necesare.",
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://app.prepi.ro",
    siteName: "Prepi",
    title: "Prepi - Pregătire pentru BAC la matematică",
    description:
      "Prepi este platforma care te pregătește să iei BACul la matematică cu brio. Ai acces la toate exercițiile rezolvate și materialele explicative necesare.",
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={montserrat.className}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css"
        />
      </head>
      <body>
        <Providers>
          {children}
          <Analytics />
        </Providers>
        <Script
          src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
