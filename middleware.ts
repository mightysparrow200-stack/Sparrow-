import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Check active authenticated session
  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // 2. Define all private paths
  const protectedRoutes = ['/dashboard', '/wallet', '/orders', '/profile', '/vendor', '/onboard']
  
  const isProtectedRoute = protectedRoutes.some((path) =>
    url.pathname.startsWith(path)
  )

  // 3. Redirect to /login if guest attempts to access any private route
  if (!user && isProtectedRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/wallet/:path*',
    '/orders/:path*',
    '/profile/:path*',
    '/vendor/:path*',
    '/onboard/:path*',
  ],
}
