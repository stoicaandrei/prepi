// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
    person_profiles: "always",
    api_host: `/ingest`,
    ui_host: "https://eu.posthog.com",
  });
}

type SimpleProps = {
  children: React.ReactNode;
};

function CSPostHogProvider({ children }: SimpleProps) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export function Providers({ children }: SimpleProps) {
  return <CSPostHogProvider>{children}</CSPostHogProvider>;
}
