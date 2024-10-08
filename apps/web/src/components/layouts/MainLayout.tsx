"use client";
import Link from "next/link";
import {
  Menu,
  ChartPie,
  BookOpen,
  ListChecks,
  Star,
  ShoppingBag,
  Files,
  Flame,
  Cog,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { pluralize } from "@prepi/utils";
import { Crisp } from "crisp-sdk-web";
import { useUserRoles } from "@/hooks/useUserRoles";

export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.";

type LayoutProps = {
  children: React.ReactNode;
};

const navClasses = (active: boolean) =>
  classNames(
    "flex items-center pl-10 gap-2 text-sm h-11 transition-all hover:text-primary border-0 border-l-4 border-solid ",
    {
      "text-primary font-semibold border-primary": active,
      "text-[#999] border-transparent": !active,
    },
  );

export function MainLayout({ children }: LayoutProps) {
  const fullPath = usePathname();
  const activeSection = fullPath?.split("/")[1];
  const { signOut } = useAuth();
  const { user } = useUser();
  const { isTester, isAdmin } = useUserRoles();

  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: userDetails } = trpc.user.userDetails.useQuery();
  const currentStreak = userDetails?.currentStreak ?? 0;
  const totalPoints = userDetails?.totalPoints ?? 0;

  return (
    <div className="flex h-screen flex-col">
      <header className="h-[80px] flex flex-row justify-between items-center">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden mx-4 text-primary"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium pt-4">
              <div className="h-[30px] flex items-center bg-[#00cccc33] text-[#00cccc] rounded-full pl-1 pr-2 py-1">
                <span className="bg-[#00cccc] rounded-full mr-2 flex justify-center items-center p-1">
                  <Flame className="w-4 h-4 text-white" />
                </span>
                <span className="text-xs font-medium">
                  {currentStreak}{" "}
                  <span className="hidden sm:inline">
                    {pluralize("zile", currentStreak)}
                  </span>
                </span>
              </div>
              <div className="h-[30px] flex items-center bg-[#6BADEE33] text-primary rounded-full pl-1 pr-2 py-1">
                <span className="bg-primary rounded-full mr-2 flex justify-center items-center p-1">
                  <Star className="w-4 h-4 text-white" />
                </span>
                <span className="text-xs font-medium">
                  {totalPoints}{" "}
                  <span className="hidden sm:inline">
                    {pluralize("puncte", totalPoints)}
                  </span>
                </span>
              </div>
              <DropdownMenuSeparator />
              <Link
                href="/dashboard"
                className={navClasses(activeSection === "dashboard")}
                onClick={() => setSheetOpen(false)}
              >
                <ChartPie className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/lessons"
                className={navClasses(activeSection === "lessons")}
                onClick={() => setSheetOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                Lecții
              </Link>
              <Link
                href="/practice"
                className={navClasses(activeSection === "practice")}
                onClick={() => setSheetOpen(false)}
              >
                <ListChecks className="h-4 w-4" />
                Exersează
              </Link>
              <Link
                href="/exams"
                className={navClasses(activeSection === "exams")}
                onClick={() => setSheetOpen(false)}
              >
                <Files className="h-4 w-4" />
                Variante
              </Link>
              {isTester && (
                <Link
                  href="/tester/dashboard"
                  className={navClasses(activeSection === "tester")}
                >
                  <Cog className="h-4 w-4" />
                  Tester Dashboard
                </Link>
              )}
              {/* <Link
                href="/leaderboard"
                className={navClasses(activeSection === "leaderboard")}
                onClick={() => setSheetOpen(false)}
              >
                <Star className="h-4 w-4" />
                Clasament
              </Link>
              <Link
                href="/store"
                className={navClasses(activeSection === "store")}
                onClick={() => setSheetOpen(false)}
              >
                <ShoppingBag className="h-4 w-4" />
                Magazin
              </Link> */}
              <DropdownMenuSeparator />
              <Link className={navClasses(false)} href="#">
                Setări
              </Link>
              <Link
                className={navClasses(false)}
                href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL!}
                target="_blank"
              >
                Plăți
              </Link>
              <Link
                className={navClasses(false)}
                href="#"
                onClick={() => Crisp.chat.open()}
              >
                Ajutor
              </Link>
              <DropdownMenuSeparator />
              <Link
                href="#"
                onClick={() => signOut()}
                className={navClasses(false)}
              >
                Logout
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="w-[250px] h-full py-4">
          <Link href="/dashboard">
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
        <div className="hidden md:flex flex-row h-full space-x-3 items-center justify-center">
          <div className="h-[30px] flex items-center bg-[#00cccc33] text-[#00cccc] rounded-full pl-1 pr-2 py-1">
            <span className="bg-[#00cccc] rounded-full mr-2 flex justify-center items-center p-1">
              <Flame className="w-4 h-4 text-white" />
            </span>
            <span className="text-xs font-medium">
              {currentStreak}{" "}
              <span className="hidden sm:inline">
                {pluralize("zile", currentStreak)}
              </span>
            </span>
          </div>
          <div className="h-[30px] flex items-center bg-[#6BADEE33] text-primary rounded-full pl-1 pr-2 py-1">
            <span className="bg-primary rounded-full mr-2 flex justify-center items-center p-1">
              <Star className="w-4 h-4 text-white" />
            </span>
            <span className="text-xs font-medium">
              {totalPoints}{" "}
              <span className="hidden sm:inline">
                {pluralize("puncte", totalPoints)}
              </span>
            </span>
          </div>
          <div className="flex items-center px-3">
            <div className="text-left mr-4 hidden sm:inline">
              <h1 className="text-base font-bold">
                Salut, {user?.firstName ?? "Elevule"}!
              </h1>
              <p className="text-xs text-gray-600">Învățăcel</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src="/avatars/babychicken.png"
                  alt=""
                  className="w-14 h-14 cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>Setări</DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL!}
                    target="_blank"
                  >
                    Plăți
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => Crisp.chat.open()}>
                  Ajutor
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[250px] hidden md:block ">
          <nav>
            <Link
              href="/dashboard"
              className={navClasses(activeSection === "dashboard")}
            >
              <ChartPie className="h-5 w-5 flex-shrink-0" />
              Dashboard
            </Link>
            <Link
              href="/lessons"
              className={navClasses(activeSection === "lessons")}
            >
              <BookOpen className="h-5 w-5 flex-shrink-0" />
              Lecții
            </Link>
            <Link
              href="/practice"
              className={navClasses(activeSection === "practice")}
            >
              <ListChecks className="h-5 w-5 flex-shrink-0" />
              Exersează
            </Link>
            <Link
              href="/exams"
              className={navClasses(activeSection === "exams")}
            >
              <Files className="h-5 w-5 flex-shrink-0" />
              Variante
            </Link>

            {isTester && (
              <>
                <DropdownMenuSeparator />
                <Link
                  href="/tester/dashboard"
                  className={navClasses(activeSection === "tester")}
                >
                  <Cog className="h-5 w-5" />
                  Tester Dashboard
                </Link>
              </>
            )}
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <Link
                  href="/admin/invitation-codes"
                  className={navClasses(activeSection === "admin")}
                >
                  <Cog className="h-5 w-5" />
                  Invitation Codes
                </Link>
              </>
            )}
            {/* <Link
              href="/leaderboard"
              className={navClasses(activeSection === "leaderboard")}
            >
              <Star className="h-5 w-5 flex-shrink-0" />
              Clasament
            </Link>
            <Link
              href="/store"
              className={navClasses(activeSection === "store")}
            >
              <ShoppingBag className="h-5 w-5 flex-shrink-0" />
              Magazin
            </Link> */}
          </nav>
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-secondary">
          {children}
        </main>
      </div>
    </div>
  );
}
