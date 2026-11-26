import { RotateCcw } from 'lucide-react';
import { BRANCHES, CATEGORIES } from '../data/products';
import { BranchId, CategoryId, Product } from '../types/store';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  branch: BranchId;
  activeCategory: CategoryId;
  searchQuery: string;
  getQuantity: (productId: string) => number;
  onAdd: (product: Product) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onResetFilters: () => void;
}

export function ProductGrid({
  products,
  branch,
  activeCategory,
  searchQuery,
  getQuantity,
  onAdd,
  onUpdateQty,
  onResetFilters,
}: ProductGridProps) {
  const activeBranch = BRANCHES[branch];
  const categoryName =
    CATEGORIES.find((c) => c.id === activeCategory)?.label ?? 'Semua Produk';
  const hasFilter = activeCategory !== 'semua' || searchQuery.trim().length > 0;

  return (
    <section id="katalog" className="py-10 md:py-12 border-b border-[#E5E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#666660]">
              <span className="font-medium text-[#005A2B]">
                Stok {activeBranch.name}
              </span>
              <span aria-hidden="true">·</span>
              <span>{categoryName}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{products.length} produk</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#1A1A1A]">
              Kebutuhan Harian
            </h2>
          </div>

          {hasFilter && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#666660] hover:text-[#1A1A1A] transition-colors self-start sm:self-end cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset filter</span>
            </button>
          )}
        </div>

        {/* Grid or Empty State */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getQuantity(product.id)}
                onAdd={onAdd}
                onUpdateQty={onUpdateQty}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5E4DF] rounded-xl p-10 text-center">
            <p className="text-base font-bold text-[#1A1A1A]">
              Produk &ldquo;{searchQuery}&rdquo; belum ditemukan
            </p>
            <p className="mt-1.5 text-sm text-[#666660] max-w-md mx-auto">
              Coba kata kunci lain seperti beras, kopi Gayo, onigiri, atau
              tampilkan semua kategori produk.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-5 inline-flex items-center justify-center gap-2 h-10 px-4 bg-[#005A2B] hover:bg-[#004420] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <span>Tampilkan Semua Produk</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
