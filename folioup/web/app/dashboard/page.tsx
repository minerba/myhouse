import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import type { Profile, Task } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>();

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, applications(count)')
    .eq('company_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <Header companyName={profile?.company_name} />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">내 태스크</h1>
            <p className="mt-1 text-sm text-ink/50">
              작은 실무를 올려 지원자를 받고, 결과물을 평가해 실적을 남겨주세요.
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
          >
            + 새 태스크
          </Link>
        </div>

        {!tasks || tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-16 text-center">
            <p className="text-ink/60">아직 등록한 태스크가 없어요.</p>
            <Link href="/dashboard/new" className="mt-3 inline-block text-sm font-medium text-brand">
              첫 태스크 올리기 →
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {(tasks as (Task & { applications: { count: number }[] })[]).map((task) => (
              <li key={task.id}>
                <Link
                  href={`/dashboard/tasks/${task.id}`}
                  className="flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-4 transition hover:border-brand/40"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ink">{task.title}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          task.status === 'open'
                            ? 'bg-brand/10 text-brand'
                            : 'bg-ink/10 text-ink/50'
                        }`}
                      >
                        {task.status === 'open' ? '모집중' : '마감'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink/50">
                      {task.reward_amount.toLocaleString('ko-KR')}원 · {task.duration_days}일
                    </p>
                  </div>
                  <p className="text-sm text-ink/50">
                    지원자 {task.applications?.[0]?.count ?? 0}명
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
