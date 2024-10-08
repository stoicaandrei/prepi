export {};

export type UserRoles = "admin" | "tester";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      preferencesSet?: boolean;
      subscriptionCreated?: boolean;
      roles?: UserRoles[];
    };
  }
}
