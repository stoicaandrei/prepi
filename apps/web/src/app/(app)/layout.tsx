import { MainLayout } from "@/components/layouts/MainLayout";
import { ReactNode } from "react";
import { AppProvider } from "./appContext";
import { AppModalsWrapper } from "./appModals";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prepi",
  description:
    "Accesează dashboard-ul tău Prepi pentru a-ți gestiona pregătirea pentru BAC la matematică.",
};

export default function MdxLayout({ children }: { children: ReactNode }) {
  // Create any shared layout or styles here
  return (
    <AppProvider>
      <MainLayout>
        <AppModalsWrapper>{children}</AppModalsWrapper>
      </MainLayout>
    </AppProvider>
  );
}
