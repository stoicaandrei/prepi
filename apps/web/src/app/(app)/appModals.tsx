"use client";
import { ReactNode } from "react";
import { useAppContext } from "./appContext";
import { InitialAssessmentModal } from "@/components/PracticeModal/InitialAssessmentModal";

export const AppModalsWrapper = ({ children }: { children: ReactNode }) => {
  const { isInitialAssessmentModalOpen, closeInitialAssessmentModal } =
    useAppContext();

  return (
    <>
      {children}
      <InitialAssessmentModal
        open={isInitialAssessmentModalOpen}
        onClose={closeInitialAssessmentModal}
      />
    </>
  );
};
