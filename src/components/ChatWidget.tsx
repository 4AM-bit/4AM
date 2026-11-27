import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Link2,
  Loader2,
  MessageCircle,
  MessageSquare,
  Plus,
  RefreshCw,
  RotateCcw,
  SendHorizontal,
  Settings2,
  X,
} from 'lucide-react';
import { BRANCHES, formatRupiah } from '../data/products';
import {
  ChatMessage,
  clearWebhookUrlOverride,
  formatTimeNow,
  getDefaultWebhookUrl,
  getOrCreateSessionId,
  isValidWebhookUrl,
  N8nTestResult,
  resetSessionId,
  resolveWebhookUrl,
  saveWebhookUrlOverride,
  sendChatMessage,
  testN8nConnection,
} from '../services/n8nChat';
import { BranchId, CartItem, Product } from '../types/store';
import { BrandLogo } from './BrandLogo';

interface ChatWidgetProps {
  branch: BranchId;
  cart: CartItem[];
  subtotal: number;
  hidden?: boolean;
  onAddProduct: (product: Product) => void;
  onOpenCheckout: () => void;
}

const QUICK_PROMPTS = [
  'Rekomendasi produk UMKM lokal',
  'Jam buka & alamat cabang',
  'Cara pesan antar & bayar QRIS',
  'Cek isi keranjang saya',
];

function createWelcomeMessage(branch: BranchId): ChatMessage {
  const activeBranch = BRANCHES[branch];
  return {
    id: `welcome-${Date.now()}`,
    role: 'assistant',
    content: `Halo! Saya Asisten Belanja 4 AM (${activeBranch.name}). Saya siap membantu cek produk harian, rekomendasi UMKM lokal, jam buka, pembayaran QRIS/WhatsApp, maupun menjawab berbagai pertanyaan harian Anda.`,
    timestamp: formatTimeNow(),
    source: 'store',
  };
}

export function ChatWidget({
  branch,
  cart,
  subtotal,
  hidden = false,
  onAddProduct,
  onOpenCheckout,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>(() => resolveWebhookUrl());
  const [webhookDraft, setWebhookDraft] = useState<string>(() =>
    resolveWebhookUrl()
  );
  const [webhookError, setWebhookError] = useState('');
  const [webhookSavedNotice, setWebhookSavedNotice] = useState(false);
  const [n8nDiagnostic, setN8nDiagnostic] = useState<string | null>(null);
  const [isTestingN8n, setIsTestingN8n] = useState(false);
  const [n8nTestResult, setN8nTestResult] = useState<N8nTestResult | null>(null);

  const [sessionId, setSessionId] = useState<string>(() =>
    getOrCreateSessionId()
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createWelcomeMessage(branch),
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const activeBranch = BRANCHES[branch];

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, isOpen]);

  useEffect(() => {
    if (isOpen && !showSettings) {
      inputRef.current?.focus();
    }
  }, [isOpen, showSettings]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!webhookSavedNotice) return;
    const timer = window.setTimeout(() => setWebhookSavedNotice(false), 2400);
    return () => window.clearTimeout(timer);
  }, [webhookSavedNotice]);

  if (hidden) return null;

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = webhookDraft.trim();

    if (trimmed && !isValidWebhookUrl(trimmed)) {
      setWebhookError('Masukkan URL valid yang diawali https:// atau http://');
      return;
    }

    setWebhookError('');
    setN8nTestResult(null);
    setN8nDiagnostic(null);
    const resolved = saveWebhookUrlOverride(trimmed);
    setWebhookUrl(resolved);
    setWebhookDraft(resolved);
    setWebhookSavedNotice(true);
    setShowSettings(false);
  };

  const handleResetWebhook = () => {
    const resolved = clearWebhookUrlOverride();
    setWebhookUrl(resolved);
    setWebhookDraft(resolved);
    setWebhookError('');
    setN8nTestResult(null);
    setN8nDiagnostic(null);
    setWebhookSavedNotice(true);
  };

  const handleTestConnection = async () => {
    const target = webhookDraft.trim() || webhookUrl;
    setIsTestingN8n(true);
    setN8nTestResult(null);
    const result = await testN8nConnection(target, branch);
    setN8nTestResult(result);
    if (result.ok) {
      setN8nDiagnostic(null);
    } else {
      setN8nDiagnostic(result.message);
    }
    setIsTestingN8n(false);
  };

  const handleResetConversation = () => {
    const nextSession = resetSessionId();
    setSessionId(nextSession);
    setMessages([createWelcomeMessage(branch)]);
  };

  const dispatchMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const targetUrl = webhookUrl.trim() || resolveWebhookUrl();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: formatTimeNow(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    const result = await sendChatMessage({
      webhookUrl: targetUrl,
      sessionId,
      message: trimmed,
      branch,
      cart,
      subtotal,
    });

    if (result.source === 'n8n') {
      setN8nDiagnostic(null);
    } else if (result.diagnostic) {
      setN8nDiagnostic(result.diagnostic);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: result.text,
        timestamp: formatTimeNow(),
        source: result.source,
        suggestedProducts: result.suggestedProducts,
        showCheckoutAction: result.showCheckoutAction,
      },
    ]);

    setIsSending(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void dispatchMessage(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
      {/* Chat Panel */}
      {isOpen && (
        <section
          aria-label="Asisten Belanja 4 AM"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[396px] h-[552px] max-h-[80vh] bg-[#FAF9F6] border border-[#E5E4DF] rounded-xl shadow-lg flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-[#E5E4DF] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <BrandLogo className="h-6 w-auto object-contain shrink-0" />
              <div className="h-4 w-px bg-[#E5E4DF]" aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-[#1A1A1A] leading-tight truncate">
                  Asisten Belanja
                </h2>
                <p className="text-[11px] text-[#666660] truncate">
                  {activeBranch.cityLabel} ·{' '}
                  <span className="text-[#005A2B] font-semibold">
                    Terhubung
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setWebhookDraft(webhookUrl);
                  setWebhookError('');
                  setShowSettings((prev) => !prev);
                }}
                title="Pengaturan Webhook n8n"
                aria-label="Pengaturan Webhook n8n"
                aria-expanded={showSettings}
                className={`w-8 h-8 inline-flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  showSettings
                    ? 'bg-[#005A2B] text-white'
                    : 'text-[#666660] hover:text-[#1A1A1A] hover:bg-[#FAF9F6]'
                }`}
              >
                <Settings2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleResetConversation}
                title="Mulai percakapan baru"
                aria-label="Mulai percakapan baru"
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#666660] hover:text-[#1A1A1A] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup chat"
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#666660] hover:text-[#1A1A1A] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Collapsible n8n Webhook Config & Live Diagnostics Panel */}
          {showSettings && (
            <form
              onSubmit={handleSaveWebhook}
              className="p-4 bg-white border-b border-[#E5E4DF] space-y-3 shrink-0"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                  <Link2
                    className="w-3.5 h-3.5 text-[#005A2B]"
                    aria-hidden="true"
                  />
                  Integrasi Webhook n8n
                </span>
                <button
                  type="button"
                  onClick={() => void handleTestConnection()}
                  disabled={isTestingN8n}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#005A2B] hover:underline disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3 h-3 ${isTestingN8n ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  <span>{isTestingN8n ? 'Menguji...' : 'Uji Koneksi'}</span>
                </button>
              </div>

              <div>
                <label
                  htmlFor="n8n-webhook-url"
                  className="block text-[11px] font-medium text-[#666660] mb-1"
                >
                  Endpoint Webhook Produksi (POST JSON)
                </label>
                <input
                  id="n8n-webhook-url"
                  type="url"
                  value={webhookDraft}
                  onChange={(e) => {
                    setWebhookDraft(e.target.value);
                    if (webhookError) setWebhookError('');
                  }}
                  placeholder={getDefaultWebhookUrl()}
                  className="w-full h-9 px-3 bg-[#FAF9F6] border border-[#E5E4DF] rounded-lg text-xs text-[#1A1A1A] placeholder:text-[#666660] focus:outline-none focus:border-[#005A2B]"
                />
                {webhookError && (
                  <p className="mt-1 text-[11px] text-[#D96F06] font-medium">
                    {webhookError}
                  </p>
                )}
              </div>

              {/* Live diagnostic output for store admin */}
              {(n8nTestResult || n8nDiagnostic) && (
                <div
                  className={`rounded-lg px-3 py-2 text-[11px] leading-relaxed border ${
                    n8nTestResult?.ok
                      ? 'bg-[#005A2B]/8 border-[#005A2B]/25 text-[#005A2B]'
                      : 'bg-[#FAF3EA] border-[#F5820D]/30 text-[#1A1A1A]'
                  }`}
                >
                  {n8nTestResult ? n8nTestResult.message : n8nDiagnostic}
                  {!n8nTestResult?.ok && (
                    <span className="block mt-1 text-[#666660]">
                      Selama n8n belum aktif, asisten otomatis menjawab dengan data
                      katalog 4 AM agar pelanggan tetap terlayani.
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleResetWebhook}
                  className="text-xs font-medium text-[#666660] hover:text-[#1A1A1A] cursor-pointer"
                >
                  Reset ke Default
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="h-8 px-3 text-xs font-medium text-[#666660] hover:text-[#1A1A1A] rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="h-8 px-3.5 bg-[#005A2B] hover:bg-[#004420] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Simpan URL
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Saved notice banner */}
          {webhookSavedNotice && (
            <div className="px-4 py-2 bg-[#005A2B]/10 border-b border-[#005A2B]/20 flex items-center gap-1.5 text-xs font-medium text-[#005A2B] shrink-0">
              <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>URL Webhook n8n aktif diperbarui.</span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-[#005A2B] text-white'
                        : 'bg-white text-[#1A1A1A] border border-[#E5E4DF]'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Actionable Product Cards inside Assistant Reply */}
                  {!isUser &&
                    msg.suggestedProducts &&
                    msg.suggestedProducts.length > 0 && (
                      <div className="mt-2 w-full max-w-[92%] space-y-1.5">
                        {msg.suggestedProducts.map((product) => (
                          <div
                            key={product.id}
                            className="bg-white border border-[#E5E4DF] rounded-lg px-3 py-2 flex items-center justify-between gap-2.5"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#1A1A1A] truncate">
                                {product.name}
                              </p>
                              <p className="text-[11px] text-[#666660] tabular-nums">
                                {formatRupiah(product.price)} · {product.unit}
                                {product.umkmOrigin ? ` · ${product.umkmOrigin}` : ''}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onAddProduct(product)}
                              className="inline-flex items-center gap-1 h-7 px-2.5 bg-[#005A2B] hover:bg-[#004420] text-white text-[11px] font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" aria-hidden="true" />
                              <span>Keranjang</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Direct Checkout Action inside Assistant Reply */}
                  {!isUser && msg.showCheckoutAction && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onOpenCheckout();
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 h-8 px-3 bg-[#005A2B] hover:bg-[#004420] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Buka Checkout WhatsApp</span>
                    </button>
                  )}

                  <span className="mt-1 px-1 text-[10px] text-[#666660] tabular-nums">
                    {msg.timestamp}
                    {!isUser && msg.source === 'n8n' ? ' · n8n' : ''}
                  </span>
                </div>
              );
            })}

            {/* Quick Suggestion Buttons (when conversation just started) */}
            {messages.length === 1 && !isSending && (
              <div className="pt-1 flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void dispatchMessage(prompt)}
                    className="px-2.5 py-1.5 bg-white hover:bg-[#F3F2EC] border border-[#E5E4DF] hover:border-[#005A2B] rounded-lg text-xs font-medium text-[#1A1A1A] transition-colors cursor-pointer text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {isSending && (
              <div className="flex items-center gap-2 text-xs text-[#666660] px-1 py-1">
                <Loader2
                  className="w-3.5 h-3.5 animate-spin text-[#005A2B]"
                  aria-hidden="true"
                />
                <span>Asisten 4 AM sedang mengetik...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-[#E5E4DF] flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              placeholder="Tanya produk, harga, atau cara pesan..."
              aria-label="Tulis pesan ke chatbot 4 AM"
              className="flex-1 h-10 px-3.5 bg-[#FAF9F6] border border-[#E5E4DF] rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#666660] focus:outline-none focus:border-[#005A2B] focus:bg-white disabled:opacity-60 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              aria-label="Kirim pesan"
              className="w-10 h-10 inline-flex items-center justify-center bg-[#005A2B] hover:bg-[#004420] disabled:bg-[#E5E4DF] disabled:text-[#666660] text-white rounded-lg transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <SendHorizontal className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Tutup asisten chat 4 AM' : 'Buka asisten chat 4 AM'}
        aria-expanded={isOpen}
        className="h-12 px-4 bg-[#005A2B] hover:bg-[#004420] text-white border border-[#004420] rounded-xl shadow-md inline-flex items-center gap-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#005A2B]"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Tutup Chat</span>
          </>
        ) : (
          <>
            <MessageSquare
              className="w-4 h-4 text-[#F5820D] shrink-0"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Asisten 4 AM</span>
            <span className="sm:hidden">Chat</span>
          </>
        )}
      </button>
    </div>
  );
}
