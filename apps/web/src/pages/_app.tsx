// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "@/utils/trpc";
import { Layout } from "@/components/layouts/MainLayout";
import { MathJaxContext } from "better-react-mathjax";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

if (typeof window !== "undefined") {
  // checks that we are client-side
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
    },
  });
}

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <PostHogProvider client={posthog}>
      <ClerkProvider>
        <MathJaxContext>
          <Head>
            <link rel="icon" href="/favicon.ico" />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css"
            />
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js"></script>
          </Head>
          <style jsx global>{`
            :root {
              --font-montserrat: ${montserrat.style.fontFamily};
            }
          `}</style>
          <Layout>
            <Component {...pageProps} />
            <Analytics />
          </Layout>
        </MathJaxContext>
      </ClerkProvider>
    </PostHogProvider>
  );
};

export default trpc.withTRPC(MyApp);
