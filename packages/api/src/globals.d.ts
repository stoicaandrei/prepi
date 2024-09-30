export {};

export type UserRoles = "admin" | "tester";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      roles?: UserRoles[];
    };
  }
}
