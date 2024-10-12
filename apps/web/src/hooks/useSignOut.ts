import { useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import posthog from "posthog-js";

export const useSignOut = () => {
  const { signOut } = useAuth();

  return useCallback(() => {
    signOut();
    posthog.reset();
  }, [signOut]);
};
