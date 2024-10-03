// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ClerkProvider } from "@clerk/nextjs";
import { roRO } from "@clerk/localizations";
import { MathJaxContext } from "better-react-mathjax";
import { TrpcProvider } from "@/utils/trpc";
import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
    person_profiles: "identified_only",
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
    },
  });
}

type SimpleProps = {
  children: React.ReactNode;
};

export function Providers({ children }: SimpleProps) {
  useEffect(() => {
    Crisp.configure(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ?? "");
  });

  return (
    <PostHogProvider client={posthog}>
      <ClerkProvider localization={roRO}>
        <MathJaxContext>
          <TrpcProvider>{children}</TrpcProvider>
        </MathJaxContext>
      </ClerkProvider>
    </PostHogProvider>
  );
}
