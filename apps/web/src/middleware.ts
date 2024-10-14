import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isUtilityRoute = createRouteMatcher([
  "/crons(.*)",
  "/webhooks(.*)",
  "/ingest(.*)",
]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);

const isAuthRoute = createRouteMatcher(["/auth(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isTesterRoute = createRouteMatcher("/tester(.*)");

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isUtilityRoute(req)) {
    return;
  }

  if (isAuthRoute(req)) {
    const nextUrl = req.nextUrl;
    const search = nextUrl.search;
    if (search) {
      // Remove the search params from the URL
      return NextResponse.redirect(new URL(nextUrl.pathname, req.nextUrl));
    }
    return;
  }

  if (isApiRoute(req)) {
    auth().protect();
    return;
  }

  if (!auth().userId) {
    auth().protect();
    return;
  }

  const metadata = auth().sessionClaims?.metadata ?? {};
  const isOnboardingCompleted = metadata.onboardingCompleted;
  const onboardingRoute = isOnboardingRoute(req);

  if (onboardingRoute && isOnboardingCompleted) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!isOnboardingCompleted) {
    // Fetch the user to get the latest metadata,
    // because the session claims don't always have the latest metadata
    const user = await clerkClient().users.getUser(auth().userId ?? "");
    const freshMetadata = user.publicMetadata;

    if (!freshMetadata.onboardingCompleted && !onboardingRoute) {
      return NextResponse.redirect(new URL("/onboarding", req.nextUrl));
    }
  }

  if (isAdminRoute(req)) {
    const isAdmin = metadata.roles?.includes("admin");
    if (!isAdmin) return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isTesterRoute(req)) {
    const isTester = metadata.roles?.includes("tester");
    if (!isTester) return NextResponse.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
