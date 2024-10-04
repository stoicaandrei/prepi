import Stripe from "stripe";

export const startStripeSubscription = async (
  stripe: Stripe,
  email: string,
) => {
  const customer = await stripe.customers.create({
    email,
    // You can add more details here as needed
  });

  // Create a subscription with a trial period for the customer
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
        quantity: 1,
      },
    ],
    trial_period_days: 7, // Set the trial period here
    payment_behavior: "default_incomplete", // Do not require payment information immediately
    expand: ["latest_invoice.payment_intent"], // Expand payment intent to check status later if needed
  });

  return {
    customer,
    subscription,
  };
};
