
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// This function is being deprecated in favor of creating the client directly in the AuthProvider.
// It will now return undefined to ensure it's not used.
// All client creation logic is now centralized in `useAuth`.
export function createClient(): SupabaseClient | undefined {
    return undefined;
}
