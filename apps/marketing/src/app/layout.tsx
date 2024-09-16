import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

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
