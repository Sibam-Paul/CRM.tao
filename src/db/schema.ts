 import { numeric, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// 1. USERS TABLE
// Stores team members. The 'id' links to Supabase Auth.
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), 
  email: text('email').notNull().unique(),
  name: text('name'),
  mobileNumber: text("mobile_number").notNull().unique(),
  role: text('role').default('user'), // 'admin' or 'user'
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. EMAIL LOGS TABLE
// Stores the history of emails sent via Maileroo.
export const emailLogs = pgTable('email_logs', {
  id: serial('id').primaryKey(),
  recipients: text('recipients').notNull(), // Stores "All Users" or specific email
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  type: text('type').notNull(), // 'broadcast' or 'direct'
  status: text('status').default('sent'),
  sentAt: timestamp('sent_at').defaultNow(),
});