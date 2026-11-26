import { Minus, Plus } from 'lucide-react';
import { formatRupiah } from '../data/products';
import { Product } from '../types/store';
import { ProductArtwork } from './ProductArtwork';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onUpdateQty: (productId: string, delta: number) => void;
}

export function ProductCard({
  product,
  quantity,
  onAdd,
  onUpdateQty,
}: ProductCardProps) {
  return (
    <article className="bg-white border border-[#E5E4DF] hover:border-[#C9C7BE] rounded-xl overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5">
      <ProductArtwork
        kind={product.visualKind}
        category={product.category}
        unit={product.unit}
      />

      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean unboxed category or UMKM origin text */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs mb-1 truncate">
            {product.isUmkm && product.umkmOrigin ? (
              <>
                <span className="font-semibold text-[#D96F06] truncate">
                  {product.umkmOrigin}
                </span>
                {product.umkmRegion && (
                  <>
                    <span className="text-[#666660]" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-[#666660] truncate">
                      {product.umkmRegion}
                    </span>
                  </>
                )}
              </>
            ) : (
              <span className="text-[#666660] truncate">
                {product.categoryLabel}
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-[15px] font-semibold text-[#1A1A1A] leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-[#666660] line-clamp-2 hidden sm:block leading-relaxed">
            {product.shortNote}
          </p>
        </div>

        {/* Aligned Price & Add/Stepper Baseline */}
        <div className="mt-4 pt-3 border-t border-[#E5E4DF] flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm sm:text-base font-bold text-[#1A1A1A] tabular-nums">
              {formatRupiah(product.price)}
            </span>
            <span className="text-[11px] text-[#666660] tabular-nums shrink-0">
              {product.unit}
            </span>
          </div>

          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => onAdd(product)}
              className="w-full h-9 sm:h-10 inline-flex items-center justify-center gap-1.5 bg-[#FAF9F6] hover:bg-[#005A2B] text-[#005A2B] hover:text-white border border-[#005A2B]/30 hover:border-[#005A2B] rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A2B]"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Keranjang</span>
            </button>
          ) : (
            <div className="w-full h-9 sm:h-10 inline-flex items-center justify-between bg-[#005A2B] text-white rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => onUpdateQty(product.id, -1)}
                aria-label={`Kurangi jumlah ${product.name}`}
                className="w-10 h-full flex items-center justify-center hover:bg-[#004420] transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs sm:text-sm font-bold tabular-nums">
                {quantity} di keranjang
              </span>
              <button
                type="button"
                onClick={() => onUpdateQty(product.id, 1)}
                aria-label={`Tambah jumlah ${product.name}`}
                className="w-10 h-full flex items-center justify-center hover:bg-[#004420] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
