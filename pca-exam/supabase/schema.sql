-- PCA 모의고사 진행 상황 동기화 테이블.
-- Supabase 대시보드 > SQL Editor 에서 실행한다.
create table if not exists public.pca_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.pca_progress enable row level security;

-- 본인 행만 읽기/쓰기
drop policy if exists "own progress select" on public.pca_progress;
create policy "own progress select" on public.pca_progress
  for select using (auth.uid() = user_id);

drop policy if exists "own progress insert" on public.pca_progress;
create policy "own progress insert" on public.pca_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "own progress update" on public.pca_progress;
create policy "own progress update" on public.pca_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
