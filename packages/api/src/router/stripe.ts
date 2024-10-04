import { cacheable } from "../cache";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeRouter = router({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await currentUser();

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      customer_email: user?.emailAddresses[0].emailAddress,
      line_items: [
        {
          // price: "price_1Q5yR9FMuPtZf5FPrJTOAnxE",
          price: "price_1Q5ymCFMuPtZf5FPMKorlJ1X",
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
        // trial_settings: {
        //   end_behavior: "cancel",
        // },
      },
      locale: "ro",
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: true },
    });

    return {
      clientSecret: session.client_secret,
      id: session.id,
    };
  }),
  getCheckoutSession: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const session = await stripe.checkout.sessions.retrieve(input);

      return {
        status: session.status,
        customer_email: session.customer_details.email,
      };
    }),
});
