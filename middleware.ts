import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const publicRoutes = [
  "/",
  "/search",
  "/product/(.*)",
  "/contact",
  "/faq",
  "/return-policy",
  "/shipping-policy",
  "/api/products(.*)",
  "/api/imagekit(.*)",
  "/api/razorpay",
  "/api/webhook(.*)",
  "/api/trpc/(.*)",
  "/api/uploadthing",
  "/api/uploadthing/(.*)",
  "/api/uploadthing-a5ec7(.*)",
  "/favicon.ico",
  "/_next/static/(.*)",
  "/_next/image(.*)",
  "/images/(.*)",
  "/assets/(.*)",
  "/site.webmanifest"
];

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const isPublic = isPublicRoute(req);
  
  // If the route is public, allow access
  if (isPublic) {
    return NextResponse.next();
  }
  
  // If user is not signed in, redirect to sign-in
  if (!session || !session.userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
  
  // User is signed in and route is not public, allow access
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};