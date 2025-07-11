import { Database } from '@/lib/database.types';
import { createServerClient } from '@supabase/ssr';
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';

export const createSupabaseClient = (p0?: unknown) => {
  const cookieStore = cookies() as unknown as UnsafeUnwrappedCookies;

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
