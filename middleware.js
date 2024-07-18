// middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
	console.log('middleware is running...');
	const token = await getToken({ req });
	console.log('middleware is completed.');
	if (
		token &&
		(!token.username || token.username.startsWith('_temp_username')) &&
		req.nextUrl.pathname !== '/username'
	) {
		return NextResponse.redirect(new URL('/username', req.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		'/home/:path*',
		'/profile/:path*',
		'/new/:path*',
		'/projects/:path*',
		'/upload/:path*',
		'/render/:path*',
	], // Paths to apply the middleware
};
