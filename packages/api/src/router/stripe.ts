import { cacheable } from "../cache";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const stripeRouter = router({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.currentUser();

    const session = await ctx.stripe.checkout.sessions.create({
      ui_mode: "embedded",
      customer_email: user?.emailAddresses[0].emailAddress,
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
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
      payment_method_configuration:
        process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION_ID,
      payment_method_collection: "if_required",
      shipping_address_collection: {
        allowed_countries: [], // This disables shipping address collection.
      },
      billing_address_collection: "auto",
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
      const session = await ctx.stripe.checkout.sessions.retrieve(input);

      return {
        status: session.status,
        customer_email: session.customer_details?.email,
      };
    }),
});
