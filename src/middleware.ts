import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/owner')) {
    return NextResponse.next();
  }

  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const xsrfToken = extractXsrfToken(cookieHeader);

    const userData = await fetchUser(cookieHeader, xsrfToken, request.url);
    if (!userData?.user) return redirectToLogin(request);

    const userRole = userData.user.role;

    // Admin restriction
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return redirectToLogin(request);
    }

    // Owner restriction
    if (pathname.startsWith('/owner')) {
      if (userRole !== 'owner') {
        return redirectToLogin(request);
      }

      // Allow subscription page always
      if (pathname === '/owner/subscription') {
        return NextResponse.next();
      }

      const subscription = userData.user.subscription;
      const now = new Date();
      const expiresAt = subscription?.expires_at ? new Date(subscription.expires_at) : null;
      const isSubscribed = subscription && (!expiresAt || expiresAt > now);

      if (!isSubscribed) {
        return NextResponse.redirect(new URL('/owner/subscription', request.url));
      }

      // 🔒 Block access to /owner/properties/add if limit reached
      if (pathname === '/owner/properties/add') {
        const propertyCount = await fetchPropertyCount(cookieHeader, xsrfToken, request.url);
        const maxProperties = subscription.plan?.max_properties ?? 0;

        if (propertyCount >= maxProperties) {
          return NextResponse.redirect(new URL('/owner/properties', request.url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return redirectToLogin(request);
  }
}

// === Helper functions ===

function extractXsrfToken(cookieHeader: string): string {
  const match = cookieHeader.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

async function fetchUser(cookie: string, xsrfToken: string, referer: string) {
  const response = await fetch(`${API_URL}/user`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Cookie: cookie,
      'X-XSRF-TOKEN': xsrfToken,
      'X-Requested-With': 'XMLHttpRequest',
      Referer: referer,
    },
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`User API error: ${response.status}`);
  return response.json();
}

async function fetchPropertyCount(cookie: string, xsrfToken: string, referer: string): Promise<number> {
  const response = await fetch(`${API_URL}/owner/properties/count`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Cookie: cookie,
      'X-XSRF-TOKEN': xsrfToken,
      'X-Requested-With': 'XMLHttpRequest',
      Referer: referer,
    },
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`Property count API error: ${response.status}`);
  const data = await response.json();
  return data.count ?? 0;
}

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/admin/:path*', '/owner/:path*'],
};
