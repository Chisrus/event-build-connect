import { createClient } from '@supabase/supabase-js';

// These should be in .env but we'll use empty strings as placeholders so the app compiles
// The user will need to add their actual keys later
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder') {
    console.error("CRITICAL: Supabase credentials missing or using placeholders. Registration and login will FAIL.");
    console.error("Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder'
);
