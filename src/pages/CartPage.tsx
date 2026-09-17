import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const currency = (value: number) => `₩${value.toLocaleString('ko-KR')}`;

export function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 3500;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-5 py-32 text-center">
        <ShoppingBag size={48} className="text-ink/20" />
        <h1 className="font-display text-2xl font-semibold">장바구니가 비어 있습니다</h1>
        <p className="text-ink/50">마음에 드는 상품을 담아보세요.</p>
        <Link
          to="/shop"
          className="mt-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-cream transition hover:bg-clay"
        >
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <h1 className="mb-8 font-display text-3xl font-semibold">장바구니</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-5 py-6">
                <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-32 w-24 rounded-xl object-cover sm:h-36 sm:w-28"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/product/${item.product.id}`}>
                        <p className="font-display text-lg font-medium hover:text-clay">
                          {item.product.name}
                        </p>
                      </Link>
                      <p className="mt-1 text-sm text-ink/50">
                        {item.color} · 사이즈 {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="text-ink/40 hover:text-clay"
                      aria-label="삭제"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-line px-3 py-2">
                      <button
                        aria-label="수량 감소"
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="text-ink/60 hover:text-ink disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-5 text-center text-sm">{item.quantity}</span>
                      <button
                        aria-label="수량 증가"
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                        }
                        className="text-ink/60 hover:text-ink"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-medium">{currency(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-fit rounded-2xl bg-sand p-6">
          <h2 className="font-display text-xl font-semibold">주문 요약</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>소계</span>
              <span>{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>배송비</span>
              <span>{shipping === 0 ? '무료' : currency(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-clay">
                {currency(50000 - subtotal)} 더 담으면 무료배송 혜택을 받을 수 있어요.
              </p>
            )}
          </div>
          <div className="mt-5 flex justify-between border-t border-ink/10 pt-5 font-display text-lg font-semibold">
            <span>총 합계</span>
            <span>{currency(subtotal + shipping)}</span>
          </div>
          <button className="mt-6 w-full rounded-full bg-ink py-3.5 text-sm font-medium text-cream transition hover:bg-clay">
            결제하기
          </button>
          <Link
            to="/shop"
            className="mt-3 block text-center text-sm text-ink/60 hover:text-clay"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}
