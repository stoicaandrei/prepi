import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-6xl font-bold text-[#6BADEE] mb-4">În curând</h1>
      <p className="text-xl text-gray-600 text-center max-w-md mb-8">
        Lucrăm din greu să punem în mișcare{" "}
        <span className="text-[#6BADEE]">#RevolutiaEducatiei 👨‍🎓</span> cât mai
        curând posibil
      </p>
      <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
        <Button
          asChild
          className="bg-gradient-to-r from-[#00CCCC] to-[#6BADEE] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          <Link href="/">Înapoi la pagina principală</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="text-[#6BADEE] border-[#6BADEE] font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors"
        >
          <Link href="https://instagram.com/prepi.ro">
            Fii primul care află
          </Link>
        </Button>
      </div>
    </div>
  );
}
