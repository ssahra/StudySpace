import { getCachedLoggedInVerifiedSupabaseUser } from '@/rsc-data/supabase';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  try {
    await getCachedLoggedInVerifiedSupabaseUser();
  } catch (error) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">


      <main className="flex-1">{children}</main>
    </div>
  );
}
