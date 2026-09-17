import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-5 py-32 text-center">
      <p className="font-display text-6xl font-semibold text-clay">404</p>
      <h1 className="font-display text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <p className="text-ink/50">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <Link
        to="/"
        className="mt-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-cream transition hover:bg-clay"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
