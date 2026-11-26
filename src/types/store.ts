export type BranchId = 'jakarta' | 'aceh';

export type CategoryId =
  | 'semua'
  | 'kebutuhan-pokok'
  | 'makanan-minuman'
  | 'rumah-tangga'
  | 'perawatan-pribadi'
  | 'umkm-lokal'
  | 'produk-praktis';

export type ProductVisualKind =
  | 'rice'
  | 'oil'
  | 'sugar'
  | 'eggs'
  | 'noodle'
  | 'water'
  | 'iced-coffee'
  | 'tea'
  | 'bread'
  | 'onigiri'
  | 'cold-brew'
  | 'detergent'
  | 'dish-soap'
  | 'tissue'
  | 'body-wash'
  | 'shampoo'
  | 'toothpaste'
  | 'gayo-coffee'
  | 'chips'
  | 'pastry'
  | 'honey';

export interface Product {
  id: string;
  name: string;
  category: Exclude<CategoryId, 'semua'>;
  categoryLabel: string;
  price: number;
  unit: string;
  shortNote: string;
  visualKind: ProductVisualKind;
  isUmkm?: boolean;
  umkmOrigin?: 'UMKM Aceh' | 'UMKM Jakarta';
  umkmRegion?: string;
  featuredUmkm?: boolean;
  branchPriority: {
    jakarta: number;
    aceh: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ServiceMode = 'delivery' | 'pickup';
export type PaymentMethod = 'qris' | 'cash';
export type SortMode = 'recommended' | 'price-asc' | 'price-desc';

export interface BranchInfo {
  id: BranchId;
  name: string;
  cityLabel: string;
  address: string;
  coverage: string;
  hours: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  bannerTitle: string;
  bannerDescription: string;
  priorityFocus: string;
}
