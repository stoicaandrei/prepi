import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Prepi",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4">404 - Pagină negăsită</h1>
      <p className="text-xl mb-8">
        Ne pare rău, pagina pe care o cauți nu există.
      </p>
      <Button asChild>
        <Link href="/">Înapoi la Aplicație</Link>
      </Button>
    </div>
  );
}
