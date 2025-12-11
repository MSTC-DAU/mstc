
import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
    const isOnAdmin = req.nextUrl.pathname.startsWith('/admin')

    const userRole = req.auth?.user?.role || 'student';

    if (isOnAdmin) {
        if (!isLoggedIn) return Response.redirect(new URL('/login', req.nextUrl));
        if (userRole === 'student') {
            return Response.redirect(new URL('/dashboard', req.nextUrl));
        }
    }

    if (isOnDashboard) {
        if (!isLoggedIn) return Response.redirect(new URL('/login', req.nextUrl));
    }
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
