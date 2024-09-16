"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { submitForm } from "./actions";
import { useState } from "react";

export const ContactForm = () => {
  const [state, setState] = useState<"idle" | "error" | "success">("idle");

  async function handleSubmit(formData: FormData) {
    const result = await submitForm(formData);
    if (result.error) {
      setState("error");
    } else if (result.success) {
      setState("success");
    }
  }

  if (state === "success") {
    return (
      <div className="p-4 bg-green-100 text-green-600 rounded-md">
        Am primit mesajul tău, îți mulțumim! Vom reveni cu un răspuns cât mai
        curând posibil.
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {state === "error" && (
        <div className="p-4 bg-red-100 text-red-600 rounded-md">
          A apărut o eroare la trimiterea formularului. Te rugăm să încerci din
          nou.
        </div>
      )}
      <div>
        <Input
          type="email"
          placeholder="E-mail"
          name="email"
          required
          className="w-full p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
        />
      </div>
      <div>
        <Textarea
          placeholder="Mesaj"
          name="message"
          required
          className="w-full p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors resize-none"
          rows={4}
        />
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="terms" className="mt-1" required />
        <label htmlFor="terms" className="text-sm text-gray-600">
          Sunt de acord cu{" "}
          <Link
            href="/terms-of-service"
            className="text-blue-500 hover:underline"
          >
            termenii și condițiile
          </Link>
          , am citit și înțeles{" "}
          <a href="/privacy-policy" className="text-blue-500 hover:underline">
            politica de confidențialitate
          </a>{" "}
          și sunt de acord că datele personale îmi vor fi prelucrate conform
          acestor documente.
        </label>
      </div>
      <div className="text-center">
        <Button
          type="submit"
          className="px-8 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
        >
          Trimite
        </Button>
      </div>
    </form>
  );
};
