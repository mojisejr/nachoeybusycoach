import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated
        if (!token) {
          return false;
        }

        // Add role-based access control if needed
        const { pathname } = req.nextUrl;
        
        // Admin routes - only for coaches
        if (pathname.startsWith("/admin") || pathname.startsWith("/coach")) {
          return token.role === "coach";
        }

        // Runner routes - for authenticated users
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/training")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

// Specify which routes should be protected
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/training/:path*",
    "/admin/:path*",
    "/coach/:path*",
    "/api/protected/:path*",
  ],
};