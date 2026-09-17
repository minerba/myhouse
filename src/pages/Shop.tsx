import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { categories, products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const [sort, setSort] = useState<SortKey>('featured');
  const [maxPrice, setMaxPrice] = useState(300000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const setCategory = (category: string | null) => {
    if (category) setSearchParams({ category });
    else setSearchParams({});
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);

    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [activeCategory, sort, maxPrice]);

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-sm font-semibold">카테고리</p>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setCategory(null)}
              className={`text-sm ${!activeCategory ? 'font-semibold text-clay' : 'text-ink/70 hover:text-ink'}`}
            >
              전체
            </button>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <button
                onClick={() => setCategory(c)}
                className={`text-sm ${activeCategory === c ? 'font-semibold text-clay' : 'text-ink/70 hover:text-ink'}`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold">
          최대 가격: ₩{maxPrice.toLocaleString('ko-KR')}
        </p>
        <input
          type="range"
          min={30000}
          max={300000}
          step={10000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-clay"
        />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">{activeCategory ?? '전체 상품'}</h1>
        <p className="mt-2 text-sm text-ink/50">{filtered.length}개의 상품</p>
      </div>

      <div className="flex gap-10">
        <aside className="hidden w-56 flex-shrink-0 lg:block">{FilterPanel}</aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm lg:hidden"
            >
              <SlidersHorizontal size={14} /> 필터
            </button>
            <div className="ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-line bg-cream px-4 py-2 text-sm outline-none"
              >
                <option value="featured">추천순</option>
                <option value="price-asc">낮은 가격순</option>
                <option value="price-desc">높은 가격순</option>
                <option value="rating">평점순</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-ink/50">
              <p>조건에 맞는 상품이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto h-full w-72 animate-slide-in overflow-y-auto bg-cream p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-lg font-semibold">필터</p>
              <button onClick={() => setFiltersOpen(false)} aria-label="닫기">
                <X size={20} />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}
