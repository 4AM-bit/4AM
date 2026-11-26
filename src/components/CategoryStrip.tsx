import {
  Clock,
  Coffee,
  Home,
  LayoutGrid,
  MapPin,
  Package,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { BRANCHES, CATEGORIES } from '../data/products';
import { BranchId, CategoryId, SortMode } from '../types/store';

interface CategoryStripProps {
  branch: BranchId;
  onBranchChange: (branch: BranchId) => void;
  activeCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  sortMode: SortMode;
  onSortChange: (sort: SortMode) => void;
}

const CATEGORY_ICONS: Record<CategoryId, typeof Package> = {
  semua: LayoutGrid,
  'kebutuhan-pokok': Package,
  'makanan-minuman': Coffee,
  'rumah-tangga': Home,
  'perawatan-pribadi': ShieldCheck,
  'umkm-lokal': Store,
  'produk-praktis': Clock,
};

export function CategoryStrip({
  branch,
  onBranchChange,
  activeCategory,
  onSelectCategory,
  sortMode,
  onSortChange,
}: CategoryStripProps) {
  const activeBranch = BRANCHES[branch];

  return (
    <section className="bg-[#FAF9F6] border-b border-[#E5E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Contextual Branch Recommendation Banner */}
        <div className="bg-white border border-[#E5E4DF] rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#666660]">
              <span className="inline-flex items-center gap-1 font-semibold text-[#005A2B]">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {activeBranch.name}
              </span>
              <span aria-hidden="true">·</span>
              <span>{activeBranch.priorityFocus}</span>
            </div>
            <h2 className="mt-1 text-sm sm:text-base font-bold text-[#1A1A1A] tracking-tight">
              {activeBranch.bannerTitle}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-[#666660] leading-relaxed">
              {activeBranch.bannerDescription}
            </p>
          </div>

          {/* Segmented Location Control */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              role="group"
              aria-label="Pilih lokasi cabang 4 AM"
              className="inline-flex p-1 bg-[#FAF9F6] border border-[#E5E4DF] rounded-lg"
            >
              <button
                type="button"
                onClick={() => onBranchChange('jakarta')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  branch === 'jakarta'
                    ? 'bg-[#005A2B] text-white'
                    : 'text-[#666660] hover:text-[#1A1A1A]'
                }`}
              >
                Jakarta
              </button>
              <button
                type="button"
                onClick={() => onBranchChange('aceh')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  branch === 'aceh'
                    ? 'bg-[#005A2B] text-white'
                    : 'text-[#666660] hover:text-[#1A1A1A]'
                }`}
              >
                Aceh
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Strip + Sort Control */}
        <div className="mt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div
            role="tablist"
            aria-label="Kategori produk"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.id];
              const isActive = activeCategory === category.id;
              const isUmkm = category.accent === 'orange';

              return (
                <button
                  key={category.id}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => onSelectCategory(category.id)}
                  className={`inline-flex items-center gap-2 h-10 px-3.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A2B] ${
                    isActive
                      ? isUmkm
                        ? 'bg-[#F5820D] text-white border-[#F5820D]'
                        : 'bg-[#005A2B] text-white border-[#005A2B]'
                      : isUmkm
                        ? 'bg-white text-[#1A1A1A] border-[#F5820D]/50 hover:border-[#F5820D]'
                        : 'bg-white text-[#1A1A1A] border-[#E5E4DF] hover:border-[#1A1A1A]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-white'
                        : isUmkm
                          ? 'text-[#F5820D]'
                          : 'text-[#666660]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{category.label}</span>
                  {isUmkm && !isActive && (
                    <span className="text-[11px] font-semibold text-[#D96F06] pl-0.5">
                      Pilihan
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sort Select */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            <label
              htmlFor="catalog-sort"
              className="text-xs text-[#666660] whitespace-nowrap"
            >
              Urutkan:
            </label>
            <select
              id="catalog-sort"
              value={sortMode}
              onChange={(e) => onSortChange(e.target.value as SortMode)}
              className="h-9 px-3 bg-white border border-[#E5E4DF] rounded-lg text-xs sm:text-sm font-medium text-[#1A1A1A] focus:outline-none focus:border-[#005A2B] cursor-pointer"
            >
              <option value="recommended">
                Rekomendasi {activeBranch.cityLabel}
              </option>
              <option value="price-asc">Harga: Terendah</option>
              <option value="price-desc">Harga: Tertinggi</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
