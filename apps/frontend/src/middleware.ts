import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings'
];

// Define public routes that should redirect authenticated users
const publicRoutes = [
  '/login',
  '/register'
];

// Define role-based routes
const roleBasedRoutes = {
  '/dashboard/coach': ['coach'],
  '/dashboard/runner': ['runner', 'coach'], // Coaches can view runner dashboard
};

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    
    // Check if user is authenticated
    const isAuthenticated = !!token;
    const userRole = token?.role as string;

    // Handle public routes - redirect authenticated users to dashboard
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      if (isAuthenticated) {
        const dashboardUrl = userRole === 'coach' 
          ? '/dashboard/coach' 
          : '/dashboard/runner';
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }
      return NextResponse.next();
    }

    // Handle protected routes - redirect unauthenticated users to login
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!isAuthenticated) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Handle role-based access control
      for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
        if (pathname.startsWith(route)) {
          if (!allowedRoles.includes(userRole)) {
            // Redirect to appropriate dashboard based on user role
            const dashboardUrl = userRole === 'coach' 
              ? '/dashboard/coach' 
              : '/dashboard/runner';
            return NextResponse.redirect(new URL(dashboardUrl, req.url));
          }
        }
      }
    }

    // Handle root path redirect
    if (pathname === '/') {
      if (isAuthenticated) {
        const dashboardUrl = userRole === 'coach' 
          ? '/dashboard/coach' 
          : '/dashboard/runner';
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      } else {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes without authentication
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }
        
        // Allow access to API routes (handled separately)
        if (pathname.startsWith('/api/')) {
          return true;
        }
        
        // For protected routes, require authentication
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
          return !!token;
        }
        
        // Allow access to other routes
        return true;
      },
    },
  }
);

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};