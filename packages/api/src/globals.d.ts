export {};

export type UserRoles = "admin" | "tester";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingCompleted?: boolean;
      trialEndsAt?: number;
      subscriptionActive?: boolean;
      roles?: UserRoles[];
    };
  }
}
