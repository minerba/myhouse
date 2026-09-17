import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import { categories, products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

const heroImg = (seed: string, w = 1200, h = 1400) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export function Home() {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div>
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-8 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-16">
        <div className="animate-rise-in">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-clay">
            2026 Autumn Collection
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.15] text-ink sm:text-5xl lg:text-6xl">
            일상에 감도를
            <br />
            더하는 옷장
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">
            군더더기 없는 실루엣과 좋은 소재. ATELIER는 오래 입을 수 있는 옷을 만듭니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-cream transition hover:bg-clay"
            >
              쇼핑하러 가기 <ArrowRight size={16} />
            </Link>
            <Link
              to="/shop?category=Outerwear"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-3.5 text-sm font-medium text-ink transition hover:border-ink"
            >
              신상 아우터 보기
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
            src={heroImg('hero-main')}
            alt="ATELIER 컬렉션"
            className="col-span-2 h-72 w-full rounded-3xl object-cover sm:h-96"
          />
          <img
            src={heroImg('hero-a', 700, 900)}
            alt="ATELIER 룩"
            className="h-40 w-full rounded-3xl object-cover sm:h-56"
          />
          <img
            src={heroImg('hero-b', 700, 900)}
            alt="ATELIER 룩"
            className="h-40 w-full rounded-3xl object-cover sm:h-56"
          />
        </div>
      </section>

      <section className="border-y border-line bg-sand">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-10 sm:grid-cols-3 lg:px-8">
          {[
            { icon: Truck, title: '무료 배송', desc: '5만원 이상 구매 시' },
            { icon: RefreshCw, title: '30일 교환/반품', desc: '간편한 반품 절차' },
            { icon: ShieldCheck, title: '안전한 결제', desc: '검증된 결제 시스템' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cream">
                <Icon size={20} className="text-clay" />
              </div>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-ink/50">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">카테고리</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c}
              to={`/shop?category=${encodeURIComponent(c)}`}
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <img
                src={heroImg(`cat-${c}`, 400, 400)}
                alt={c}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-ink/30 transition-colors group-hover:bg-ink/40" />
              <span className="absolute bottom-4 left-4 font-display text-lg font-medium text-white">
                {c}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-clay">Best Sellers</p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
              가장 사랑받는 아이템
            </h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-medium hover:text-clay sm:flex">
            전체보기 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-clay">New Arrivals</p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">새로 나온 상품</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-medium hover:text-clay sm:flex">
            전체보기 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-ink px-8 py-16 text-center">
          <h2 className="font-display text-2xl font-semibold text-cream sm:text-3xl">
            지금 바로 나만의 스타일을 완성하세요
          </h2>
          <p className="max-w-md text-sm text-cream/60">
            신규 가입 시 첫 구매 10% 할인 쿠폰을 드립니다.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-clay hover:text-white"
          >
            쇼핑 시작하기 <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
