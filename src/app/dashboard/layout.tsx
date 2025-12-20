// src/app/dashboard/layout.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { db } from "@/db" 
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Auth Check: Ensure there is a valid Supabase session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/auth/login")
  }

  // 2. Authorization Check: Fetch the user record from your internal DB
  const dbResult = await db
    .select({ 
      role: users.role,
      email: users.email 
    })
    .from(users)
    .where(eq(users.id, user.id))

  const dbUser = dbResult[0]

  // 🔒 FAIL-CLOSED LOGIC
  // If the user exists in Supabase Auth but NOT in our CRM database, 
  // they are an unauthorized "phantom" user. We must kick them out.
  if (!dbUser) {
    console.warn(`Unauthorized access attempt: User ${user.email} not found in database.`)
    // Redirect to login with a specific error message
    return redirect("/auth/login?error=account_not_found")
  }

  // Use the verified role from the database
  const userRole = dbUser.role || "user"

  return (
    <div className="flex h-screen bg-black">
      <DashboardSidebar 
        userEmail={dbUser.email || ""} 
        userRole={userRole} 
      />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}