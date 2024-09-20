"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitForm } from "./actions";
import { useState } from "react";

export const OptInForm = () => {
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );

  async function handleSubmit(formData: FormData) {
    setState("loading");

    const result = await submitForm(formData);
    if (result.error) {
      setState("error");
    } else if (result.success) {
      setState("success");
    }
  }

  if (state === "success") {
    return (
      <div className="p-4 bg-green-100 text-green-600 rounded-md w-full max-w-md mb-8">
        Te-ai abonat cu succes! Vei primi un e-mail de confirmare în curând.
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="w-full max-w-md mb-8">
      {state === "error" && (
        <div className="p-4 mb-4 bg-red-100 text-red-600 rounded-md">
          A apărut o eroare la trimiterea formularului. Te rugăm să încerci din
          nou.
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="email"
          placeholder="Adresa ta de email"
          name="email"
          required
          className="flex-grow"
        />

        <Button
          type="submit"
          disabled={state === "loading"}
          className="bg-gradient-to-r from-[#00CCCC] to-[#6BADEE] text-white font-bold py-2 px-4 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          {state === "loading" ? "Se trimite..." : "Abonează-te"}
        </Button>
      </div>
    </form>
  );
};
