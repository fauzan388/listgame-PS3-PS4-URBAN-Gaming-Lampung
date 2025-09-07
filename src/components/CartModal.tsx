import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, Info } from 'lucide-react';
import { CartItem } from '../types';

export default function CartModal({
  items,
  setItems,
  onClose,
  formatIDR,
  subtotal,
  discountPercent,
  discountAmount,
  total,
  onCheckout,
}: {
  items: CartItem[];
  setItems: (fn: any) => void;
  onClose: () => void;
  formatIDR: (n: number) => string;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  onCheckout: () => void;
}) {
  return (
    <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        className="relative mx-auto mt-10 mb-10 max-w-4xl rounded-3xl bg-white shadow-xl overflow-hidden"
      >
        <div className="p-5 md:p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-black">Keranjang</h3>
            <p className="text-xs text-gray-600 mt-1">
              Jika tombol "Kirim ke Admin" ditekan, invoice PDF akan diunduh otomatis lalu chat WhatsApp akan terbuka.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Tutup">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 md:p-6">
          {items.length == 0 ? (
            <div className="text-center py-10 text-gray-500">Belum ada item di keranjang.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="flex flex-nowrap gap-3 pb-2 w-max">
                  {items.map((it) => (
                    <div key={it.id} className="min-w-[280px] max-w-[320px] flex-shrink-0 border border-gray-200 rounded-2xl p-3 bg-white shadow-sm">
                      <div className="font-semibold text-gray-900 line-clamp-2">{it.name}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{it.platform}</div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm font-medium">{formatIDR(it.price)}</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setItems((prev: CartItem[]) => prev.map((p) => (p.id === it.id ? { ...p, qty: Math.max(1, p.qty - 1) } : p)))}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{it.qty}</span>
                          <button
                            onClick={() => setItems((prev: CartItem[]) => prev.map((p) => (p.id === it.id ? { ...p, qty: p.qty + 1 } : p)))}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setItems((prev: CartItem[]) => prev.filter((p) => p.id !== it.id))}
                            className="ml-2 p-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Diskon (berdasarkan jumlah game PS3/PS4)</span>
                  <span className="font-semibold">{discountPercent}% (−{formatIDR(discountAmount)})</span>
                </div>
                <div className="flex items-center justify-between text-lg font-extrabold mt-3">
                  <span>Total</span>
                  <span>{formatIDR(total)}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Diskon: isi 5 game = 10%, 10 game = 15%, 15 game = 20%. Di atasnya tidak ada diskon lagi.
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button onClick={onCheckout} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white text-sm font-semibold px-4 py-3 hover:brightness-105 active:scale-[.98]">
                    Kirim ke Admin (WA)
                  </button>
                  <button onClick={() => setItems([])} className="sm:w-40 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold px-4 py-3 hover:bg-gray-50">
                    Kosongkan
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}