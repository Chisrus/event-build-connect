import { createClient } from '@supabase/supabase-js';

// These should be in .env but we'll use empty strings as placeholders so the app compiles
// The user will need to add their actual keys later
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
