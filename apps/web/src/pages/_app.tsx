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

if (typeof window !== "undefined") {
  // checks that we are client-side
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
    api_host: `${process.env.NEXT_PUBLIC_BASE_URL}ingest`,
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
          </Head>
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
