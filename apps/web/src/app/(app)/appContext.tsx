"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { trpc } from "@/utils/trpc";
import dayjs from "dayjs";

interface AppContextProps {
  isInitialAssessmentModalOpen: boolean;
  openInitialAssessmentModal: () => void;
  closeInitialAssessmentModal: () => void;

  isStripeSetupModalOpen: boolean;
  openStripeSetupModal: () => void;
  closeStripeSetupModal: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { data: subscription } = trpc.stripe.getSubscriptionDetails.useQuery();

  useEffect(() => {
    if (!subscription) return;

    const isBeforeTrial =
      dayjs(subscription.trialEndsAt).diff(dayjs(), "day") < 3;
    if (isBeforeTrial) {
      openInitialAssessmentModal();
    }
  }, [subscription]);

  const [isStripeSetupModalOpen, setStripeSetupModalOpen] = useState(false);

  const openStripeSetupModal = () => setStripeSetupModalOpen(true);
  const closeStripeSetupModal = () => setStripeSetupModalOpen(false);

  const [isInitialAssessmentModalOpen, setInitialAssessmentModalOpen] =
    useState(false);

  const openInitialAssessmentModal = () => setInitialAssessmentModalOpen(true);
  const closeInitialAssessmentModal = () =>
    setInitialAssessmentModalOpen(false);

  return (
    <AppContext.Provider
      value={{
        isInitialAssessmentModalOpen,
        openInitialAssessmentModal,
        closeInitialAssessmentModal,

        isStripeSetupModalOpen,
        openStripeSetupModal,
        closeStripeSetupModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
