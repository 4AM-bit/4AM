import { ArrowRight, Minus, Plus } from 'lucide-react';
import { formatRupiah } from '../data/products';
import { BranchId, Product } from '../types/store';
import { ProductArtwork } from './ProductArtwork';

interface UmkmSectionProps {
  products: Product[];
  branch: BranchId;
  getQuantity: (productId: string) => number;
  onAdd: (product: Product) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onViewAllUmkm: () => void;
}

export function UmkmSection({
  products,
  branch,
  getQuantity,
  onAdd,
  onUpdateQty,
  onViewAllUmkm,
}: UmkmSectionProps) {
  // Prioritize branch-relevant UMKM items while preserving curated 3-card balance
  const featured = [...products]
    .filter((p) => p.featuredUmkm)
    .sort((a, b) => a.branchPriority[branch] - b.branchPriority[branch]);

  return (
    <section id="umkm" className="py-10 md:py-12 border-b border-[#E5E4DF] bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-[#D96F06]">
              Kemitraan Langsung · Pengrajin Aceh &amp; Jakarta
            </p>
            <h2 className="mt-1 text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#1A1A1A]">
              Etalase UMKM Lokal Pilihan
            </h2>
            <p className="mt-1.5 text-sm text-[#666660] max-w-2xl">
              Produk unggulan dari pelaku usaha lokal terpilih dengan harga
              jujur dan pasokan segar setiap pekan.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllUmkm}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#005A2B] hover:text-[#004420] transition-colors whitespace-nowrap shrink-0 self-start sm:self-end cursor-pointer"
          >
            <span>Lihat semua produk UMKM</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* 3-Column Curated Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured.map((product) => {
            const qty = getQuantity(product.id);
            return (
              <article
                key={product.id}
                className="bg-white border border-[#E5E4DF] hover:border-[#D96F06]/60 rounded-xl overflow-hidden flex flex-col transition-colors"
              >
                <ProductArtwork
                  kind={product.visualKind}
                  category={product.category}
                  unit={product.unit}
                />

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Crisp unboxed origin metadata */}
                    <div className="flex items-center gap-1.5 text-xs mb-1.5">
                      <span className="font-semibold text-[#D96F06]">
                        {product.umkmOrigin}
                      </span>
                      {product.umkmRegion && (
                        <>
                          <span className="text-[#666660]" aria-hidden="true">
                            ·
                          </span>
                          <span className="text-[#666660]">
                            {product.umkmRegion}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#1A1A1A] leading-snug">
                      {product.name}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#666660] leading-relaxed">
                      {product.shortNote}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E5E4DF] flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-[#666660]">
                        Harga · {product.unit}
                      </p>
                      <p className="text-base font-bold text-[#1A1A1A] tabular-nums">
                        {formatRupiah(product.price)}
                      </p>
                    </div>

                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => onAdd(product)}
                        className="inline-flex items-center justify-center gap-1.5 h-10 px-4 bg-[#005A2B] hover:bg-[#004420] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A2B]"
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        <span>Keranjang</span>
                      </button>
                    ) : (
                      <div className="inline-flex items-center h-10 bg-[#FAF9F6] border border-[#005A2B] rounded-lg overflow-hidden shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, -1)}
                          aria-label={`Kurangi ${product.name}`}
                          className="w-9 h-full flex items-center justify-center text-[#005A2B] hover:bg-[#005A2B]/10 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[#1A1A1A] tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, 1)}
                          aria-label={`Tambah ${product.name}`}
                          className="w-9 h-full flex items-center justify-center text-[#005A2B] hover:bg-[#005A2B]/10 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
