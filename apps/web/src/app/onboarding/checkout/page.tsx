"use client";

import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
      <Link href="/onboarding/preferences">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la preferințe
        </Button>
      </Link>
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
