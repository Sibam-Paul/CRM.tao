import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// 1. Rename function to 'proxy'
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}