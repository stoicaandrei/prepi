import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isUtilityRoute = createRouteMatcher(["/crons(.*)"]);

const isPublicRoute = createRouteMatcher(["/auth(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isTesterRoute = createRouteMatcher("/tester(.*)");

export default clerkMiddleware((auth, req) => {
  if (isUtilityRoute(req)) {
    return;
  }

  if (isPublicRoute(req)) {
    return;
  }

  if (isAdminRoute(req)) {
    const isAdmin = auth().sessionClaims?.metadata.roles?.includes("admin");
    if (!isAdmin) return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isTesterRoute(req)) {
    const isTester = auth().sessionClaims?.metadata.roles?.includes("tester");
    if (!isTester) return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
