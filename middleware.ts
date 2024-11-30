import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Extract the JWT token from cookies
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, redirect to the sign-in page
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Extract roles from the token
  const roles = token.roles || [];

  // Check if the user has the 'admin' role
  if (!roles.includes("admin")) {
    // If the user doesn't have the admin role, redirect to the sign-in page
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Allow access to the route for authenticated admin users
  return NextResponse.next();
}

// Apply middleware to all routes except specific ones
export const config = {
  matcher: [
    "/((?!auth|api|_next|favicon.ico|static).*)", // Exclude /auth, /api, /_next, and static files
  ],
};
