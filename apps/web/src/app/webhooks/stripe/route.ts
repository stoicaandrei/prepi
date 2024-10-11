import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@prepi/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return Response.json({ received: true });
}
