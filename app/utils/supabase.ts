import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder strings during static compilation to prevent build-time crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-only-for-builds.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-only-for-builds-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
