import Stripe from "stripe";
import { prisma } from "@prepi/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PostHog } from "posthog-node";

export default async function PostCheckoutPage({
  searchParams: { session_id },
}: {
  searchParams: { session_id: string };
}) {
  const clerkId = auth().userId ?? "";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const stripeCustomerId = session.customer!.toString();

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    limit: 1,
  });
  const subscription = subscriptions.data[0];

  const dbUser = await prisma.user.findFirst({
    where: {
      stripeCustomerId,
    },
    select: {
      id: true,
    },
  });

  await prisma.stripeSubscription.create({
    data: {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      trialEndsAt: new Date((subscription.trial_end ?? 0) * 1000),
      userId: dbUser!.id,
    },
  });

  await clerkClient().users.updateUserMetadata(clerkId, {
    publicMetadata: {
      onboardingCompleted: true,
      trialEndsAt: subscription.trial_end ?? 0,
      subscriptionActive: true,
    },
  });

  const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: "https://eu.i.posthog.com",
  });

  posthog.capture({
    distinctId: dbUser!.id,
    event: "subscription_trial_created",
  });

  posthog.alias({
    distinctId: dbUser!.id,
    alias: stripeCustomerId,
  });

  await posthog.shutdown();

  redirect("/");
}
