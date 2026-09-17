import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Heart, Minus, Plus, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import { getProductById, getRelatedProducts } from '../data/products';
import { StarRating } from '../components/StarRating';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const currency = (value: number) => `₩${value.toLocaleString('ko-KR')}`;

export function ProductDetail() {
  const { id } = useParams();
  const product = id ? getProductById(id) : undefined;
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { showToast } = useToast();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name ?? '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? '');
  const [quantity, setQuantity] = useState(1);

  if (!product) return <Navigate to="/shop" replace />;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    showToast(`${product.name}을(를) 장바구니에 담았습니다.`);
  };

  const related = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <nav className="mb-8 text-sm text-ink/50">
        <Link to="/" className="hover:text-clay">
          홈
        </Link>{' '}
        /{' '}
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-clay">
          {product.category}
        </Link>{' '}
        / <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="aspect-4/5 overflow-hidden rounded-2xl bg-sand">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-16 overflow-hidden rounded-lg border-2 ${
                    activeImage === i ? 'border-clay' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="animate-rise-in">
          <p className="text-sm uppercase tracking-wider text-ink/50">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{product.name}</h1>
          <div className="mt-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="font-display text-2xl font-semibold">{currency(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-ink/40 line-through">
                  {currency(product.originalPrice)}
                </span>
                <span className="rounded-full bg-clay/10 px-2.5 py-1 text-xs font-semibold text-clay">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-ink/70">{product.description}</p>

          <div className="mt-8">
            <p className="mb-3 text-sm font-semibold">
              색상: <span className="font-normal text-ink/60">{selectedColor}</span>
            </p>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={color.name}
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    selectedColor === color.name ? 'border-clay' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span
                    className="block h-full w-full rounded-full ring-1 ring-inset ring-ink/10"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-sm font-semibold">사이즈</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-11 rounded-lg border px-3 py-2 text-sm transition ${
                    selectedSize === size
                      ? 'border-ink bg-ink text-cream'
                      : 'border-line text-ink/70 hover:border-ink'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-line px-3 py-2.5">
              <button
                aria-label="수량 감소"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-ink/60 hover:text-ink"
              >
                <Minus size={16} />
              </button>
              <span className="w-5 text-center">{quantity}</span>
              <button
                aria-label="수량 증가"
                onClick={() => setQuantity((q) => q + 1)}
                className="text-ink/60 hover:text-ink"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-ink py-3.5 text-sm font-medium text-cream transition hover:bg-clay"
            >
              장바구니에 담기
            </button>

            <button
              onClick={() => toggle(product.id)}
              aria-label="위시리스트에 추가"
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-line hover:border-clay"
            >
              <Heart size={18} className={has(product.id) ? 'fill-clay text-clay' : 'text-ink'} />
            </button>
          </div>

          <div className="mt-8 space-y-3 border-t border-line pt-6 text-sm text-ink/60">
            {product.details.map((d) => (
              <p key={d}>· {d}</p>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm text-ink/60">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-clay" /> 무료 배송
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="text-clay" /> 30일 반품
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-clay" /> 안전 결제
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl font-semibold">함께 보면 좋은 상품</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
