import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MdxLayout({ children }: { children: ReactNode }) {
  // Create any shared layout or styles here
  return (
    <div className="flex h-screen flex-col">
      <header className="h-[80px] flex flex-row justify-center md:justify-between items-center">
        <div className="w-[250px] h-full py-4">
          <Link href="https://www.prepi.ro">
            <div className="relative h-full w-full">
              <Image
                src="/logo.svg"
                alt="Prepi Logo"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </Link>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-secondary flex justify-center">
          {children}
        </main>
      </div>
    </div>
  );
}
