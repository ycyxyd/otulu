import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase URL and Anon Key
// In a real project, use import.meta.env.VITE_SUPABASE_URL
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
