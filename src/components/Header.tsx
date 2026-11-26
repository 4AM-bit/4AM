import { MapPin, MessageCircle, Search, ShoppingBag, X } from 'lucide-react';
import { BranchId } from '../types/store';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  branch: BranchId;
  onBranchChange: (branch: BranchId) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onQuickWhatsApp: () => void;
  onResetHome: () => void;
}

export function Header({
  branch,
  onBranchChange,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onQuickWhatsApp,
  onResetHome,
}: HeaderProps) {
  const toggleBranch = () => {
    onBranchChange(branch === 'jakarta' ? 'aceh' : 'jakarta');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main row */}
        <div className="h-14 md:h-16 flex items-center justify-between gap-3 md:gap-6">
          {/* Left: Official 4 AM Logo (no duplicate text) */}
          <button
            type="button"
            onClick={onResetHome}
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A2B] rounded-md py-1 cursor-pointer"
            aria-label="Kembali ke beranda 4 AM dan reset filter"
          >
            <BrandLogo className="h-9 md:h-11 w-auto object-contain" />
          </button>

          {/* Center: Desktop real-time search bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search
                className="w-4 h-4 text-[#666660] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari beras, kopi lokal, atau kebutuhan harian..."
                aria-label="Cari produk di 4 AM"
                className="w-full h-10 pl-10 pr-9 bg-white border border-[#E5E4DF] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#666660] focus:outline-none focus:border-[#005A2B] focus:ring-1 focus:ring-[#005A2B] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#666660] hover:text-[#1A1A1A] cursor-pointer"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Location Switcher, Subtle WhatsApp CTA, Cart Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Interactive Location Switcher */}
            <button
              type="button"
              onClick={toggleBranch}
              title="Klik untuk ganti cabang Jakarta / Aceh"
              className="inline-flex items-center gap-1.5 h-10 px-3 bg-white border border-[#E5E4DF] hover:border-[#005A2B] rounded-lg text-xs sm:text-sm font-medium text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A2B]"
            >
              <MapPin className="w-3.5 h-3.5 text-[#005A2B] shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline text-[#666660] font-normal">Lokasi:</span>
              <span className="font-semibold text-[#1A1A1A]">
                {branch === 'jakarta' ? 'Jakarta' : 'Aceh'}
              </span>
            </button>

            {/* Subtle WhatsApp Quick Button (Desktop) */}
            <button
              type="button"
              onClick={onQuickWhatsApp}
              className="hidden lg:inline-flex items-center gap-1.5 h-10 px-3.5 bg-transparent border border-[#E5E4DF] hover:border-[#005A2B] hover:text-[#005A2B] rounded-lg text-sm font-medium text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A2B]"
            >
              <MessageCircle className="w-4 h-4 text-[#005A2B] shrink-0" aria-hidden="true" />
              <span>Pesan via WhatsApp</span>
            </button>

            {/* Cart Button with Logo Orange Badge */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Buka keranjang belanja, ${cartCount} barang`}
              className="relative inline-flex items-center gap-2 h-10 px-3.5 bg-[#005A2B] hover:bg-[#004420] text-white rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#005A2B]"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Keranjang</span>
              <span
                className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold tabular-nums transition-transform ${
                  cartCount > 0
                    ? 'bg-[#F5820D] text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Row (compact, keeps sticky height well within budget) */}
        <div className="md:hidden pb-2.5">
          <div className="relative w-full">
            <Search
              className="w-4 h-4 text-[#666660] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari beras, kopi lokal, kebutuhan harian..."
              aria-label="Cari produk di 4 AM"
              className="w-full h-9 pl-9 pr-8 bg-white border border-[#E5E4DF] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#666660] focus:outline-none focus:border-[#005A2B]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#666660] hover:text-[#1A1A1A]"
                aria-label="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
