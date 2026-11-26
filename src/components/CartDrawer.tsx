import { useEffect } from 'react';
import {
  ArrowRight,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { BRANCHES, formatRupiah } from '../data/products';
import { BranchId, CartItem } from '../types/store';
import { BrandLogo } from './BrandLogo';
import { ProductArtwork } from './ProductArtwork';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  branch: BranchId;
  onBranchChange: (branch: BranchId) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  subtotal,
  branch,
  onBranchChange,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}: CartDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const activeBranch = BRANCHES[branch];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Keranjang Belanja 4 AM"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1A1A1A]/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#FAF9F6] h-full flex flex-col border-l border-[#E5E4DF]">
        {/* Header with Compact Logo */}
        <div className="px-5 py-4 bg-white border-b border-[#E5E4DF] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo className="h-7 w-auto object-contain shrink-0" />
            <div className="h-5 w-px bg-[#E5E4DF]" aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[#1A1A1A] leading-tight">
                Keranjang Belanja
              </h2>
              <p className="text-xs text-[#666660] tabular-nums">
                {totalCount} barang · {activeBranch.cityLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup keranjang"
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-[#666660] hover:text-[#1A1A1A] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Branch Selector Strip */}
        <div className="px-5 py-3 bg-[#FAF9F6] border-b border-[#E5E4DF] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#666660] min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#005A2B] shrink-0" aria-hidden="true" />
            <span className="truncate">
              Diproses oleh <strong className="text-[#1A1A1A]">{activeBranch.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              onBranchChange(branch === 'jakarta' ? 'aceh' : 'jakarta')
            }
            className="text-xs font-semibold text-[#005A2B] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ganti ke {branch === 'jakarta' ? 'Aceh' : 'Jakarta'}
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E4DF] flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5 text-[#666660]" aria-hidden="true" />
              </div>
              <p className="text-base font-bold text-[#1A1A1A]">
                Keranjang masih kosong
              </p>
              <p className="mt-1.5 text-sm text-[#666660] max-w-xs leading-relaxed">
                Pilih kebutuhan harian atau produk UMKM lokal dari katalog untuk
                mulai berbelanja.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 h-10 px-5 bg-[#005A2B] hover:bg-[#004420] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Lihat Katalog Produk
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#666660]">
                  Daftar Belanja
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#666660] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Kosongkan</span>
                </button>
              </div>

              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#E5E4DF] rounded-xl p-3 flex gap-3"
                >
                  <div className="w-16 h-16 shrink-0">
                    <ProductArtwork
                      kind={product.visualKind}
                      category={product.category}
                      unit={product.unit}
                      compact
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1A1A1A] leading-snug line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#666660] mt-0.5 tabular-nums">
                          {formatRupiah(product.price)} · {product.unit}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Hapus ${product.name}`}
                        className="p-1 text-[#666660] hover:text-[#1A1A1A] shrink-0 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center h-8 bg-[#FAF9F6] border border-[#E5E4DF] rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, -1)}
                          aria-label={`Kurangi ${product.name}`}
                          className="w-8 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E4DF]/60 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#1A1A1A] tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, 1)}
                          aria-label={`Tambah ${product.name}`}
                          className="w-8 h-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E4DF]/60 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#1A1A1A] tabular-nums">
                        {formatRupiah(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Subtotal & Checkout CTA */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E5E4DF] space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666660]">
                  Subtotal ({totalCount} barang)
                </span>
                <span className="text-lg font-extrabold text-[#1A1A1A] tabular-nums">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <p className="text-xs text-[#666660]">
                Pilih pesan antar atau ambil di toko pada langkah berikutnya.
              </p>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full h-11 px-4 bg-[#005A2B] hover:bg-[#004420] text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#005A2B]"
            >
              <span>Lanjut ke Checkout</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
