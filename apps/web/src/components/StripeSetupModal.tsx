"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ro";
import { Separator } from "@/components/ui/separator";

dayjs.extend(relativeTime);
dayjs.locale("ro");

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export type StripeSetupModalProps = {
  open: boolean;
  onClose: () => void;
};

export const StripeSetupModal = ({ open, onClose }: StripeSetupModalProps) => {
  const { data: subscription } = trpc.stripe.getSubscriptionDetails.useQuery();

  const createSetupCheckoutSession =
    trpc.stripe.createSetupCheckoutSession.useMutation();

  const fetchClientSecret = useCallback(async () => {
    const res = await createSetupCheckoutSession.mutateAsync();
    return res.clientSecret!;
  }, []);

  const trialOverdue = dayjs(subscription?.trialEndsAt).isBefore(dayjs());
  const trialEndsIn = dayjs(subscription?.trialEndsAt).fromNow(true);

  return (
    <Dialog open={open} onOpenChange={trialOverdue ? undefined : onClose}>
      <DialogContent className="bg-secondary max-h-screen overflow-scroll">
        <DialogHeader>
          <DialogTitle>
            Perioada de probă {trialOverdue ? "a expirat" : "va expira"}
          </DialogTitle>
          {!!subscription && (
            <DialogDescription>
              {trialOverdue && (
                <p>
                  Perioada de probă a expirat. Introdu datele cardului pentru a
                  continua abonamentul fără nicio problemă.
                </p>
              )}
              {!trialOverdue && (
                <>
                  <p>
                    Perioada de probă expriră în {trialEndsIn}. Introdu datele
                    cardului pentru a continua abonamentul fără nicio problemă.
                  </p>
                  <Separator className="my-4" />
                  <p>
                    Plata se va efectua automat la expirarea perioadei de probă.
                  </p>
                </>
              )}
            </DialogDescription>
          )}
        </DialogHeader>

        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{
            fetchClientSecret,
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </DialogContent>
    </Dialog>
  );
};
