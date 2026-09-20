import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, skip auth check to prevent hanging
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const url = request.nextUrl.clone()
  const protectedRoutes = ['/dashboard', '/wallet', '/orders', '/profile', '/vendor', '/onboard']
  const isProtectedRoute = protectedRoutes.some((path) =>
    url.pathname.startsWith(path)
  )

  // Fast check with 1-second fallback timeout
  try {
    const userPromise = supabase.auth.getUser()
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Auth Timeout')), 1000)
    )

    const { data }: any = await Promise.race([userPromise, timeoutPromise])
    const user = data?.user

    if (!user && isProtectedRoute) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (user && url.pathname.startsWith('/login')) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } catch (err) {
    // If auth times out, continue rendering page without blocking
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
