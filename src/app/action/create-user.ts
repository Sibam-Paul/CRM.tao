'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { db } from '@/db' 
import { users } from '@/db/schema' 

export async function createUser(formData: FormData) {
  // 1. Setup Admin Client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // 2. Extract Data
  const email = formData.get('email') as string
  const role = formData.get('role') as string
  const name = formData.get('name') as string
  const mobileNumber = formData.get('mobileNumber') as string

  // --- PASSWORD GENERATION LOGIC ---
  // 1. Remove spaces from name (e.g., "John Doe" becomes "JohnDoe")
  const cleanName = name.replace(/\s/g, '');
  // 2. Take first 4 digits of mobile
  const mobilePrefix = mobileNumber.substring(0, 4);
  // 3. Combine: Name + @ + MobilePrefix
  const password = `${cleanName}@${mobilePrefix}`;
  // ---------------------------------

  console.log("GENERATED PASSWORD:", password) // Helpful for debugging

  // 3. Create Auth User (Supabase)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: password, // Use the generated password
    email_confirm: true,
    user_metadata: { name: name }
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  // 4. Create Public User Record (Drizzle)
  if (authData.user) {
    try {
      await db.insert(users).values({
        id: authData.user.id,
        email: email,
        name: name,
        mobileNumber: mobileNumber,
        role: role as 'admin' | 'user',
      })
    } catch (dbError: any) {
      console.error('DB Error:', dbError)
      
      // Cleanup: If DB fails, delete the Auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      if (dbError.code === '23505') {
         return { success: false, error: 'Email or Mobile Number already exists.' }
      }
      return { success: false, error: 'Failed to save user profile.' }
    }
  }

  revalidatePath('/dashboard')
  return { success: true }
}