import Link from "next/link";
import {
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Book,
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

// const navClasses = (active: boolean, small?: boolean) =>
//   classNames(
//     "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
//     {
//       "bg-muted text-primary": active,
//       "text-muted-foreground": !active,
//       "mx-[-0.65rem]": small,
//     }
//   );

const navClasses = (active: boolean) =>
  classNames(
    "flex items-center pl-10 gap-2 text-sm h-11 transition-all hover:text-primary border-0 border-l-4 border-solid ",
    {
      "text-primary font-semibold border-primary": active,
      "text-[#999] border-transparent": !active,
    }
  );

export function Layout({ children }: LayoutProps) {
  const fullPath = usePathname();
  const activeSection = fullPath?.split("/")[1];
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen flex-col">
      <header className="h-[80px] flex flex-row justify-between">
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
        <div className="flex flex-row h-full space-x-3 items-center justify-center">
          <div className="h-[30px] flex items-center bg-[#00cccc33] text-[#00cccc] rounded-full pl-1 pr-2 py-1">
            <span className="bg-[#00cccc] rounded-full mr-2 flex justify-center items-center p-1">
              <Flame className="w-4 h-4 text-white" />
            </span>
            <span className="text-xs font-medium">
              0 <span className="hidden sm:inline">zile</span>
            </span>
          </div>
          <div className="h-[30px] flex items-center bg-[#6BADEE33] text-primary rounded-full pl-1 pr-2 py-1">
            <span className="bg-primary rounded-full mr-2 flex justify-center items-center p-1">
              <Star className="w-4 h-4 text-white" />
            </span>
            <span className="text-xs font-medium">
              0 <span className="hidden sm:inline">puncte</span>
            </span>
          </div>
          <div className="flex items-center px-3">
            <div className="text-left mr-4 hidden sm:inline">
              <h1 className="text-base font-bold">Salut, Andreieii!</h1>
              <p className="text-xs text-gray-600">Învățăcel</p>
            </div>
            <img src="" alt="" className="w-14 h-14" />
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[250px]">
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
            <Link
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
            </Link>
          </nav>
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-secondary">
          {children}
        </main>
      </div>
    </div>
  );

  // return (
  //   <div className="grid min-h-screen w-full md:grid-cols-[315px_1fr] lg:grid-cols-[315px_1fr]">
  //     <div className="hidden border-r bg-muted/40 md:block">
  //       <div className="flex h-full max-h-screen flex-col gap-2">
  //         <div className="flex h-14 items-center border-b lg:h-[80px]">
  //           {/* <Link href="/"> */}
  //           <Image
  //             src="/logo.svg"
  //             alt="Prepi logo"
  //             width={100}
  //             height={32}
  //             className="flex-shrink-0"
  //           />
  //           {/* </Link> */}
  //         </div>
  //         <div className="flex-1">
  //           <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
  //             <Link
  //               href="/dashboard"
  //               className={navClasses(activeSection === "dashboard")}
  //             >
  //               <ChartPie className="h-5 w-5 flex-shrink-0" />
  //               Dashboard
  //             </Link>
  //             <Link
  //               href="/lessons"
  //               className={navClasses(activeSection === "lessons")}
  //             >
  //               <BookOpen className="h-4 w-4" />
  //               Lecții
  //             </Link>
  //             <Link
  //               href="/practice"
  //               className={navClasses(activeSection === "practice")}
  //             >
  //               <ListChecks className="h-4 w-4" />
  //               Exersează
  //             </Link>
  //             <Link
  //               href="/exams"
  //               className={navClasses(activeSection === "exams")}
  //             >
  //               <Files className="h-4 w-4" />
  //               Variante
  //             </Link>
  //             <Link
  //               href="/leaderboard"
  //               className={navClasses(activeSection === "leaderboard")}
  //             >
  //               <Star className="h-4 w-4" />
  //               Clasament
  //             </Link>
  //             <Link
  //               href="/store"
  //               className={navClasses(activeSection === "store")}
  //             >
  //               <ShoppingBag className="h-4 w-4" />
  //               Magazin
  //             </Link>
  //           </nav>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="flex flex-col">
  //       <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
  //         <Sheet>
  //           <SheetTrigger asChild>
  //             <Button
  //               variant="outline"
  //               size="icon"
  //               className="shrink-0 md:hidden"
  //             >
  //               <Menu className="h-5 w-5" />
  //               <span className="sr-only">Toggle navigation menu</span>
  //             </Button>
  //           </SheetTrigger>
  //           <SheetContent side="left" className="flex flex-col">
  //             <nav className="grid gap-2 text-lg font-medium">
  //               <Link
  //                 href="#"
  //                 className="flex items-center gap-2 text-lg font-semibold"
  //               >
  //                 <Book className="h-6 w-6" />
  //                 <span className="">Prepi</span>
  //               </Link>
  //               <Link
  //                 href="/dashboard"
  //                 className={navClasses(activeSection === "dashboard", true)}
  //               >
  //                 <ChartPie className="h-4 w-4" />
  //                 Dashboard
  //               </Link>
  //               <Link
  //                 href="/lessons"
  //                 className={navClasses(activeSection === "lessons", true)}
  //               >
  //                 <BookOpen className="h-4 w-4" />
  //                 Lecții
  //               </Link>
  //               <Link
  //                 href="/practice"
  //                 className={navClasses(activeSection === "practice", true)}
  //               >
  //                 <ListChecks className="h-4 w-4" />
  //                 Exersează
  //               </Link>
  //               <Link
  //                 href="/exams"
  //                 className={navClasses(activeSection === "exams", true)}
  //               >
  //                 <Files className="h-4 w-4" />
  //                 Variante
  //               </Link>
  //               <Link
  //                 href="/leaderboard"
  //                 className={navClasses(activeSection === "leaderboard", true)}
  //               >
  //                 <Star className="h-4 w-4" />
  //                 Clasament
  //               </Link>
  //               <Link
  //                 href="/store"
  //                 className={navClasses(activeSection === "store", true)}
  //               >
  //                 <ShoppingBag className="h-4 w-4" />
  //                 Magazin
  //               </Link>
  //             </nav>
  //           </SheetContent>
  //         </Sheet>
  //         <div className="w-full flex-1 empty-space"></div>
  //         <div className="flex items-center bg-cyan-100 text-cyan-700 rounded-full px-4 py-1">
  //           <Flame className="w-4 h-4 mr-2" />
  //           <span className="text-sm font-medium">
  //             0 <span className="hidden sm:inline">zile</span>
  //           </span>
  //         </div>
  //         <div className="flex items-center bg-blue-100 text-blue-700 rounded-full px-4 py-1">
  //           <Coins className="w-4 h-4 mr-2" />
  //           <span className="text-sm font-medium">
  //             0 <span className="hidden sm:inline">puncte</span>
  //           </span>
  //         </div>
  //         <div className="flex items-center">
  //           <div className="text-right mr-4 hidden sm:inline">
  //             <h1 className="text-xl font-bold">Salut, Andreieii!</h1>
  //             <p className="text-sm text-gray-600">Învățăcel</p>
  //           </div>
  //         </div>
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="secondary" size="icon" className="rounded-full">
  //               <CircleUser className="h-5 w-5" />
  //               <span className="sr-only">Toggle user menu</span>
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuItem disabled>Settings</DropdownMenuItem>
  //             <DropdownMenuItem disabled>Support</DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem onClick={() => signOut()}>
  //               Logout
  //             </DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       </header>
  //       <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
  //         {children}
  //       </main>
  //     </div>
  //   </div>
  // );
}
