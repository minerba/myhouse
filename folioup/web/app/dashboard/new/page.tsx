'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/Header';

export default function NewTaskPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillTags, setSkillTags] = useState('');
  const [reward, setReward] = useState('300000');
  const [duration, setDuration] = useState('7');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('tasks').insert({
      company_id: user.id,
      title,
      description,
      skill_tags: skillTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      reward_amount: Number(reward),
      duration_days: Number(duration),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="mb-1 text-2xl font-semibold text-ink">새 태스크 올리기</h1>
        <p className="mb-8 text-sm text-ink/50">
          실제 업무를 1~2주 단위로 잘게 쪼개서 올려주세요. 완료 후 평가가 지원자의 검증된
          실적으로 남습니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-line bg-surface p-6">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
              제목
            </label>
            <input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 인스타그램 카드뉴스 10건 제작"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              업무 설명
            </label>
            <textarea
              id="description"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="구체적인 결과물, 참고 자료, 완료 기준을 적어주세요."
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label htmlFor="skillTags" className="mb-1.5 block text-sm font-medium">
              필요 역량 (쉼표로 구분)
            </label>
            <input
              id="skillTags"
              value={skillTags}
              onChange={(e) => setSkillTags(e.target.value)}
              placeholder="마케팅, 카피라이팅, 캔바"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="reward" className="mb-1.5 block text-sm font-medium">
                보수 (원)
              </label>
              <input
                id="reward"
                type="number"
                min={0}
                required
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label htmlFor="duration" className="mb-1.5 block text-sm font-medium">
                수행 기간 (일)
              </label>
              <input
                id="duration"
                type="number"
                min={1}
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? '등록 중...' : '태스크 등록하기'}
          </button>
        </form>
      </main>
    </>
  );
}
