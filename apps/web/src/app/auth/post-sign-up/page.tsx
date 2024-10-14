import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PostHog } from "posthog-node";

export default async function PostSignUp() {
  const clerkId = auth().userId;

  if (clerkId) {
    const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: "https://eu.i.posthog.com",
    });

    posthog.capture({
      distinctId: clerkId,
      event: "user_sign_up",
    });

    await posthog.shutdown();
  }

  redirect("/");
}
