-- =====================================================================
-- SUPABASE SCHEMA FOR PREMIUM INTERACTIVE CALENDAR & PLANNED EVENTS
-- =====================================================================
-- Run this SQL in your Supabase SQL Editor (https://supabase.com)
-- to create/upgrade the required tables and configure Row-Level Security (RLS).
-- This script is completely safe to run multiple times (idempotent).

-- 1. Create the Calendar Events table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id text PRIMARY KEY,                                           -- Matches standard client id string (e.g., 'evt-170000000000')
    title text NOT NULL,                                           -- Event title
    description text DEFAULT '',                                   -- Optional event details
    date text NOT NULL,                                            -- YYYY-MM-DD string representation
    category text NOT NULL CHECK (category IN ('birthday', 'holiday', 'meeting', 'task')),
    tag text DEFAULT 'Ongoing' CHECK (tag IN ('Urgent', 'Running', 'Ongoing')),
    is_all_day boolean DEFAULT false,                              -- Toggle for full-day events
    start_time text DEFAULT 'All Day',                             -- Custom start time label
    end_time text DEFAULT 'All Day',                               -- Custom end time label
    is_completed boolean DEFAULT false,                            -- Track status of checklists or tasks
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Safely add the 'user_id' column if it does not exist (for upgrading older tables)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'calendar_events' 
          AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.calendar_events 
        ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Enable Row-Level Security (RLS)
-- This ensures that users can only read, write, or modify their own synchronized data!
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- 4. Clean up any existing policies first to prevent "policy already exists" conflicts
DROP POLICY IF EXISTS "Allow users to read their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Allow users to create their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Allow users to update their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Allow users to delete their own events" ON public.calendar_events;

-- 5. Define New Row-Level Security Policies

-- Policy 5.1: Users can read their own events (or public/guest events where user_id is null)
CREATE POLICY "Allow users to read their own events" 
ON public.calendar_events 
FOR SELECT 
USING (
    auth.uid() = user_id 
    OR user_id IS NULL
);

-- Policy 5.2: Users can insert their own events (or guest events where user_id is null)
CREATE POLICY "Allow users to create their own events" 
ON public.calendar_events 
FOR INSERT 
WITH CHECK (
    auth.uid() = user_id 
    OR user_id IS NULL
);

-- Policy 5.3: Users can update their own events (or guest events where user_id is null)
CREATE POLICY "Allow users to update their own events" 
ON public.calendar_events 
FOR UPDATE 
USING (
    auth.uid() = user_id 
    OR user_id IS NULL
)
WITH CHECK (
    auth.uid() = user_id 
    OR user_id IS NULL
);

-- Policy 5.4: Users can delete their own events (or guest events where user_id is null)
CREATE POLICY "Allow users to delete their own events" 
ON public.calendar_events 
FOR DELETE 
USING (
    auth.uid() = user_id 
    OR user_id IS NULL
);

-- =====================================================================
-- SECRETS CONFIGURATION INFO
-- =====================================================================
-- Add the following environment variables to your Secrets Panel
-- in the AI Studio Build UI (or .env file if running locally):
--
-- SUPABASE_URL = "https://your-project-id.supabase.co"
-- SUPABASE_ANON_KEY = "your-anon-public-key"
-- =====================================================================
