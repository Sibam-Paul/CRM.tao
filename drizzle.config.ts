// outside (root folder)
import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load your credentials
dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!, // Make sure this is set in your .env.local
  },
});