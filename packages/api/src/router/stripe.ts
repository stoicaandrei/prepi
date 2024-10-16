import Stripe from "stripe";
import { cacheable } from "../cache";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const stripeRouter = router({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const clerkUser = await ctx.currentUser();
    const dbUser = await ctx.getDbUser();

    let customer: Stripe.Customer | Stripe.DeletedCustomer | undefined =
      undefined;

    if (dbUser.stripeCustomerId) {
      customer = await ctx.stripe.customers.retrieve(dbUser.stripeCustomerId);
    }

    if (!customer) {
      customer = await ctx.stripe.customers.create({
        email: clerkUser?.emailAddresses[0].emailAddress,
        preferred_locales: ["ro"],
      });

      await ctx.prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          stripeCustomerId: customer.id,
        },
      });
    }

    const invitation = await ctx.prisma.invitationCode.findFirst({
      where: {
        redeemedBy: {
          some: {
            id: dbUser.id,
          },
        },
      },
    });
    const coupon = invitation?.stripeCoupon ?? undefined;

    const session = await ctx.stripe.checkout.sessions.create({
      ui_mode: "embedded",
      customer: customer.id,
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      // allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,

        // trial_settings: {
        //   end_behavior: "cancel",
        // },
      },
      discounts: [
        {
          coupon,
        },
      ],
      payment_method_collection: "if_required",
      locale: "ro",
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/post-checkout/?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: false },
    });

    return {
      clientSecret: session.client_secret,
      id: session.id,
    };
  }),
  createSetupCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const clerkUser = await ctx.currentUser();
    const dbUser = await ctx.getDbUser();

    const sessions = await ctx.stripe.checkout.sessions.list({
      customer: dbUser.stripeCustomerId ?? "",
    });

    console.log(sessions.data.length);

    const session = await ctx.stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "setup",
      customer: dbUser.stripeCustomerId ?? "",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      locale: "ro",
    });

    return {
      clientSecret: session.client_secret,
      id: session.id,
    };
  }),
  getSubscriptionDetails: protectedProcedure.query(async ({ ctx }) => {
    const dbUser = await ctx.getDbUser();

    if (!dbUser.stripeCustomerId) {
      return null;
    }

    const subscription = await ctx.prisma.stripeSubscription.findFirst({
      where: {
        userId: dbUser.id,
      },
      select: {
        status: true,
        trialEndsAt: true,
      },
    });

    return subscription;
  }),
});
