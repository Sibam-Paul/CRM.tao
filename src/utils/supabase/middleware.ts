import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  
  let response = NextResponse.next({
    request: { headers: request.headers },
  })
  response.headers.set('x-middleware-cache', 'no-cache')

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
   
    console.error("Middleware Auth Error:", error)
  }

  const path = request.nextUrl.pathname
  const hasError = request.nextUrl.searchParams.has('error') 

  let redirectUrl: URL | null = null;

  if (path.startsWith('/dashboard') && !user) {
    redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
 
    if (!hasError) redirectUrl.searchParams.set('error', 'please_login') 
      
  }


  if ((path.startsWith('/auth') || path === '/') && user && !hasError) {
    redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    redirectUrl.searchParams.delete('error')
  }

  if (redirectUrl) {
    const redirectResponse = NextResponse.redirect(redirectUrl)

    const newCookies = response.cookies.getAll()
    newCookies.forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })

    return redirectResponse
  }

  return response 
}