// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
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

export const CrispChat = () => {
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress?.emailAddress;
      email && Crisp.user.setEmail(email);

      const fullName = user.fullName;
      fullName && Crisp.user.setNickname(fullName);
    }
  }, [user]);

  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (websiteId) {
      Crisp.configure(websiteId);
    }
  });

  return null;
};

export const PostHogProviderWithClerk = ({ children }: SimpleProps) => {
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress?.emailAddress;
      const name = user.fullName;

      posthog.identify(user.id, {
        email,
        name,
      });
    }
  }, [user]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};

export function Providers({ children }: SimpleProps) {
  return (
    <ClerkProvider localization={roRO}>
      <PostHogProviderWithClerk>
        <MathJaxContext>
          <TrpcProvider>
            {children}
            <CrispChat />
          </TrpcProvider>
        </MathJaxContext>
      </PostHogProviderWithClerk>
    </ClerkProvider>
  );
}
