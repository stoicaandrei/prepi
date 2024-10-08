import { MainLayout } from "@/components/layouts/MainLayout";
import { ReactNode } from "react";
import { AppProvider } from "./appContext";
import { AppModalsWrapper } from "./appModals";

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
