-- FolioUp core schema
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ── profiles ────────────────────────────────────────────────────────────
-- One row per auth.users row. role determines whether the account posts
-- tasks (company) or applies to them (seeker).
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('seeker', 'company')),
  name text not null,
  company_name text,
  bio text,
  created_at timestamptz not null default now()
);

-- ── tasks ───────────────────────────────────────────────────────────────
-- A bite-sized real project a company posts for seekers to apply to.
create table tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  skill_tags text[] not null default '{}',
  reward_amount integer not null check (reward_amount >= 0),
  duration_days integer not null check (duration_days > 0),
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

-- ── applications ────────────────────────────────────────────────────────
-- A seeker applying to a task. Company accepts/rejects.
create table applications (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  seeker_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  applied_at timestamptz not null default now(),
  unique (task_id, seeker_id)
);

-- ── submissions ─────────────────────────────────────────────────────────
-- The deliverable a seeker turns in for an accepted application.
create table submissions (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references applications(id) on delete cascade,
  content_url text not null,
  notes text,
  submitted_at timestamptz not null default now()
);

-- ── evaluations ─────────────────────────────────────────────────────────
-- The company's verified review of a submission. This is what accumulates
-- into a seeker's track record.
create table evaluations (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references submissions(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  feedback text not null,
  would_hire boolean not null default false,
  evaluated_at timestamptz not null default now()
);

-- ── seeker_track_record ─────────────────────────────────────────────────
-- Aggregated, publicly-readable view a profile screen renders. This is the
-- platform's core "proof" mechanism, so unlike the raw tables it joins,
-- it is intentionally visible to anyone signed in (a company sizing up a
-- seeker needs to see this without having posted the tasks itself). It
-- runs with the view owner's privileges (no security_invoker), so it
-- bypasses the underlying tables' RLS by design — only the aggregated
-- counts below are exposed, never raw submissions or feedback text.
create view seeker_track_record as
select
  a.seeker_id,
  count(e.id) as completed_count,
  round(avg(e.score)::numeric, 1) as avg_score,
  count(e.id) filter (where e.would_hire) as would_hire_count
from applications a
join submissions s on s.application_id = a.id
join evaluations e on e.submission_id = s.id
group by a.seeker_id;

grant select on seeker_track_record to authenticated;

-- ── row level security ──────────────────────────────────────────────────
alter table profiles enable row level security;
alter table tasks enable row level security;
alter table applications enable row level security;
alter table submissions enable row level security;
alter table evaluations enable row level security;

-- profiles: everyone can read basic profile info (needed to show company
-- names on tasks and seeker names on applications); only the owner writes.
create policy "profiles are publicly readable"
  on profiles for select using (true);
create policy "users insert their own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "users update their own profile"
  on profiles for update using (auth.uid() = id);

-- tasks: open tasks are readable by anyone signed in; a company also sees
-- its own closed tasks; only the owning company can write.
create policy "open tasks are readable"
  on tasks for select using (status = 'open' or company_id = auth.uid());
create policy "companies create their own tasks"
  on tasks for insert with check (
    company_id = auth.uid()
    and exists (select 1 from profiles where id = auth.uid() and role = 'company')
  );
create policy "companies update their own tasks"
  on tasks for update using (company_id = auth.uid());

-- applications: a seeker manages their own applications; the owning
-- company reads and updates (accept/reject) applications to its tasks.
create policy "seekers read their own applications"
  on applications for select using (
    seeker_id = auth.uid()
    or exists (select 1 from tasks where tasks.id = task_id and tasks.company_id = auth.uid())
  );
create policy "seekers create their own applications"
  on applications for insert with check (
    seeker_id = auth.uid()
    and exists (select 1 from profiles where id = auth.uid() and role = 'seeker')
  );
create policy "companies update applications to their tasks"
  on applications for update using (
    exists (select 1 from tasks where tasks.id = task_id and tasks.company_id = auth.uid())
  );

-- submissions: a seeker submits for their own accepted application; the
-- owning company reads it to evaluate.
create policy "read submissions if party to the application"
  on submissions for select using (
    exists (
      select 1 from applications a
      join tasks t on t.id = a.task_id
      where a.id = application_id
        and (a.seeker_id = auth.uid() or t.company_id = auth.uid())
    )
  );
create policy "seekers submit for their accepted applications"
  on submissions for insert with check (
    exists (
      select 1 from applications a
      where a.id = application_id
        and a.seeker_id = auth.uid()
        and a.status = 'accepted'
    )
  );

-- evaluations: readable by anyone signed in — this is the platform's
-- portfolio-proof mechanism, so a seeker's verified track record has to
-- be visible to companies that never posted the original task. Only the
-- owning company may write one.
create policy "evaluations are publicly readable"
  on evaluations for select using (true);
create policy "companies evaluate submissions to their tasks"
  on evaluations for insert with check (
    exists (
      select 1 from submissions s
      join applications a on a.id = s.application_id
      join tasks t on t.id = a.task_id
      where s.id = submission_id and t.company_id = auth.uid()
    )
  );
