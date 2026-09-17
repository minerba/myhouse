import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import { TaskDetailClient } from '@/components/TaskDetailClient';

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <TaskDetailClient taskId={id} />
      </main>
    </>
  );
}
