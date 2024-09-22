// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "always",
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
