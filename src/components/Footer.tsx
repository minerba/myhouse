export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-sand">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-2xl font-semibold">
              ATELIER<span className="text-clay">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">
              일상에 감도를 더하는 미니멀 라이프스타일 브랜드.
            </p>
            <div className="mt-5 flex gap-2.5">
              {['IG', 'FB', 'X'].map((label) => (
                <span
                  key={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-[10px] font-semibold text-ink/60 transition hover:border-clay hover:text-clay"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">쇼핑</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/60">
              <li>신상품</li>
              <li>베스트셀러</li>
              <li>세일</li>
              <li>전체 카테고리</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">고객 지원</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/60">
              <li>배송 안내</li>
              <li>교환 및 반품</li>
              <li>자주 묻는 질문</li>
              <li>문의하기</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">뉴스레터</p>
            <p className="mt-4 text-sm text-ink/60">신상품과 특별 혜택 소식을 받아보세요.</p>
            <form
              className="mt-3 flex overflow-hidden rounded-full border border-ink/20 bg-cream"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="이메일 주소"
                className="w-full min-w-0 bg-transparent px-4 py-2.5 text-sm outline-none"
              />
              <button className="whitespace-nowrap bg-ink px-4 py-2.5 text-sm font-medium text-cream hover:bg-clay">
                구독
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink/50 sm:flex-row">
          <p>© 2026 ATELIER. All rights reserved.</p>
          <p>이 사이트는 데모용 프론트엔드입니다.</p>
        </div>
      </div>
    </footer>
  );
}
