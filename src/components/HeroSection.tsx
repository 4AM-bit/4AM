import { ArrowDownRight, ArrowRight, Clock, MessageCircle, QrCode, Store } from 'lucide-react';
import { BRANCHES } from '../data/products';
import { BranchId } from '../types/store';

interface HeroSectionProps {
  branch: BranchId;
  onBranchChange: (branch: BranchId) => void;
  onStartShopping: () => void;
  onOrderWhatsApp: () => void;
  onSelectUmkm: () => void;
}

export function HeroSection({
  branch,
  onBranchChange,
  onStartShopping,
  onOrderWhatsApp,
  onSelectUmkm,
}: HeroSectionProps) {
  const activeBranch = BRANCHES[branch];

  return (
    <section className="border-b border-[#E5E4DF] bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-1">
            <div>
              {/* Quiet unboxed branch context metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#666660] mb-4">
                <span className="font-medium text-[#005A2B]">
                  {activeBranch.name}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">Buka {activeBranch.hours}</span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() =>
                    onBranchChange(branch === 'jakarta' ? 'aceh' : 'jakarta')
                  }
                  className="underline decoration-[#E5E4DF] underline-offset-4 hover:text-[#1A1A1A] hover:decoration-[#1A1A1A] transition-colors cursor-pointer"
                >
                  Ganti ke {branch === 'jakarta' ? 'Aceh' : 'Jakarta'}
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#1A1A1A] leading-[1.12] [text-wrap:balance]">
                Belanja Praktis, Harga Bersahabat.
              </h1>

              <p className="mt-4 text-[15px] sm:text-base text-[#666660] leading-relaxed max-w-xl">
                Minimarket modern untuk kebutuhan harian dan produk UMKM lokal
                pilihan di Jakarta &amp; Aceh. Siap melayani sejak subuh hingga
                malam.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onStartShopping}
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-[#005A2B] hover:bg-[#004420] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#005A2B]"
                >
                  <span>Mulai Belanja</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onOrderWhatsApp}
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-white hover:bg-[#F5F4EF] text-[#1A1A1A] border border-[#E5E4DF] hover:border-[#1A1A1A] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A2B]"
                >
                  <MessageCircle className="w-4 h-4 text-[#005A2B]" aria-hidden="true" />
                  <span>Pesan Antar via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Grounded branch address strip */}
            <div className="mt-7 pt-5 border-t border-[#E5E4DF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#666660]">
              <span>{activeBranch.address}</span>
              <span className="text-[#1A1A1A] font-medium">
                Jangkauan: {activeBranch.coverage}
              </span>
            </div>
          </div>

          {/* Right Asymmetric 3-Pillar Bento Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Pillar (a): Buka & Siap Antar — full top span */}
            <div className="sm:col-span-2 bg-[#005A2B] text-white rounded-xl p-5 sm:p-6 flex flex-col justify-between border border-[#005A2B]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-white/75">
                    Layanan Harian · Jakarta &amp; Aceh
                  </p>
                  <h2 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight">
                    Buka &amp; Siap Antar
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#F5820D]" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-end justify-between gap-3">
                <p className="text-sm text-white/85 max-w-md leading-relaxed">
                  Belanja pagi sebelum berangkat kerja atau pesan stok dapur
                  dari rumah — diantar cepat dari cabang terdekat.
                </p>
                <span className="text-sm font-bold tracking-tight text-white tabular-nums whitespace-nowrap">
                  04.00 – 23.00 WIB
                </span>
              </div>
            </div>

            {/* Pillar (b): Bayar Mudah dengan QRIS */}
            <div className="bg-white rounded-xl p-5 border border-[#E5E4DF] flex flex-col justify-between">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-[#666660]">
                  Pembayaran Praktis
                </span>
                <QrCode className="w-5 h-5 text-[#005A2B]" aria-hidden="true" />
              </div>
              <div className="mt-5">
                <h3 className="text-base font-bold text-[#1A1A1A] tracking-tight">
                  Bayar Mudah dengan QRIS
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#666660] leading-relaxed">
                  Scan QRIS di kasir atau saat pesanan tiba. Pilihan bayar tunai
                  tetap tersedia.
                </p>
              </div>
            </div>

            {/* Pillar (c): Etalase UMKM Lokal */}
            <button
              type="button"
              onClick={onSelectUmkm}
              className="group text-left bg-white hover:bg-[#FFFBF6] rounded-xl p-5 border border-[#E5E4DF] hover:border-[#F5820D] transition-colors flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820D]"
            >
              <div className="flex items-center justify-between gap-3 w-full">
                <span className="text-xs font-semibold text-[#D96F06]">
                  Kurasi Aceh &amp; Jakarta
                </span>
                <Store className="w-5 h-5 text-[#F5820D]" aria-hidden="true" />
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-[#1A1A1A] tracking-tight">
                    Etalase UMKM Lokal
                  </h3>
                  <ArrowDownRight
                    className="w-4 h-4 text-[#F5820D] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 shrink-0"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-[#666660] leading-relaxed">
                  Kopi Gayo, camilan khas daerah, dan kudapan rumahan langsung
                  dari pelaku usaha lokal.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
