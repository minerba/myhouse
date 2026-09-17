'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function Header({ companyName }: { companyName?: string | null }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/dashboard" className="font-semibold tracking-tight text-ink">
          Folio<span className="text-brand">Up</span>
          <span className="ml-2 text-xs font-normal text-ink/40">for Business</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {companyName && <span className="text-ink/60">{companyName}</span>}
          <button onClick={handleSignOut} className="text-ink/50 hover:text-ink">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
