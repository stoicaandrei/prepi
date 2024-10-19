"use client";
import { Button } from "@/components/ui/button";
import { Crisp } from "crisp-sdk-web";

export const ContactUsButton = () => {
  return (
    <Button
      variant="outline"
      className="text-[#6BADEE] border-[#6BADEE] font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors"
      onClick={() => Crisp.chat.open()}
    >
      Contactează-ne
    </Button>
  );
};
