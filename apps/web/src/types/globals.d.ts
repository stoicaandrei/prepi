export {};

export type Roles = "admin" | "tester";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      roles?: Roles[];
    };
  }
}
