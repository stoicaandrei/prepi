import Stripe from "stripe";
import { prisma } from "@prepi/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PostCheckoutPage({
  searchParams: { session_id },
}: {
  searchParams: { session_id: string };
}) {
  const clerkId = auth().userId ?? "";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.retrieve(session_id);
  await prisma.user.update({
    where: {
      clerkId,
    },
    data: {
      stripeCustomerId: session.customer?.toString(),
    },
  });
  await clerkClient().users.updateUserMetadata(clerkId, {
    publicMetadata: { subscriptionCreated: true },
  });

  redirect("/");
}
