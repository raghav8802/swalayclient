import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if (path.startsWith("/_next")) {
        return NextResponse.next();
    }

    const isPublicPath = path === '/xg6jtv54ghv' || path === '/signin' || path === '/register' || path === '/verifyemail' || path === '/forgotpassword' || path === '/agreement' || path === '/reset-password' || path === '/message' || path === '/signup';

    const token = request.cookies.get('token')?.value || '';

    // Allow API routes to bypass the token check
    if (path.startsWith('/api')) {
        const response = NextResponse.next();
        // Add CORS headers for smartlink API routes
        if (path.startsWith('/api/smartlink')) {
            response.headers.set('Access-Control-Allow-Origin', '*');
            response.headers.set('Access-Control-Allow-Methods', 'GET');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
        }
        return response;
    }

    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/signin',
        '/register',
        '/verifyemail',
        '/forgotpassword',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        '/:path*',
        '/api/smartlink/:path*'  // Add matcher for smartlink API routes
    ]
};
