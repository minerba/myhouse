'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Task, ApplicationStatus } from '@/lib/types';

interface TrackRecord {
  seeker_id: string;
  completed_count: number;
  avg_score: number | null;
  would_hire_count: number;
}

interface ApplicationRow {
  id: string;
  status: ApplicationStatus;
  applied_at: string;
  profiles: { id: string; name: string } | null;
  submissions:
    | {
        id: string;
        content_url: string;
        notes: string | null;
        evaluations: { id: string; score: number; feedback: string; would_hire: boolean }[];
      }[]
    | null;
}

export function TaskDetailClient({ taskId }: { taskId: string }) {
  const supabase = createClient();
  const [task, setTask] = useState<Task | null>(null);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [trackRecords, setTrackRecords] = useState<Record<string, TrackRecord>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: taskData } = await supabase.from('tasks').select('*').eq('id', taskId).single();
    setTask(taskData);

    const { data: appData } = await supabase
      .from('applications')
      .select(
        'id, status, applied_at, profiles(id, name), submissions(id, content_url, notes, evaluations(id, score, feedback, would_hire))'
      )
      .eq('task_id', taskId)
      .order('applied_at', { ascending: true });

    const rows = (appData ?? []) as unknown as ApplicationRow[];
    setApplications(rows);

    const seekerIds = rows.map((r) => r.profiles?.id).filter((v): v is string => Boolean(v));
    if (seekerIds.length > 0) {
      const { data: trackData } = await supabase
        .from('seeker_track_record')
        .select('*')
        .in('seeker_id', seekerIds);
      const map: Record<string, TrackRecord> = {};
      (trackData ?? []).forEach((t) => {
        map[t.seeker_id] = t;
      });
      setTrackRecords(map);
    }

    setLoading(false);
  }, [supabase, taskId]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
    setBusyId(applicationId);
    await supabase.from('applications').update({ status }).eq('id', applicationId);
    await load();
    setBusyId(null);
  }

  async function submitEvaluation(
    submissionId: string,
    score: number,
    feedback: string,
    wouldHire: boolean
  ) {
    setBusyId(submissionId);
    await supabase
      .from('evaluations')
      .insert({ submission_id: submissionId, score, feedback, would_hire: wouldHire });
    await load();
    setBusyId(null);
  }

  if (loading) return <p className="text-sm text-ink/40">불러오는 중...</p>;
  if (!task) return <p className="text-sm text-ink/40">태스크를 찾을 수 없습니다.</p>;

  return (
    <div>
      <div className="mb-8 rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-ink">{task.title}</h1>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              task.status === 'open' ? 'bg-brand/10 text-brand' : 'bg-ink/10 text-ink/50'
            }`}
          >
            {task.status === 'open' ? '모집중' : '마감'}
          </span>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm text-ink/70">{task.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {task.skill_tags.map((tag) => (
            <span key={tag} className="rounded-full bg-background px-2.5 py-1 text-xs text-ink/60">
              #{tag}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink/50">
          {task.reward_amount.toLocaleString('ko-KR')}원 · {task.duration_days}일
        </p>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-ink">지원자 ({applications.length})</h2>

      {applications.length === 0 ? (
        <p className="text-sm text-ink/40">아직 지원자가 없어요.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => {
            const submission = app.submissions?.[0];
            const evaluation = submission?.evaluations?.[0];
            const track = app.profiles ? trackRecords[app.profiles.id] : undefined;

            return (
              <li key={app.id} className="rounded-xl border border-line bg-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink">{app.profiles?.name ?? '알 수 없음'}</p>
                    {track && track.completed_count > 0 && (
                      <p className="mt-0.5 text-xs text-ink/50">
                        검증된 실적 {track.completed_count}건 · 평균 {track.avg_score}점 · 채용
                        의향 {track.would_hire_count}건
                      </p>
                    )}
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                {app.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <button
                      disabled={busyId === app.id}
                      onClick={() => updateApplicationStatus(app.id, 'accepted')}
                      className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      수락
                    </button>
                    <button
                      disabled={busyId === app.id}
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink/60 hover:border-ink/30 disabled:opacity-50"
                    >
                      거절
                    </button>
                  </div>
                )}

                {app.status === 'accepted' && !submission && (
                  <p className="mt-4 text-sm text-ink/40">결과물 제출 대기중...</p>
                )}

                {submission && (
                  <div className="mt-4 rounded-lg bg-background p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
                      제출된 결과물
                    </p>
                    <a
                      href={submission.content_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block break-all text-sm text-brand underline"
                    >
                      {submission.content_url}
                    </a>
                    {submission.notes && (
                      <p className="mt-2 text-sm text-ink/70">{submission.notes}</p>
                    )}

                    {evaluation ? (
                      <div className="mt-4 border-t border-line pt-4">
                        <p className="text-sm font-medium text-ink">
                          평가 완료 · {evaluation.score}/5점
                          {evaluation.would_hire && (
                            <span className="ml-2 text-xs font-medium text-brand">
                              정규직 전환 의향 있음
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-sm text-ink/60">{evaluation.feedback}</p>
                      </div>
                    ) : (
                      <EvaluationForm
                        busy={busyId === submission.id}
                        onSubmit={(score, feedback, wouldHire) =>
                          submitEvaluation(submission.id, score, feedback, wouldHire)
                        }
                      />
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const label = { pending: '검토 대기', accepted: '수락됨', rejected: '거절됨' }[status];
  const style = {
    pending: 'bg-accent/15 text-accent',
    accepted: 'bg-brand/10 text-brand',
    rejected: 'bg-ink/10 text-ink/40',
  }[status];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>{label}</span>;
}

function EvaluationForm({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: (score: number, feedback: string, wouldHire: boolean) => void;
}) {
  const [score, setScore] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [wouldHire, setWouldHire] = useState(true);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(score, feedback, wouldHire);
      }}
      className="mt-4 space-y-3 border-t border-line pt-4"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-ink/60">점수 (1~5)</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setScore(n)}
              className={`h-8 w-8 rounded-full text-sm font-medium ${
                n <= score ? 'bg-accent text-white' : 'bg-line text-ink/40'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-ink/60">피드백</label>
        <textarea
          required
          rows={2}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="이 결과물에 대한 평가를 남겨주세요. 다른 기업도 볼 수 있는 검증된 실적이 됩니다."
          className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          checked={wouldHire}
          onChange={(e) => setWouldHire(e.target.checked)}
        />
        이 지원자를 정규직으로 전환하고 싶어요
      </label>
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/80 disabled:opacity-50"
      >
        {busy ? '저장 중...' : '평가 제출하기'}
      </button>
    </form>
  );
}
