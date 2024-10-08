"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextProps {
  isInitialAssessmentModalOpen: boolean;
  openInitialAssessmentModal: () => void;
  closeInitialAssessmentModal: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
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
