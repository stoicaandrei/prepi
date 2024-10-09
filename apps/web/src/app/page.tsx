import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prepi - Pregătire pentru BAC la matematică",
  description:
    "Prepi este platforma care te pregătește să iei BACul la matematică cu brio. Ai acces la toate exercițiile rezolvate și materialele explicative necesare.",
};

export default function HomePage() {
  redirect("/dashboard");
}
