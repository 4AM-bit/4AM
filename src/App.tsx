import { useEffect, useMemo, useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { CartDrawer } from './components/CartDrawer';
import { CategoryStrip } from './components/CategoryStrip';
import { ChatWidget } from './components/ChatWidget';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { ServiceTrustBar } from './components/ServiceTrustBar';
import { UmkmSection } from './components/UmkmSection';
import { BRANCHES, formatRupiah, PRODUCTS } from './data/products';
import {
  BranchId,
  CartItem,
  CategoryId,
  Product,
  SortMode,
} from './types/store';

const STORAGE_CART_KEY = '4am_minimarket_cart_v1';
const STORAGE_BRANCH_KEY = '4am_minimarket_branch_v1';

function loadInitialBranch(): BranchId {
  try {
    const saved = window.localStorage.getItem(STORAGE_BRANCH_KEY);
    if (saved === 'jakarta' || saved === 'aceh') return saved;
  } catch {
    // Ignore storage read errors in restricted environments
  }
  return 'jakarta';
}

function loadInitialCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<{ id: string; quantity: number }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => {
        const product = PRODUCTS.find((p) => p.id === entry.id);
        if (!product || typeof entry.quantity !== 'number' || entry.quantity <= 0) {
          return null;
        }
        return { product, quantity: Math.floor(entry.quantity) };
      })
      .filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
}

export default function App() {
  const [branch, setBranch] = useState<BranchId>(loadInitialBranch);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('recommended');
  const [cart, setCart] = useState<CartItem[]>(loadInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_BRANCH_KEY, branch);
    } catch {
      // Ignore storage write errors
    }
  }, [branch]);

  useEffect(() => {
    try {
      const compact = cart.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      }));
      window.localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(compact));
    } catch {
      // Ignore storage write errors
    }
  }, [cart]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = PRODUCTS.filter((product) => {
      if (activeCategory !== 'semua' && product.category !== activeCategory) {
        return false;
      }

      if (!normalizedQuery) return true;

      const searchable = [
        product.name,
        product.categoryLabel,
        product.shortNote,
        product.umkmOrigin ?? '',
        product.umkmRegion ?? '',
        product.unit,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === 'price-asc') return a.price - b.price;
      if (sortMode === 'price-desc') return b.price - a.price;
      return a.branchPriority[branch] - b.branchPriority[branch];
    });
  }, [activeCategory, searchQuery, sortMode, branch]);

  const getQuantity = (productId: string) =>
    cart.find((item) => item.product.id === productId)?.quantity ?? 0;

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setToastMessage(`${product.name} ditambahkan ke keranjang`);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleBranchChange = (nextBranch: BranchId) => {
    if (nextBranch === branch) return;
    setBranch(nextBranch);
    setToastMessage(
      `Lokasi diubah ke ${BRANCHES[nextBranch].name} · Katalog disesuaikan`
    );
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetHome = () => {
    setActiveCategory('semua');
    setSearchQuery('');
    setSortMode('recommended');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryAndScroll = (category: CategoryId) => {
    setActiveCategory(category);
    scrollToSection('katalog');
  };

  const handleQuickWhatsApp = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSubmitted = () => {
    setToastMessage(`Ringkasan pesanan dibuka untuk WhatsApp ${BRANCHES[branch].name}`);
  };

  const showUmkmEditorial =
    activeCategory === 'semua' && searchQuery.trim().length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A]">
      <Header
        branch={branch}
        onBranchChange={handleBranchChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onQuickWhatsApp={handleQuickWhatsApp}
        onResetHome={handleResetHome}
      />

      <main className="flex-1">
        <HeroSection
          branch={branch}
          onBranchChange={handleBranchChange}
          onStartShopping={() => scrollToSection('katalog')}
          onOrderWhatsApp={handleQuickWhatsApp}
          onSelectUmkm={() => scrollToSection('umkm')}
        />

        <CategoryStrip
          branch={branch}
          onBranchChange={handleBranchChange}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          sortMode={sortMode}
          onSortChange={setSortMode}
        />

        {showUmkmEditorial && (
          <UmkmSection
            products={PRODUCTS}
            branch={branch}
            getQuantity={getQuantity}
            onAdd={handleAddToCart}
            onUpdateQty={handleUpdateQty}
            onViewAllUmkm={() => handleSelectCategoryAndScroll('umkm-lokal')}
          />
        )}

        <ProductGrid
          products={filteredProducts}
          branch={branch}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          getQuantity={getQuantity}
          onAdd={handleAddToCart}
          onUpdateQty={handleUpdateQty}
          onResetFilters={() => {
            setActiveCategory('semua');
            setSearchQuery('');
            setSortMode('recommended');
          }}
        />

        <ServiceTrustBar />
      </main>

      <Footer
        activeBranch={branch}
        onSelectBranch={handleBranchChange}
        onSelectCategory={handleSelectCategoryAndScroll}
      />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        subtotal={subtotal}
        branch={branch}
        onBranchChange={handleBranchChange}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={subtotal}
        branch={branch}
        onBranchChange={handleBranchChange}
        onOrderSubmitted={handleOrderSubmitted}
      />

      {/* Floating n8n-Integrated Chatbot Widget */}
      <ChatWidget
        branch={branch}
        cart={cart}
        subtotal={subtotal}
        hidden={isCartOpen || isCheckoutOpen}
        onAddProduct={handleAddToCart}
        onOpenCheckout={handleQuickWhatsApp}
      />

      {/* Subtle Bottom-Right Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-4 left-4 sm:left-auto z-40 sm:max-w-sm bg-[#1A1A1A] text-white px-4 py-3 rounded-xl border border-white/10 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Check className="w-4 h-4 text-[#F5820D] shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-medium truncate">
              {toastMessage}
            </span>
          </div>
          {cartCount > 0 && !isCartOpen && !isCheckoutOpen && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F5820D] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="tabular-nums">{formatRupiah(subtotal)}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
