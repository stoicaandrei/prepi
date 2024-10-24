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
import { useSignOut } from "@/hooks/useSignOut";
import { Button } from "@/components/ui/button";

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
  const signOut = useSignOut();
  const { data: subscription, isLoading } =
    trpc.stripe.getSubscriptionDetails.useQuery();

  const createSetupCheckoutSession =
    trpc.stripe.createSetupCheckoutSession.useMutation();

  const fetchClientSecret = useCallback(async () => {
    const res = await createSetupCheckoutSession.mutateAsync();
    return res.clientSecret!;
  }, []);

  const trialOverdue = dayjs(subscription?.trialEndsAt).isBefore(dayjs());
  const trialEndsIn = dayjs(subscription?.trialEndsAt).fromNow(true);

  const closeModal = () => {
    if (isLoading) return;
    if (trialOverdue) return;

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        className="bg-secondary max-h-screen sm:max-h-[90vh] max-w-screen w-screen sm:w-[90vw] overflow-scroll"
        closable={!trialOverdue}
      >
        <DialogHeader>
          <DialogTitle>
            Perioada de probă {trialOverdue ? "a expirat" : "va expira"}
          </DialogTitle>
          {!!subscription && (
            <DialogDescription>
              {trialOverdue && (
                <p>
                  Perioada de probă a expirat. Introdu datele cardului pentru a
                  continua abonamentul.
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

        <Button
          variant="outline"
          className="mt-6 flex justify-center items-center"
          onClick={signOut}
        >
          Ieși din cont
        </Button>
      </DialogContent>
    </Dialog>
  );
};
