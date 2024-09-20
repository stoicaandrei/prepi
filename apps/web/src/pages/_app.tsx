// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "@/utils/trpc";
import { Layout } from "@/components/layouts/MainLayout";
import { MathJaxContext } from "better-react-mathjax";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
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
  );
};

export default trpc.withTRPC(MyApp);
