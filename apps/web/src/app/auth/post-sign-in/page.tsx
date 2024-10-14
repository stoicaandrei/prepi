import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PostHog } from "posthog-node";

export default async function PostSignIn() {
  const clerkId = auth().userId;

  if (clerkId) {
    const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: "https://eu.i.posthog.com",
    });

    posthog.capture({
      distinctId: clerkId,
      event: "user_sign_in",
    });

    await posthog.shutdown();
  }

  redirect("/");
}
