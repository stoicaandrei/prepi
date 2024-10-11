"use client";
import { ReactNode, useState } from "react";
import { useAppContext } from "./appContext";
import { InitialAssessmentModal } from "@/components/PracticeModal/InitialAssessmentModal";
import { StripeSetupModal } from "@/components/StripeSetupModal";

export const AppModalsWrapper = ({ children }: { children: ReactNode }) => {
  const {
    isInitialAssessmentModalOpen,
    closeInitialAssessmentModal,
    isStripeSetupModalOpen,
    closeStripeSetupModal,
  } = useAppContext();

  return (
    <>
      {children}
      <InitialAssessmentModal
        open={isInitialAssessmentModalOpen}
        onClose={closeInitialAssessmentModal}
      />
      <StripeSetupModal
        open={isStripeSetupModalOpen}
        onClose={closeStripeSetupModal}
      />
    </>
  );
};
