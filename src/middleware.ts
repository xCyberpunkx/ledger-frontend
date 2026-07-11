import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Everything under /dashboard or /org requires a signed-in user.
// The landing page, sign-in, and sign-up stay public — that's the point
// of a marketing site, it has to be visible before anyone has an account.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/org(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Run on everything except static files and _next internals
    "/((?!_next|[^?]*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
