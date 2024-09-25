import { useEffect, useState } from "react";

declare global {
  interface Window {
    MathQuill: any;
  }
}

export function useMathQuill() {
  const [MQ, setMQ] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.MathQuill) {
      setMQ(() => window.MathQuill.getInterface(2));
    }
  }, []);

  return MQ;
}
