import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/', 
  '/properties(.*)',
  '/gallery/more(.*)',
  '/promotions/more(.*)',
  '/promotions(.*)'
]);
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/rentals(.*)',
  '/create(.*)',
  '/reservations(.*)',
  '/gallery/create',
  '/gallery',
  '/promotions/create',
  '/promotions',
  '/booking-detail(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const isAdminUser = auth().userId === process.env.ADMIN_USER_ID;
  if (isAdminRoute(req) && !isAdminUser) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (!isPublicRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};