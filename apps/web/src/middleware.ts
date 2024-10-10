import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isUtilityRoute = createRouteMatcher(["/crons(.*)", "/webhooks(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);

const isPublicRoute = createRouteMatcher(["/auth(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isTesterRoute = createRouteMatcher("/tester(.*)");

const isPreferencesRoute = createRouteMatcher(["/onboarding/preferences"]);
const isCheckoutRoute = createRouteMatcher([
  "/onboarding/checkout",
  "/onboarding/post-checkout",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isUtilityRoute(req)) {
    return;
  }

  if (isPublicRoute(req)) {
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
  const isOnboardingDone =
    metadata.preferencesSet && metadata.subscriptionCreated;

  if (!isOnboardingDone) {
    const user = await clerkClient().users.getUser(auth().userId ?? "");
    const metadata = user.publicMetadata;

    if (!metadata.preferencesSet) {
      const correctRoute = isPreferencesRoute(req);

      if (correctRoute) return;

      return NextResponse.redirect(
        new URL("/onboarding/preferences", req.nextUrl),
      );
    }

    if (!metadata.subscriptionCreated) {
      const correctRoute = isCheckoutRoute(req);

      if (correctRoute) return;

      return NextResponse.redirect(
        new URL("/onboarding/checkout", req.nextUrl),
      );
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
