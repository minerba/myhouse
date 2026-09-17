import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { StarRating } from './StarRating';

const currency = (value: number) => `₩${value.toLocaleString('ko-KR')}`;

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group animate-rise-in"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-sand">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <img
            src={product.images[1] ?? product.images[0]}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-clay px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                -{discount}%
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            aria-label="위시리스트에 추가"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 backdrop-blur transition-transform hover:scale-110"
          >
            <Heart size={16} className={wished ? 'fill-clay text-clay' : 'text-ink'} />
          </button>
        </div>
      </Link>

      <div className="mt-3 space-y-1">
        <p className="text-[11px] uppercase tracking-wider text-ink/50">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-base leading-snug text-ink hover:text-clay">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="flex items-center gap-2 pt-0.5">
          <span className="font-medium text-ink">{currency(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-ink/40 line-through">
              {currency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
