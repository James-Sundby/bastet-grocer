import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request) => {
  if (request.nextUrl.pathname === "/") {
    const { isAuthenticated } = await auth();

    if (isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/shopping-list";

      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files,
    // unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API routes
    "/(api|trpc)(.*)",

    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
