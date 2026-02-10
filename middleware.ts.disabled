import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow: homepage, API routes, static assets, Next.js internals
  if (
    pathname === '/' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/models/') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|webp|avif|css|js|woff2?|ttf|glb)$/)
  ) {
    return NextResponse.next();
  }

  // Redirect everything else to the coming soon page
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
