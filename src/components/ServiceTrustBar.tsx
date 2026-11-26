import { MessageCircle, QrCode, Truck } from 'lucide-react';

export function ServiceTrustBar() {
  const pillars = [
    {
      number: '01',
      title: 'Pesan via WhatsApp',
      description:
        'Kirim daftar belanja langsung ke cabang terdekat tanpa perlu registrasi akun yang rumit.',
      icon: MessageCircle,
    },
    {
      number: '02',
      title: 'Pembayaran QRIS',
      description:
        'Transaksi cepat, aman, tanpa uang tunai di kasir maupun saat pesanan diterima di rumah.',
      icon: QrCode,
    },
    {
      number: '03',
      title: 'Pesan Antar Lokal',
      description:
        'Pengiriman cepat sesuai jangkauan toko di Jakarta & Aceh, disiapkan langsung oleh staf cabang.',
      icon: Truck,
    },
  ];

  return (
    <section className="py-10 md:py-12 bg-white border-b border-[#E5E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E4DF] border border-[#E5E4DF] rounded-xl overflow-hidden bg-[#FAF9F6]">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.number} className="p-6 sm:p-7 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#666660] tabular-nums">
                    {pillar.number}.
                  </span>
                  <Icon className="w-5 h-5 text-[#005A2B]" aria-hidden="true" />
                </div>
                <div className="mt-5">
                  <h3 className="text-base font-bold text-[#1A1A1A] tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-[#666660] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
