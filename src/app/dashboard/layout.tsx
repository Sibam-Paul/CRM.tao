// src/app/dashboard/layout.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { db } from "@/db" 
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // 👇 FETCH name AND avatarUrl
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: { 
      role: true, 
      name: true,       // 👈 Add this
      avatarUrl: true   // 👈 Add this
    } 
  })

  if (!dbUser) redirect('/auth/login?error=account_not_found')
  

  return (
    <div className="flex h-screen bg-black">
      <DashboardSidebar 
          userEmail={user.email!} 
          userRole={dbUser.role || 'user'} 
          userName={dbUser.name}      
          userAvatar={dbUser.avatarUrl} 
      />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}