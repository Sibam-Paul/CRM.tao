import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ProfileView } from "@/components/profile-info"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch complete user data from DB
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id)
  })

  if (!dbUser) return null

  return (
    <div className="max-w-4xl m-5 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mt-10"> 
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-8">
        {/* 1. Basic Info & Avatar */}
        <ProfileView user={{
          id: user.id,
          email: user.email!,
          name: dbUser.name,
          mobileNumber: dbUser.mobileNumber,
          avatarUrl: dbUser.avatarUrl,
          role: dbUser.role 
        }} />

       </div>
    </div>
  )
}