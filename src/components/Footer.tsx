import { MapPin, MessageCircle } from 'lucide-react';
import { BRANCHES, buildWhatsAppUrl, CATEGORIES } from '../data/products';
import { BranchId, CategoryId } from '../types/store';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  activeBranch: BranchId;
  onSelectBranch: (branch: BranchId) => void;
  onSelectCategory: (category: CategoryId) => void;
}

export function Footer({
  activeBranch,
  onSelectBranch,
  onSelectCategory,
}: FooterProps) {
  const categoryLinks = CATEGORIES.filter((c) => c.id !== 'semua');

  return (
    <footer className="bg-[#FAF9F6] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-[#E5E4DF]">
          {/* Brand Summary */}
          <div className="md:col-span-4">
            <BrandLogo className="h-10 w-auto object-contain" />
            <p className="mt-3 text-sm font-semibold text-[#1A1A1A]">
              Belanja Praktis, Harga Bersahabat.
            </p>
            <p className="mt-2 text-xs sm:text-sm text-[#666660] leading-relaxed max-w-xs">
              Minimarket modern untuk kebutuhan harian keluarga, pekerja,
              mahasiswa, dan etalase produk UMKM lokal pilihan di Jakarta &amp;
              Aceh.
            </p>
          </div>

          {/* Cabang Jakarta & Aceh */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold text-[#1A1A1A] tracking-wide mb-3.5">
              Cabang Operasional
            </h3>
            <ul className="space-y-3.5">
              {(['jakarta', 'aceh'] as BranchId[]).map((id) => {
                const info = BRANCHES[id];
                const isSelected = activeBranch === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectBranch(id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1A1A1A] group-hover:text-[#005A2B] transition-colors">
                        <MapPin
                          className="w-3.5 h-3.5 text-[#005A2B] shrink-0"
                          aria-hidden="true"
                        />
                        <span>{info.name}</span>
                        {isSelected && (
                          <span className="text-[11px] font-medium text-[#005A2B]">
                            (Aktif)
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[#666660] leading-relaxed">
                        {info.address}
                      </p>
                      <p className="text-[11px] text-[#666660] tabular-nums">
                        Buka {info.hours}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Kategori Produk */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold text-[#1A1A1A] tracking-wide mb-3.5">
              Kategori Produk
            </h3>
            <ul className="space-y-2">
              {categoryLinks.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(category.id)}
                    className="text-xs sm:text-sm text-[#666660] hover:text-[#005A2B] transition-colors text-left cursor-pointer"
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak WhatsApp */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold text-[#1A1A1A] tracking-wide mb-3.5">
              Kontak WhatsApp Cabang
            </h3>
            <div className="space-y-2.5">
              {(['jakarta', 'aceh'] as BranchId[]).map((id) => {
                const info = BRANCHES[id];
                const href = buildWhatsAppUrl(
                  info.whatsappNumber,
                  `Halo 4 AM ${info.name}, saya ingin bertanya mengenai stok produk dan layanan pesan antar.`
                );
                return (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 p-3 bg-white border border-[#E5E4DF] hover:border-[#005A2B] rounded-lg transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#005A2B]">
                        WhatsApp {info.cityLabel}
                      </p>
                      <p className="text-xs text-[#666660] tabular-nums mt-0.5">
                        {info.whatsappDisplay}
                      </p>
                    </div>
                    <MessageCircle
                      className="w-4 h-4 text-[#005A2B] shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#666660]">
          <p>&copy; {new Date().getFullYear()} 4 AM Minimarket. Jakarta &amp; Aceh.</p>
          <p>Pembayaran QRIS &amp; Tunai · Layanan Pesan Antar Lokal</p>
        </div>
      </div>
    </footer>
  );
}
