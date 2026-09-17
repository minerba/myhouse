import { Star } from 'lucide-react';

export function StarRating({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.round(rating) ? 'fill-clay text-clay' : 'fill-line text-line'}
          />
        ))}
      </div>
      <span className="text-xs text-ink/60">
        {rating.toFixed(1)}
        {reviewCount !== undefined && ` (${reviewCount})`}
      </span>
    </div>
  );
}
