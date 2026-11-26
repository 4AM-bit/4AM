import {
  BranchId,
  BranchInfo,
  CartItem,
  CategoryId,
  PaymentMethod,
  Product,
  ServiceMode,
} from '../types/store';

export const BRANCHES: Record<BranchId, BranchInfo> = {
  jakarta: {
    id: 'jakarta',
    name: 'Cabang Jakarta',
    cityLabel: 'Jakarta',
    address: 'Jl. Tebet Barat Dalam Raya No. 42, Jakarta Selatan',
    coverage: 'Tebet, Kuningan, Pancoran, & sekitarnya (maks. 5 km)',
    hours: '04.00 – 23.00 WIB',
    whatsappNumber: '6281280040404',
    whatsappDisplay: '+62 812-8004-0404',
    bannerTitle: 'Prioritas Cabang Jakarta: Produk Praktis & Siap Santap',
    bannerDescription:
      'Katalog diurutkan untuk kebutuhan cepat harian — roti segar, kopi siap minum, onigiri, dan minuman dingin untuk jadwal padat pekerja dan mahasiswa.',
    priorityFocus: 'Produk Praktis & Makanan Siap Konsumsi',
  },
  aceh: {
    id: 'aceh',
    name: 'Cabang Aceh',
    cityLabel: 'Aceh',
    address: 'Jl. Teuku Nyak Arief No. 18, Syiah Kuala, Banda Aceh',
    coverage: 'Syiah Kuala, Kuta Alam, Darussalam, & sekitarnya (maks. 6 km)',
    hours: '04.00 – 23.00 WIB',
    whatsappNumber: '6281168040404',
    whatsappDisplay: '+62 811-6804-0404',
    bannerTitle: 'Prioritas Cabang Aceh: Kebutuhan Pokok & UMKM Lokal',
    bannerDescription:
      'Katalog diurutkan untuk belanja keluarga — beras, minyak goreng, perlengkapan rumah tangga, serta kopi Gayo dan kudapan khas pengrajin Aceh.',
    priorityFocus: 'Kebutuhan Pokok, Rumah Tangga & UMKM Aceh',
  },
};

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  shortLabel: string;
  accent?: 'orange';
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'semua', label: 'Semua Produk', shortLabel: 'Semua' },
  { id: 'kebutuhan-pokok', label: 'Kebutuhan Pokok', shortLabel: 'Pokok' },
  { id: 'makanan-minuman', label: 'Makanan & Minuman', shortLabel: 'Makanan' },
  {
    id: 'rumah-tangga',
    label: 'Perlengkapan Rumah Tangga',
    shortLabel: 'Rumah Tangga',
  },
  {
    id: 'perawatan-pribadi',
    label: 'Perawatan Pribadi',
    shortLabel: 'Perawatan',
  },
  {
    id: 'umkm-lokal',
    label: 'Produk UMKM Lokal',
    shortLabel: 'UMKM Lokal',
    accent: 'orange',
  },
  { id: 'produk-praktis', label: 'Produk Praktis', shortLabel: 'Praktis' },
];

export const PRODUCTS: Product[] = [
  // PRODUK PRAKTIS (High priority for Jakarta)
  {
    id: 'roti-tawar-cokelat',
    name: 'Roti Lembut Isi Cokelat Klasik',
    category: 'produk-praktis',
    categoryLabel: 'Produk Praktis',
    price: 14500,
    unit: '120 g',
    shortNote: 'Dipanggang pagi, praktis untuk sarapan cepat',
    visualKind: 'bread',
    branchPriority: { jakarta: 1, aceh: 13 },
  },
  {
    id: 'onigiri-tuna-mayo',
    name: 'Onigiri Tuna Mayo Siap Santap',
    category: 'produk-praktis',
    categoryLabel: 'Produk Praktis',
    price: 15000,
    unit: '115 g',
    shortNote: 'Nasi pulen rumput laut renyah, stok harian baru',
    visualKind: 'onigiri',
    branchPriority: { jakarta: 2, aceh: 15 },
  },
  {
    id: 'cold-brew-hitam',
    name: 'Cold Brew Kopi Hitam Dingin',
    category: 'produk-praktis',
    categoryLabel: 'Produk Praktis',
    price: 14000,
    unit: '250 ml',
    shortNote: 'Seduhan dingin tanpa gula tambahan, siap minum',
    visualKind: 'cold-brew',
    branchPriority: { jakarta: 3, aceh: 16 },
  },
  {
    id: 'teh-melati-dingin',
    name: 'Teh Melati Dingin Rendah Gula',
    category: 'produk-praktis',
    categoryLabel: 'Produk Praktis',
    price: 6500,
    unit: '500 ml',
    shortNote: 'Segar langsung dari chiller toko 4 AM',
    visualKind: 'tea',
    branchPriority: { jakarta: 4, aceh: 14 },
  },

  // PRODUK UMKM LOKAL (Featured Editorial + High priority for Aceh)
  {
    id: 'kopi-gayo-umkm',
    name: 'Kopi Arabika Gayo Bubuk Pilihan',
    category: 'umkm-lokal',
    categoryLabel: 'Produk UMKM Lokal',
    price: 58000,
    unit: '250 g',
    shortNote: 'Sangrai medium petani dataran tinggi Takengon',
    visualKind: 'gayo-coffee',
    isUmkm: true,
    umkmOrigin: 'UMKM Aceh',
    umkmRegion: 'Takengon',
    featuredUmkm: true,
    branchPriority: { jakarta: 6, aceh: 2 },
  },
  {
    id: 'keripik-emping-aceh',
    name: 'Keripik Pisang & Emping Melinjo',
    category: 'umkm-lokal',
    categoryLabel: 'Produk UMKM Lokal',
    price: 28000,
    unit: '200 g',
    shortNote: 'Camilan gurih renyah olahan dapur lokal Pidie',
    visualKind: 'chips',
    isUmkm: true,
    umkmOrigin: 'UMKM Aceh',
    umkmRegion: 'Pidie',
    featuredUmkm: true,
    branchPriority: { jakarta: 10, aceh: 5 },
  },
  {
    id: 'roti-kudapan-jakarta',
    name: 'Roti Manis & Kudapan Rumahan',
    category: 'umkm-lokal',
    categoryLabel: 'Produk UMKM Lokal',
    price: 32000,
    unit: 'Isi 6 pcs',
    shortNote: 'Tanpa pengawet, dikirim segar setiap pukul 05.00',
    visualKind: 'pastry',
    isUmkm: true,
    umkmOrigin: 'UMKM Jakarta',
    umkmRegion: 'Tebet',
    featuredUmkm: true,
    branchPriority: { jakarta: 5, aceh: 12 },
  },
  {
    id: 'madu-hutan-gayo',
    name: 'Madu Hutan Murni Gayo',
    category: 'umkm-lokal',
    categoryLabel: 'Produk UMKM Lokal',
    price: 72000,
    unit: '350 ml',
    shortNote: 'Panen alami kelompok tani lebah hutan Aceh',
    visualKind: 'honey',
    isUmkm: true,
    umkmOrigin: 'UMKM Aceh',
    umkmRegion: 'Aceh Tengah',
    featuredUmkm: false,
    branchPriority: { jakarta: 14, aceh: 7 },
  },

  // KEBUTUHAN POKOK (Top priority for Aceh)
  {
    id: 'beras-premium-5kg',
    name: 'Beras Pandan Wangi Premium',
    category: 'kebutuhan-pokok',
    categoryLabel: 'Kebutuhan Pokok',
    price: 76500,
    unit: '5 kg',
    shortNote: 'Pulen, bersih tanpa pemutih, stok panen terbaru',
    visualKind: 'rice',
    branchPriority: { jakarta: 11, aceh: 1 },
  },
  {
    id: 'minyak-goreng-2l',
    name: 'Minyak Goreng Sawit Kemasan',
    category: 'kebutuhan-pokok',
    categoryLabel: 'Kebutuhan Pokok',
    price: 36000,
    unit: '2 L',
    shortNote: 'Jernih 2x penyaringan, pouch praktis anti bocor',
    visualKind: 'oil',
    branchPriority: { jakarta: 12, aceh: 3 },
  },
  {
    id: 'gula-pasir-1kg',
    name: 'Gula Pasir Kristal Putih',
    category: 'kebutuhan-pokok',
    categoryLabel: 'Kebutuhan Pokok',
    price: 17500,
    unit: '1 kg',
    shortNote: 'Tebu pilihan higienis untuk masakan dan minuman',
    visualKind: 'sugar',
    branchPriority: { jakarta: 15, aceh: 4 },
  },
  {
    id: 'telur-ayam-1kg',
    name: 'Telur Ayam Negeri Segar',
    category: 'kebutuhan-pokok',
    categoryLabel: 'Kebutuhan Pokok',
    price: 29000,
    unit: '1 kg',
    shortNote: 'Cangkang bersih pilihan, dikemas tray aman',
    visualKind: 'eggs',
    branchPriority: { jakarta: 13, aceh: 6 },
  },

  // MAKANAN & MINUMAN
  {
    id: 'kopi-siap-minum',
    name: 'Kopi Susu Gula Aren Siap Minum',
    category: 'makanan-minuman',
    categoryLabel: 'Makanan & Minuman',
    price: 12500,
    unit: '250 ml',
    shortNote: 'Perpaduan espresso arabika dan gula aren seimbang',
    visualKind: 'iced-coffee',
    branchPriority: { jakarta: 7, aceh: 17 },
  },
  {
    id: 'air-mineral-600ml',
    name: 'Air Mineral Pegunungan',
    category: 'makanan-minuman',
    categoryLabel: 'Makanan & Minuman',
    price: 4000,
    unit: '600 ml',
    shortNote: 'Tersedia suhu ruang atau dingin siap bawa',
    visualKind: 'water',
    branchPriority: { jakarta: 8, aceh: 11 },
  },
  {
    id: 'mi-instan-goreng',
    name: 'Mi Instan Goreng Klasik (Isi 5)',
    category: 'makanan-minuman',
    categoryLabel: 'Makanan & Minuman',
    price: 16500,
    unit: '5 x 85 g',
    shortNote: 'Paket hemat 5 bungkus dengan bawang goreng renyah',
    visualKind: 'noodle',
    branchPriority: { jakarta: 9, aceh: 10 },
  },

  // PERLENGKAPAN RUMAH TANGGA (Elevated for Aceh)
  {
    id: 'deterjen-cair-750ml',
    name: 'Deterjen Cair Konsentrat',
    category: 'rumah-tangga',
    categoryLabel: 'Perlengkapan Rumah Tangga',
    price: 21500,
    unit: '750 ml',
    shortNote: 'Lembut di tangan, efektif angkat noda harian',
    visualKind: 'detergent',
    branchPriority: { jakarta: 16, aceh: 8 },
  },
  {
    id: 'sabun-cuci-piring',
    name: 'Sabun Cuci Piring Jeruk Nipis',
    category: 'rumah-tangga',
    categoryLabel: 'Perlengkapan Rumah Tangga',
    price: 14500,
    unit: '650 ml',
    shortNote: 'Cepat bersihkan lemak dapur dengan aroma segar',
    visualKind: 'dish-soap',
    branchPriority: { jakarta: 17, aceh: 9 },
  },
  {
    id: 'tisu-wajah-2ply',
    name: 'Tisu Wajah Lembut 2 Ply',
    category: 'rumah-tangga',
    categoryLabel: 'Perlengkapan Rumah Tangga',
    price: 13500,
    unit: '250 sheet',
    shortNote: 'Serat alami halus tanpa parfum tambahan',
    visualKind: 'tissue',
    branchPriority: { jakarta: 18, aceh: 18 },
  },

  // PERAWATAN PRIBADI
  {
    id: 'sabun-mandi-refill',
    name: 'Sabun Mandi Cair Mild Care',
    category: 'perawatan-pribadi',
    categoryLabel: 'Perawatan Pribadi',
    price: 24000,
    unit: '400 ml',
    shortNote: 'Formula lembut menjaga kelembapan kulit harian',
    visualKind: 'body-wash',
    branchPriority: { jakarta: 19, aceh: 19 },
  },
  {
    id: 'sampo-harian-170ml',
    name: 'Sampo Perawatan Harian',
    category: 'perawatan-pribadi',
    categoryLabel: 'Perawatan Pribadi',
    price: 26500,
    unit: '170 ml',
    shortNote: 'Bersih segar untuk kulit kepala aktif seharian',
    visualKind: 'shampoo',
    branchPriority: { jakarta: 20, aceh: 20 },
  },
  {
    id: 'pasta-gigi-herbal',
    name: 'Pasta Gigi Herbal Mint',
    category: 'perawatan-pribadi',
    categoryLabel: 'Perawatan Pribadi',
    price: 15500,
    unit: '150 g',
    shortNote: 'Perlindungan gigi harian dengan sensasi mint alami',
    visualKind: 'toothpaste',
    branchPriority: { jakarta: 21, aceh: 21 },
  },
];

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function buildWhatsAppOrderMessage(params: {
  branch: BranchInfo;
  customerName: string;
  addressOrNotes: string;
  serviceMode: ServiceMode;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
}): string {
  const {
    branch,
    customerName,
    addressOrNotes,
    serviceMode,
    paymentMethod,
    items,
    subtotal,
  } = params;

  const serviceLabel =
    serviceMode === 'delivery'
      ? 'Pesan Antar (Sesuai jangkauan toko)'
      : 'Ambil di Toko';

  const paymentLabel =
    paymentMethod === 'qris'
      ? 'QRIS (Scan di tempat / Kirim bukti)'
      : serviceMode === 'delivery'
        ? 'Tunai saat antar'
        : 'Tunai di kasir';

  const lines: string[] = [
    '*PESANAN BARU — 4 AM MINIMARKET*',
    `Cabang: ${branch.name} (${branch.cityLabel})`,
    `Nama: ${customerName.trim() || '-'}`,
    `Layanan: ${serviceLabel}`,
    serviceMode === 'delivery'
      ? `Alamat & Catatan: ${addressOrNotes.trim() || '-'}`
      : `Catatan Ambil: ${addressOrNotes.trim() || 'Ambil segera di toko'}`,
    `Pembayaran: ${paymentLabel}`,
    '',
    '*Daftar Belanja:*',
  ];

  items.forEach((item, index) => {
    const lineTotal = item.product.price * item.quantity;
    lines.push(
      `${index + 1}. ${item.product.name} (${item.product.unit}) x${item.quantity} = ${formatRupiah(lineTotal)}`
    );
  });

  lines.push('');
  lines.push(`*Subtotal Belanja: ${formatRupiah(subtotal)}*`);
  lines.push(
    serviceMode === 'delivery'
      ? '_Catatan: Ongkir lokal disesuaikan dengan jarak dari toko._'
      : `_Lokasi ambil: ${branch.address}_`
  );

  return lines.join('\n');
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
