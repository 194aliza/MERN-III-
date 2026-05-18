import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  const roleCookie = request.cookies.get("role")?.value;

  
  const sessionEmail = sessionCookie && sessionCookie !== "" && sessionCookie !== "null" 
    ? decodeURIComponent(sessionCookie) 
    : null;

  const userRole = roleCookie && roleCookie !== "" ? roleCookie : null;
  
  
  const isActuallyAdmin = (sessionEmail?.toLowerCase() === "admin@store.com") || (userRole === "admin");

  const { pathname } = request.nextUrl;

  
  if (sessionEmail && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))) {
   
    const destination = isActuallyAdmin ? "/admin/dashboard" : "/user/home";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  
  const privatePaths = ["/cart", "/admin", "/user"]; 
  const isPrivate = privatePaths.some(path => pathname.startsWith(path));

  if (!sessionEmail && isPrivate) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  
  if (pathname.startsWith("/admin") && !isActuallyAdmin) {
    
    return NextResponse.redirect(new URL("/user/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  
  matcher: [
    "/admin/:path*", 
    "/user/:path*", 
    "/cart/:path*", 
    "/auth/:path*"
  ],
};