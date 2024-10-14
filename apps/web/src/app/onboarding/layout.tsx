"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useSignOut } from "@/hooks/useSignOut";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const signOut = useSignOut();

  return (
    <div className="flex h-screen flex-col overflow-scroll">
      <header className="h-[80px] flex flex-row justify-between items-center px-4">
        <div className="w-[250px] h-full py-4">
          <div className="relative h-full w-full">
            <Image
              src="/logo.svg"
              alt="Prepi Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => signOut()}
          className="text-primary"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Ieși din cont
        </Button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-secondary flex justify-center">
          {children}
        </main>
      </div>
    </div>
  );
}
