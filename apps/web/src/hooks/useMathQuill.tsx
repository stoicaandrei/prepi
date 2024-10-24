"use client";

import { useCallback, useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    jQuery: any;
    $: any;
    MathQuill: any;
  }
}

export function useMathQuill() {
  const [MQ, setMQ] = useState<any>(null);
  const [isJQueryLoaded, setIsJQueryLoaded] = useState(false);
  const [isMathQuillLoaded, setIsMathQuillLoaded] = useState(false);

  useEffect(() => {
    if (MQ) return;

    if (window.MathQuill) {
      setMQ(() => window.MathQuill.getInterface(2));
      setIsMathQuillLoaded(true);
      setIsJQueryLoaded(true);
      console.log("MathQuill instance loaded inside hook");
    }
  }, [isJQueryLoaded, isMathQuillLoaded]);

  const MathQuillLoader = useCallback(
    () => (
      <>
        <Script
          src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"
          onLoad={() => setIsJQueryLoaded(true)}
          onError={console.error}
        />
        {isJQueryLoaded && (
          <Script
            src="/mathquill/mathquill.min.js"
            onLoad={() => setIsMathQuillLoaded(true)}
            onError={console.error}
          />
        )}
        <style jsx global>{`
          @import "/mathquill/mathquill.min.css";
        `}</style>
      </>
    ),
    [isJQueryLoaded],
  );

  return {
    MQ,
    isReady: isJQueryLoaded && isMathQuillLoaded,
    MathQuillLoader,
  };
}
