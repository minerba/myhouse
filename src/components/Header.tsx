import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { categories } from '../data/products';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors hover:text-clay ${
    isActive ? 'text-clay' : 'text-ink/80'
  }`;

export function Header() {
  const { totalItems, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? 'border-line bg-cream/90 backdrop-blur-md' : 'border-transparent bg-cream'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          className="lg:hidden"
          aria-label="메뉴 열기"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
          ATELIER<span className="text-clay">.</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            홈
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            전체 상품
          </NavLink>
          {categories.map((c) => (
            <NavLink key={c} to={`/shop?category=${encodeURIComponent(c)}`} className={navLinkClass}>
              {c}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="검색" className="hidden sm:block text-ink/80 hover:text-clay">
            <Search size={20} />
          </button>
          <button aria-label="위시리스트" className="hidden sm:block text-ink/80 hover:text-clay">
            <Heart size={20} />
          </button>
          <button
            aria-label="장바구니 열기"
            onClick={openDrawer}
            className="relative text-ink/80 hover:text-clay"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-clay text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-line px-5 py-4 lg:hidden">
          <NavLink to="/" end className="py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>
            홈
          </NavLink>
          <NavLink to="/shop" className="py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>
            전체 상품
          </NavLink>
          {categories.map((c) => (
            <NavLink
              key={c}
              to={`/shop?category=${encodeURIComponent(c)}`}
              className="py-2 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {c}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
