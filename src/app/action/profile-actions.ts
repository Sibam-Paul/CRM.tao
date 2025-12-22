'use server'

import { createClient } from "@/utils/supabase/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Action 1: Update Name & Phone
export async function updateProfileInfo(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { success: false, error: "Unauthorized" }

  const name = formData.get("name") as string
  const mobileNumber = formData.get("mobileNumber") as string

  try {
    // Check if mobile number is taken by someone else
    if (mobileNumber) {
      const existing = await db.query.users.findFirst({
        where: eq(users.mobileNumber, mobileNumber)
      })
      if (existing && existing.id !== user.id) {
        return { success: false, error: "Mobile number already in use." }
      }
    }

    await db.update(users)
      .set({ name, mobileNumber })
      .where(eq(users.id, user.id))

    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update profile." }
  }
}

// Action 2: Change Password
export async function changePassword(formData: FormData) {
  const supabase = await createClient()
  
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  if (newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
 
}
 export async function updateAvatar(url: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: "Unauthorized" }

  try {
    await db.update(users)
      .set({ avatarUrl: url })
      .where(eq(users.id, user.id))

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error("Profile Update Error:", error)
    return { success: false, error: "Failed to update profile." }
  }
}