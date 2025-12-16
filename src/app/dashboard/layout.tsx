import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

// IMPORTS FOR DRIZZLE - UNCOMMENT AND ADJUST PATHS
// import { db } from "@/db" 
// import { users } from "@/db/schema"
// import { eq } from "drizzle-orm"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Auth Check: Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/auth/login")
  }

  // 2. Role Check: Query Drizzle for the user's role
  // ------------------------------------------------------------------
  // NOTE: Uncomment this block when you have your DB imports ready
  
  /*
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id)
  })
  const userRole = dbUser?.role || "user"
  */
  
  // FOR NOW: Hardcode 'admin' to test the UI, then switch to the variable above
  const userRole = "admin" 
  // ------------------------------------------------------------------

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar with Real Data passed as props */}
      <DashboardSidebar 
        userEmail={user.email || ""} 
        userRole={userRole} 
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}