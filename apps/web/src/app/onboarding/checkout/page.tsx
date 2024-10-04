"use client";

import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { trpc } from "@/utils/trpc";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function Page() {
  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation();

  const fetchClientSecret = useCallback(async () => {
    const res = await createCheckoutSession.mutateAsync();
    return res.clientSecret!;
  }, []);

  return (
    <div className="w-full rounded-md" id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
