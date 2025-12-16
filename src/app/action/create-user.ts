'use server'

import { createClient } from '@supabase/supabase-js'; // Note: Using direct SDK for Admin rights
import { db } from '@/db';
import { users } from '@/db/schema';
import { revalidatePath } from 'next/cache';

// WARNING: This client uses the SERVICE ROLE KEY.
// It bypasses all security rules. Only use in Server Actions.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createTeamMember(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const role = formData.get('role') as string;

  // --- 1. PASSWORD GENERATION LOGIC ---
  // Formula: FirstName + "@" + First 4 digits of phone
  const firstName = name.split(' ')[0];
  const phonePrefix = phone.substring(0, 4);
  const autoPassword = `${firstName}@${phonePrefix}`;

  try {
    // --- 2. CREATE IN SUPABASE AUTH ---
    // This creates the actual login account
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: autoPassword,
      email_confirm: true, // Auto-confirm so they don't need to click a link
      user_metadata: { name: name }
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: "Failed to create Auth User" };
    }

    // --- 3. CREATE IN DATABASE (DRIZZLE) ---
    // This creates the profile with the Role and Phone Number
    await db.insert(users).values({
      id: authData.user.id, // Links to the Auth User we just created
      email: email,
      name: name,
      mobileNumber: phone,
      role: role
    });

    // Refresh the Team list UI
    revalidatePath('/dashboard/users');
    return { success: true };

  } catch (error) {
    console.error("Add User Error:", error);
    return { success: false, error: "Internal System Error" };
  }
}