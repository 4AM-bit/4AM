import { useEffect, useState } from 'react';
import {
  Banknote,
  Check,
  Copy,
  MapPin,
  MessageCircle,
  QrCode,
  Store,
  Truck,
  X,
} from 'lucide-react';
import {
  BRANCHES,
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  formatRupiah,
} from '../data/products';
import {
  BranchId,
  CartItem,
  PaymentMethod,
  ServiceMode,
} from '../types/store';
import { BrandLogo } from './BrandLogo';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  branch: BranchId;
  onBranchChange: (branch: BranchId) => void;
  onOrderSubmitted: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  subtotal,
  branch,
  onBranchChange,
  onOrderSubmitted,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [addressOrNotes, setAddressOrNotes] = useState('');
  const [serviceMode, setServiceMode] = useState<ServiceMode>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!isOpen) return null;

  const activeBranch = BRANCHES[branch];
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const orderMessage =
    items.length > 0
      ? buildWhatsAppOrderMessage({
          branch: activeBranch,
          customerName,
          addressOrNotes,
          serviceMode,
          paymentMethod,
          items,
          subtotal,
        })
      : [
          '*PESANAN / PERTANYAAN — 4 AM MINIMARKET*',
          `Cabang: ${activeBranch.name} (${activeBranch.cityLabel})`,
          `Nama: ${customerName.trim() || '-'}`,
          `Layanan: ${
            serviceMode === 'delivery'
              ? 'Pesan Antar (Sesuai jangkauan toko)'
              : 'Ambil di Toko'
          }`,
          `Alamat/Catatan: ${addressOrNotes.trim() || 'Halo, saya ingin pesan produk harian.'}`,
          `Pembayaran: ${
            paymentMethod === 'qris'
              ? 'QRIS (Scan di tempat / Kirim bukti)'
              : 'Tunai'
          }`,
        ].join('\n');

  const whatsappHref = buildWhatsAppUrl(
    activeBranch.whatsappNumber,
    orderMessage
  );

  const isNameValid = customerName.trim().length >= 2;
  const isAddressValid =
    serviceMode === 'pickup' || addressOrNotes.trim().length >= 6;
  const isFormReady = isNameValid && isAddressValid;

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setCopied(true);
    } catch {
      // Fallback textarea copy if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = orderMessage;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isNameValid) {
      e.preventDefault();
      setValidationError('Mohon isi nama pemesan terlebih dahulu.');
      return;
    }
    if (!isAddressValid) {
      e.preventDefault();
      setValidationError(
        'Mohon isi alamat lengkap untuk layanan pesan antar.'
      );
      return;
    }
    setValidationError('');
    onOrderSubmitted();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout Pesanan via WhatsApp"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1A1A1A]/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] bg-[#FAF9F6] border border-[#E5E4DF] rounded-xl flex flex-col overflow-hidden">
        {/* Compact Brand Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E5E4DF] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo className="h-7 w-auto object-contain shrink-0" />
            <div className="h-5 w-px bg-[#E5E4DF]" aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] leading-tight">
                Checkout via WhatsApp
              </h2>
              <p className="text-xs text-[#666660] truncate">
                Pesanan langsung diteruskan ke kasir cabang
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup checkout"
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-[#666660] hover:text-[#1A1A1A] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Branch Switcher Row */}
          <div className="bg-white border border-[#E5E4DF] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#005A2B]">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{activeBranch.name}</span>
              </div>
              <p className="text-xs text-[#666660] mt-0.5">
                {activeBranch.address}
              </p>
            </div>

            <div className="inline-flex p-1 bg-[#FAF9F6] border border-[#E5E4DF] rounded-lg self-start sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => onBranchChange('jakarta')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
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
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  branch === 'aceh'
                    ? 'bg-[#005A2B] text-white'
                    : 'text-[#666660] hover:text-[#1A1A1A]'
                }`}
              >
                Aceh
              </button>
            </div>
          </div>

          {/* Service Mode Toggle */}
          <div>
            <p className="text-xs font-semibold text-[#1A1A1A] mb-2">
              Metode Layanan
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setServiceMode('delivery');
                  setValidationError('');
                }}
                className={`p-3.5 rounded-xl border text-left transition-colors flex items-start gap-3 cursor-pointer ${
                  serviceMode === 'delivery'
                    ? 'bg-white border-[#005A2B] ring-1 ring-[#005A2B]'
                    : 'bg-white border-[#E5E4DF] hover:border-[#1A1A1A]'
                }`}
              >
                <Truck
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    serviceMode === 'delivery'
                      ? 'text-[#005A2B]'
                      : 'text-[#666660]'
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    Pesan Antar
                  </p>
                  <p className="text-xs text-[#666660] mt-0.5">
                    Sesuai jangkauan toko
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setServiceMode('pickup');
                  setValidationError('');
                }}
                className={`p-3.5 rounded-xl border text-left transition-colors flex items-start gap-3 cursor-pointer ${
                  serviceMode === 'pickup'
                    ? 'bg-white border-[#005A2B] ring-1 ring-[#005A2B]'
                    : 'bg-white border-[#E5E4DF] hover:border-[#1A1A1A]'
                }`}
              >
                <Store
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    serviceMode === 'pickup'
                      ? 'text-[#005A2B]'
                      : 'text-[#666660]'
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    Ambil di Toko
                  </p>
                  <p className="text-xs text-[#666660] mt-0.5">
                    Siap diambil tanpa antre
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Customer Name & Address / Notes */}
          <div className="space-y-3.5">
            <div>
              <label
                htmlFor="checkout-name"
                className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
              >
                Nama Pemesan <span className="text-[#D96F06]">*</span>
              </label>
              <input
                id="checkout-name"
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="Contoh: Rina Pratama"
                className="w-full h-10 px-3.5 bg-white border border-[#E5E4DF] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#666660] focus:outline-none focus:border-[#005A2B] focus:ring-1 focus:ring-[#005A2B]"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-address"
                className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
              >
                {serviceMode === 'delivery' ? (
                  <>
                    Alamat Pengantaran &amp; Catatan{' '}
                    <span className="text-[#D96F06]">*</span>
                  </>
                ) : (
                  'Catatan Pengambilan (Opsional)'
                )}
              </label>
              <textarea
                id="checkout-address"
                rows={2}
                value={addressOrNotes}
                onChange={(e) => {
                  setAddressOrNotes(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder={
                  serviceMode === 'delivery'
                    ? 'Contoh: Jl. Tebet Timur No. 12, pagar hijau, titip di pos satpam'
                    : 'Contoh: Diambil sekitar pukul 07.30 WIB, tolong siapkan kantong belanja'
                }
                className="w-full p-3 bg-white border border-[#E5E4DF] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#666660] focus:outline-none focus:border-[#005A2B] focus:ring-1 focus:ring-[#005A2B] resize-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <p className="text-xs font-semibold text-[#1A1A1A] mb-2">
              Metode Pembayaran
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={`p-3.5 rounded-xl border text-left transition-colors flex items-start gap-3 cursor-pointer ${
                  paymentMethod === 'qris'
                    ? 'bg-white border-[#005A2B] ring-1 ring-[#005A2B]'
                    : 'bg-white border-[#E5E4DF] hover:border-[#1A1A1A]'
                }`}
              >
                <QrCode
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    paymentMethod === 'qris'
                      ? 'text-[#005A2B]'
                      : 'text-[#666660]'
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">QRIS</p>
                  <p className="text-xs text-[#666660] mt-0.5">
                    Scan di tempat / Kirim bukti
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3.5 rounded-xl border text-left transition-colors flex items-start gap-3 cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'bg-white border-[#005A2B] ring-1 ring-[#005A2B]'
                    : 'bg-white border-[#E5E4DF] hover:border-[#1A1A1A]'
                }`}
              >
                <Banknote
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    paymentMethod === 'cash'
                      ? 'text-[#005A2B]'
                      : 'text-[#666660]'
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    {serviceMode === 'delivery'
                      ? 'Tunai saat antar'
                      : 'Tunai di kasir'}
                  </p>
                  <p className="text-xs text-[#666660] mt-0.5">
                    Bayar langsung ketika pesanan diterima
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-white border border-[#E5E4DF] rounded-xl p-4">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E5E4DF]">
              <span className="text-xs font-bold text-[#1A1A1A]">
                Ringkasan Pesanan ({totalCount} barang)
              </span>
              <span className="text-sm font-extrabold text-[#005A2B] tabular-nums">
                {formatRupiah(subtotal)}
              </span>
            </div>

            {items.length > 0 ? (
              <ul className="mt-2.5 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <li
                    key={product.id}
                    className="flex items-baseline justify-between gap-3 text-xs"
                  >
                    <span className="text-[#1A1A1A] truncate">
                      {product.name}{' '}
                      <span className="text-[#666660] tabular-nums">
                        x{quantity}
                      </span>
                    </span>
                    <span className="font-semibold text-[#1A1A1A] tabular-nums shrink-0">
                      {formatRupiah(product.price * quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2.5 text-xs text-[#666660]">
                Belum ada produk di keranjang. Anda tetap bisa mengirim pesan
                langsung ke WhatsApp {activeBranch.name} atau kembali memilih
                produk.
              </p>
            )}
          </div>

          {validationError && (
            <p
              role="alert"
              className="text-xs font-semibold text-[#D96F06] bg-[#FAF3EA] border border-[#F5820D]/30 rounded-lg px-3.5 py-2.5"
            >
              {validationError}
            </p>
          )}
        </div>

        {/* Sticky Modal Footer Actions */}
        <div className="px-5 py-4 bg-white border-t border-[#E5E4DF] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopySummary}
            className="h-11 px-4 bg-[#FAF9F6] hover:bg-[#F1F0EA] text-[#1A1A1A] border border-[#E5E4DF] text-xs sm:text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#005A2B]" aria-hidden="true" />
                <span>Ringkasan Disalin</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#666660]" aria-hidden="true" />
                <span>Salin Ringkasan Pesanan</span>
              </>
            )}
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className={`flex-1 h-11 px-5 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
              isFormReady
                ? 'bg-[#005A2B] hover:bg-[#004420] text-white'
                : 'bg-[#005A2B]/85 hover:bg-[#005A2B] text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>Kirim Pesanan via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
