import { useEffect, useState } from "react";

declare global {
  interface Window {
    MathQuill: any;
  }
}

export function useMathQuill() {
  const [MQ, setMQ] = useState<any>(null);

  useEffect(() => {
    console.log("window", window);
    if (typeof window !== "undefined" && window.MathQuill) {
      console.log("setting MQ");
      console.log(window.MathQuill.getInterface(2));
      setMQ(() => window.MathQuill.getInterface(2));
    }
  }, []);

  return MQ;
}
