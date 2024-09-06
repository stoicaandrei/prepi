import Link from "next/link";
import {
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  ChartPie,
  BookOpen,
  ListChecks,
  Star,
  ShoppingBag,
  Files,
  Flame,
  Cloud,
  Coins,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import classNames from "classnames";

export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.";

type LayoutProps = {
  children: React.ReactNode;
};

const navClasses = (active: boolean, small?: boolean) =>
  classNames(
    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
    {
      "bg-muted text-primary": active,
      "text-muted-foreground": !active,
      "mx-[-0.65rem]": small,
    }
  );

export function Layout({ children }: LayoutProps) {
  const path = usePathname();
  const { signOut } = useAuth();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Prepi</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className={navClasses(path === "/dashboard")}
              >
                <ChartPie className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/lessons" className={navClasses(path === "/lessons")}>
                <BookOpen className="h-4 w-4" />
                Lecții
              </Link>
              <Link
                href="/practice"
                className={navClasses(path === "/practice")}
              >
                <ListChecks className="h-4 w-4" />
                Exersează
              </Link>
              <Link href="/exams" className={navClasses(path === "/exams")}>
                <Files className="h-4 w-4" />
                Variante
              </Link>
              <Link
                href="/leaderboard"
                className={navClasses(path === "/leaderboard")}
              >
                <Star className="h-4 w-4" />
                Clasament
              </Link>
              <Link href="/store" className={navClasses(path === "/store")}>
                <ShoppingBag className="h-4 w-4" />
                Magazin
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Prepi</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={navClasses(path === "/dashboard", true)}
                >
                  <ChartPie className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/lessons"
                  className={navClasses(path === "/lessons", true)}
                >
                  <BookOpen className="h-4 w-4" />
                  Lecții
                </Link>
                <Link
                  href="/practice"
                  className={navClasses(path === "/practice", true)}
                >
                  <ListChecks className="h-4 w-4" />
                  Exersează
                </Link>
                <Link
                  href="/exams"
                  className={navClasses(path === "/exams", true)}
                >
                  <Files className="h-4 w-4" />
                  Variante
                </Link>
                <Link
                  href="/leaderboard"
                  className={navClasses(path === "/leaderboard", true)}
                >
                  <Star className="h-4 w-4" />
                  Clasament
                </Link>
                <Link
                  href="/store"
                  className={navClasses(path === "/store", true)}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Magazin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">{/* Empty left space */}</div>
          <div className="flex items-center bg-cyan-100 text-cyan-700 rounded-full px-4 py-1">
            <Flame className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              0 <span className="hidden sm:inline">zile</span>
            </span>
          </div>
          <div className="flex items-center bg-blue-100 text-blue-700 rounded-full px-4 py-1">
            <Coins className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              0 <span className="hidden sm:inline">puncte</span>
            </span>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-4 hidden sm:inline">
              <h1 className="text-xl font-bold">Salut, Andreieii!</h1>
              <p className="text-sm text-gray-600">Învățăcel</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
