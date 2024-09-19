// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "@/utils/trpc";
import { Layout } from "@/components/layouts/MainLayout";
import { MathJaxContext } from "better-react-mathjax";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
      <MathJaxContext>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MathJaxContext>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
