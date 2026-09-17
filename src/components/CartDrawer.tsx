import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const currency = (value: number) => `₩${value.toLocaleString('ko-KR')}`;

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, subtotal } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div
        className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-[1px]"
        onClick={closeDrawer}
      />
      <div className="relative flex h-full w-full max-w-md animate-slide-in flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-xl font-semibold">장바구니 ({items.length})</h2>
          <button onClick={closeDrawer} aria-label="닫기" className="text-ink/60 hover:text-ink">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag size={40} className="text-ink/20" />
            <p className="text-ink/60">장바구니가 비어 있습니다.</p>
            <Link
              to="/shop"
              onClick={closeDrawer}
              className="mt-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-clay"
            >
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <li key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 py-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-24 w-20 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display text-sm font-medium leading-snug">
                            {item.product.name}
                          </p>
                          <button
                            onClick={() => removeItem(item.product.id, item.size, item.color)}
                            className="text-ink/40 hover:text-clay"
                            aria-label="삭제"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-ink/50">
                          {item.color} · {item.size}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-line px-2 py-1">
                          <button
                            aria-label="수량 감소"
                            onClick={() =>
                              updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                            }
                            className="text-ink/60 hover:text-ink disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-4 text-center text-sm">{item.quantity}</span>
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
                        <span className="text-sm font-medium">
                          {currency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-ink/60">소계</span>
                <span className="font-display text-lg font-semibold">{currency(subtotal)}</span>
              </div>
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="block w-full rounded-full bg-ink py-3.5 text-center text-sm font-medium text-cream transition hover:bg-clay"
              >
                장바구니 전체보기
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
