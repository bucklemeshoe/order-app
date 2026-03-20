import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session (important for keeping tokens valid)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Routes
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isAdminLogin = request.nextUrl.pathname === "/admin/login"
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")
  const isApiRoute = request.nextUrl.pathname.startsWith("/api")
  const isOfflineRoute = request.nextUrl.pathname.startsWith("/offline")
  const isBlogRoute = request.nextUrl.pathname.startsWith("/blog")
  
  const publicRoutes = ["/", "/request-setup", "/privacy-policy", "/terms-of-service", "/documentation"]
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  if (isAdminRoute && !isAdminLogin) {
    if (!user) {
      // Not logged in → redirect to admin login
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }

    // Check admin role from public.users
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      // Not admin → redirect to customer app
      const url = request.nextUrl.clone()
      url.pathname = "/order" // Redirect non-admins to /order instead of /
      return NextResponse.redirect(url)
    }
  }

  // Protect all other app routes (Customer App)
  if (!isAdminRoute && !isAuthRoute && !isApiRoute && !isOfflineRoute && !isPublicRoute && !isBlogRoute) {
    if (!user) {
      // Not logged in → redirect to auth login
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
