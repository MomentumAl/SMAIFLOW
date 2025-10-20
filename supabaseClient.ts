import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsxqkcphzdjbswyonuma.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzeHFrY3BoemRqYnN3eW9udW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzYwNTAsImV4cCI6MjA3NTc1MjA1MH0.uOFD5dGdDtBL8VuPdZ6xbyYcCnTQV25CkvFzwEvKSbI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);