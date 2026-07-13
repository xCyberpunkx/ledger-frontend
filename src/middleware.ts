import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Everything under /dashboard requires a signed-in user. The landing
// page, sign-in, and sign-up stay public — that's the point of a
// marketing site, it has to be visible before anyone has an account.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Clerk v6 made auth() return a Promise (it now does a token refresh
  // check under the hood) — calling .protect() on the promise directly,
  // as v5 code did, is a no-op that silently lets every request through.
  if (isProtectedRoute(req)) {
    await auth.protect();
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
