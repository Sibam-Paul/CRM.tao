import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { AddUserForm } from "@/components/add-user-form"
import { UserList } from "@/components/user-list"


export default async function AdminUsersPage() {
  const supabase = await createClient()
  
  // 1. Verify Session
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // 2. SERVER-SIDE ROLE CHECK (The Critical Fix)
  // We fetch the role from the database, not the potentially stale session
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: { role: true }
  })

 if (dbUser?.role !== 'admin') redirect("/dashboard")

  // --- Safe to render Admin content below ---
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt))

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
        <p className="text-muted-foreground mt-1">Control access and manage team credentials.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        <div className="space-y-6">
          <div className="bg-[#171717] border border-[#2E2F2F] p-6 rounded-xl">
             <h2 className="text-xl font-semibold mb-4 text-white">Add New Member</h2>
             <AddUserForm />
          </div>
        </div>
        
        <div className="min-h-0">
          <UserList initialUsers={allUsers} />
        </div>
      </div>
    </div>
  )
}