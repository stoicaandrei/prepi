import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@prepi/db";
import { PostHog } from "posthog-node";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is not set in the environment variables");
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  console.error(
    "STRIPE_WEBHOOK_SECRET is not set in the environment variables",
  );
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: "https://eu.i.posthog.com",
  });

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object;
      await prisma.stripeSubscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          status: subscription.status,
        },
      });
      break;
    case "invoice.payment_succeeded":
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      const customerId = invoice.customer;

      if (!customerId) break;

      const dbUser = await prisma.user.findFirst({
        where: {
          stripeCustomerId: customerId.toString(),
        },
        select: {
          id: true,
        },
      });

      if (!dbUser) break;

      posthog.capture({
        distinctId: dbUser.id,
        event: "invoice_payment_succeeded",
        properties: {
          subscriptionId: subscriptionId,
          amountPaid: invoice.amount_paid / 100, // convert cents to currency unit
        },
      });
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  await posthog.shutdown();

  return Response.json({ received: true });
}
